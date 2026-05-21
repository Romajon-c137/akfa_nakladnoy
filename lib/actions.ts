'use server';

import { cookies, headers } from 'next/headers';
import { createHash, randomBytes } from 'crypto';
import { invoices, rateLimits, type InvoiceDoc } from './mongodb';
import { Invoice } from './types';
import {
  InvoiceSchema,
  InvoicePatchSchema,
  InvoiceIdSchema,
  PinSchema,
} from './schemas';

const SESSION_COOKIE = 'akfa_sid';
const LOCKOUT_THRESHOLD = 5;
const LOCKOUT_MS = 10 * 60 * 1000;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // forget failures after 1h

// ── Helpers ─────────────────────────────────────────────────────

function toInvoice(doc: InvoiceDoc): Invoice {
  const { _id, ...rest } = doc;
  return { ...rest, id: _id };
}

async function clientFingerprint(): Promise<string> {
  const h = await headers();
  const ip =
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    h.get('x-real-ip') ||
    'unknown';

  const c = await cookies();
  let sid = c.get(SESSION_COOKIE)?.value;
  if (!sid) {
    sid = randomBytes(16).toString('hex');
    c.set(SESSION_COOKIE, sid, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
  }
  return createHash('sha256').update(`${ip}:${sid}`).digest('hex');
}

// ── Read ────────────────────────────────────────────────────────

export async function getInvoices(): Promise<Invoice[]> {
  const col = await invoices();
  const docs = await col
    .find({ status: { $ne: 'deleted' } })
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map(toInvoice);
}

export async function getInvoiceById(id: string): Promise<Invoice | null> {
  const cleanId = InvoiceIdSchema.parse(id);
  const col = await invoices();
  const doc = await col.findOne({ _id: cleanId, status: { $ne: 'deleted' } });
  return doc ? toInvoice(doc) : null;
}

export async function getNextNumber(): Promise<string> {
  const col = await invoices();
  const docs = await col.find({}, { projection: { number: 1 } }).toArray();
  const nums = docs
    .map(d => parseInt(d.number ?? '', 10))
    .filter(n => !isNaN(n));
  if (nums.length === 0) return '60';
  return String(Math.max(60, Math.max(...nums) + 1));
}

// ── Write ───────────────────────────────────────────────────────

export async function createInvoice(invoice: Invoice): Promise<Invoice> {
  const parsed = InvoiceSchema.parse(invoice);
  const col = await invoices();
  const { id, ...rest } = parsed;
  await col.insertOne({ _id: id, ...rest });
  return parsed;
}

export async function updateInvoice(
  id: string,
  patch: Partial<Invoice>,
): Promise<void> {
  const cleanId = InvoiceIdSchema.parse(id);
  const parsed = InvoicePatchSchema.parse(patch);
  const col = await invoices();
  await col.updateOne(
    { _id: cleanId },
    { $set: { ...parsed, updatedAt: new Date().toISOString() } },
  );
}

// ── Delete with PIN (rate-limited) ──────────────────────────────

export async function softDeleteInvoice(
  id: string,
  pin: string,
): Promise<{ ok: boolean; error?: 'wrong_pin' | 'locked' | 'server_error' }> {
  const cleanId = InvoiceIdSchema.parse(id);
  const cleanPin = PinSchema.parse(pin);
  const correctPin = process.env.DELETE_PIN;
  if (!correctPin) return { ok: false, error: 'server_error' };

  const fpKey = await clientFingerprint();
  const rl = await rateLimits();
  const now = Date.now();

  // Garbage-collect stale lock if any
  const existing = await rl.findOne({ _id: fpKey });
  if (existing && existing.lockedUntil > now) {
    return { ok: false, error: 'locked' };
  }
  if (existing && now - existing.updatedAt > RATE_LIMIT_WINDOW_MS) {
    await rl.deleteOne({ _id: fpKey });
  }

  if (cleanPin !== correctPin) {
    // Constant-ish delay against timing/brute force
    await new Promise(r => setTimeout(r, 800));
    const fails = (existing?.fails ?? 0) + 1;
    await rl.updateOne(
      { _id: fpKey },
      {
        $set: {
          fails,
          lockedUntil: fails >= LOCKOUT_THRESHOLD ? now + LOCKOUT_MS : 0,
          updatedAt: now,
        },
      },
      { upsert: true },
    );
    return { ok: false, error: 'wrong_pin' };
  }

  // Success — clear and soft-delete
  await rl.deleteOne({ _id: fpKey });
  const col = await invoices();
  await col.updateOne(
    { _id: cleanId },
    { $set: { status: 'deleted', updatedAt: new Date().toISOString() } },
  );
  return { ok: true };
}
