'use client';

import { create } from 'zustand';
import { Invoice, InvoiceStatus } from './types';

function nextNumber(invoices: Invoice[]): string {
  if (invoices.length === 0) return '60';
  const nums = invoices.map(i => parseInt(i.number, 10)).filter(n => !isNaN(n));
  if (nums.length === 0) return '60';
  return String(Math.max(60, Math.max(...nums) + 1));
}

type Store = {
  invoices: Invoice[];
  loading: boolean;
  setInvoices: (invoices: Invoice[]) => void;
  setLoading: (v: boolean) => void;
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (id: string, patch: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  setStatus: (id: string, status: InvoiceStatus) => void;
  nextNumber: () => string;
};

export const useStore = create<Store>((set, get) => ({
  invoices: [],
  loading: true,

  setInvoices: (invoices) => set({ invoices, loading: false }),
  setLoading: (v) => set({ loading: v }),

  addInvoice: (invoice) =>
    set(s => ({ invoices: [invoice, ...s.invoices] })),

  updateInvoice: (id, patch) =>
    set(s => ({
      invoices: s.invoices.map(inv =>
        inv.id === id ? { ...inv, ...patch, updatedAt: new Date().toISOString() } : inv
      ),
    })),

  deleteInvoice: (id) =>
    set(s => ({
      invoices: s.invoices.map(inv =>
        inv.id === id ? { ...inv, status: 'deleted' as const, updatedAt: new Date().toISOString() } : inv
      ),
    })),

  setStatus: (id, status) =>
    set(s => ({
      invoices: s.invoices.map(inv =>
        inv.id === id ? { ...inv, status, updatedAt: new Date().toISOString() } : inv
      ),
    })),

  nextNumber: () => nextNumber(get().invoices),
}));

export function computeTotal(items: Invoice['items']): number {
  return items.reduce((sum, it) => sum + it.qty, 0);
}

export function formatMoney(n: number): string {
  return n.toLocaleString('ru-RU') + ' шт';
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'сегодня';
  if (d.toDateString() === yesterday.toDateString()) return 'вчера';
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}
