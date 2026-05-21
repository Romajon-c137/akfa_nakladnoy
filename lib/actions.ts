'use server';

import { getDb } from './mongodb';
import { Invoice } from './types';

// Rate limiting: max 5 attempts per 10 minutes per "session"
const failMap = new Map<string, { count: number; until: number }>();

function sanitizeStr(v: unknown, maxLen: number): string {
  return String(v ?? '').trim().slice(0, maxLen);
}

function toInvoice(doc: Record<string, unknown>): Invoice {
  const { _id, ...rest } = doc;
  return { ...rest, id: String(_id) } as Invoice;
}

export async function getInvoices(): Promise<Invoice[]> {
  const db = await getDb();
  const docs = await db
    .collection('invoices')
    .find({ status: { $ne: 'deleted' } })
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map(d => toInvoice(d as Record<string, unknown>));
}

export async function createInvoice(invoice: Invoice): Promise<Invoice> {
  const db = await getDb();
  const { id, ...data } = invoice;
  const clean = {
    number:     sanitizeStr(data.number,     10),
    date:       sanitizeStr(data.date,       20),
    fromPerson: sanitizeStr(data.fromPerson, 100),
    vehicle:    sanitizeStr(data.vehicle,    30),
    driver:     sanitizeStr(data.driver,     60),
    status:     data.status ?? 'draft',
    createdAt:  data.createdAt,
    updatedAt:  data.updatedAt,
    items: (data.items ?? []).slice(0, 100).map((it: { id?: string; sku?: string; qty?: number }) => ({
      id:  sanitizeStr(it.id,  20),
      sku: sanitizeStr(it.sku, 80),
      qty: Math.max(1, Math.min(9999, Number(it.qty) || 1)),
    })),
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await db.collection('invoices').insertOne({ _id: id as any, ...clean });
  return invoice;
}

export async function updateInvoice(id: string, patch: Partial<Invoice>): Promise<void> {
  const db = await getDb();
  const cleanId = sanitizeStr(id, 50);
  const { id: _ignore, ...data } = patch as Invoice;
  const update: Record<string, unknown> = { updatedAt: new Date().toISOString() };
  if (data.fromPerson !== undefined) update.fromPerson = sanitizeStr(data.fromPerson, 100);
  if (data.vehicle    !== undefined) update.vehicle    = sanitizeStr(data.vehicle,    30);
  if (data.driver     !== undefined) update.driver     = sanitizeStr(data.driver,     60);
  if (data.status     !== undefined) update.status     = data.status;
  if (data.items      !== undefined) {
    update.items = data.items.slice(0, 100).map((it: { id?: string; sku?: string; qty?: number }) => ({
      id:  sanitizeStr(it.id,  20),
      sku: sanitizeStr(it.sku, 80),
      qty: Math.max(1, Math.min(9999, Number(it.qty) || 1)),
    }));
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await db.collection('invoices').updateOne({ _id: cleanId as any }, { $set: update });
}

/** Checks PIN server-side (PIN never sent to client), soft-deletes on success. */
export async function softDeleteInvoice(
  id: string,
  pin: string,
  sessionKey: string,
): Promise<{ ok: boolean; error?: 'wrong_pin' | 'locked' | 'server_error' }> {
  const cleanId  = sanitizeStr(id,  50);
  const cleanPin = sanitizeStr(pin, 30);
  const cleanKey = sanitizeStr(sessionKey, 64);

  // Rate-limit per session key
  const now = Date.now();
  const rec = failMap.get(cleanKey);
  if (rec && rec.until > now) {
    return { ok: false, error: 'locked' };
  }

  const correctPin = process.env.DELETE_PIN;
  if (!correctPin) return { ok: false, error: 'server_error' };

  if (cleanPin !== correctPin) {
    // Record failure
    const cur = failMap.get(cleanKey) ?? { count: 0, until: 0 };
    const newCount = cur.count + 1;
    failMap.set(cleanKey, {
      count: newCount,
      until: newCount >= 5 ? now + 10 * 60 * 1000 : 0, // lock 10 min after 5 failures
    });
    // Slow down brute force
    await new Promise(r => setTimeout(r, 800));
    return { ok: false, error: 'wrong_pin' };
  }

  // Success — clear failures, perform soft delete
  failMap.delete(cleanKey);
  const db = await getDb();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await db.collection('invoices').updateOne(
    { _id: cleanId as any },
    { $set: { status: 'deleted', updatedAt: new Date().toISOString() } }
  );
  return { ok: true };
}
