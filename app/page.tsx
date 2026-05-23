'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useStore, computeTotal } from '@/lib/store';
import { getInvoices } from '@/lib/actions';
import { Invoice, Department, DEPARTMENT_LABEL } from '@/lib/types';
import { Search, X, FileText, Loader2 } from 'lucide-react';
import SBox from '@/components/SBox';
import SFab from '@/components/SFab';

const DEPARTMENTS: Department[] = ['glass', 'aluminum'];

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const time = d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  if (d.toDateString() === new Date().toDateString()) return `сегодня, ${time}`;
  const yesterday = new Date(Date.now() - 86400000);
  if (d.toDateString() === yesterday.toDateString()) return `вчера, ${time}`;
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }) + `, ${time}`;
}

export default function HomePage() {
  const router = useRouter();
  const { invoices, loading, setInvoices, setLoading } = useStore();
  const [dept, setDept] = useState<Department>('glass');
  const [searchActive, setSearchActive] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getInvoices()
      .then(setInvoices)
      .catch(() => setLoading(false));
  }, [setInvoices, setLoading]);

  useEffect(() => {
    if (searchActive) setTimeout(() => inputRef.current?.focus(), 100);
  }, [searchActive]);

  function closeSearch() { setSearchActive(false); setQuery(''); }

  const q = query.trim().toLowerCase();
  const byDept = invoices.filter(inv => inv.department === dept);
  const filtered = q
    ? byDept.filter((inv: Invoice) =>
        inv.number.toLowerCase().includes(q) ||
        (inv.fromPerson ?? '').toLowerCase().includes(q)
      )
    : byDept;

  // Counts per department for badges on tabs
  const counts: Record<Department, number> = {
    glass: invoices.filter(i => i.department === 'glass').length,
    aluminum: invoices.filter(i => i.department === 'aluminum').length,
  };

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--paper-dim)' }}>

      {/* ── Header ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        {searchActive ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', minHeight: 56 }}>
            <button onClick={closeSearch} style={{ color: 'var(--ink)', minWidth: 36, minHeight: 44, display: 'grid', placeItems: 'center' }}>
              <X size={20} />
            </button>
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Поиск по № или ФИО..."
              style={{ flex: 1, fontSize: 15, fontWeight: 500, color: 'var(--ink)', background: 'transparent' }}
            />
            {query && (
              <button onClick={() => setQuery('')} style={{ color: 'var(--pencil)', minWidth: 36, minHeight: 44, display: 'grid', placeItems: 'center' }}>
                <X size={16} />
              </button>
            )}
          </div>
        ) : (
          <div style={{ padding: '10px 16px 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Image src="/logo.png" alt="akfa Glass" width={120} height={36} style={{ height: 28, width: 'auto', objectFit: 'contain' }} priority />
              <button
                onClick={() => setSearchActive(true)}
                style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--paper-dim)', border: '1px solid var(--border)', display: 'grid', placeItems: 'center', color: 'var(--ink-soft)' }}
              >
                <Search size={18} />
              </button>
            </div>
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.4, color: 'var(--ink)' }}>Накладные</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#fff', background: 'var(--accent)', borderRadius: 999, padding: '2px 8px', lineHeight: 1.6 }}>
                {byDept.length}
              </span>
            </div>
          </div>
        )}

        {/* Accent strip */}
        <div style={{ height: 3, background: 'var(--accent)' }} />

        {/* Department tabs */}
        <div style={{ display: 'flex', gap: 8, padding: '10px 14px', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {DEPARTMENTS.map(d => {
            const active = dept === d;
            return (
              <button
                key={d}
                onClick={() => setDept(d)}
                style={{
                  padding: '7px 16px',
                  borderRadius: 999,
                  border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                  background: active ? 'var(--accent)' : '#fff',
                  color: active ? '#fff' : 'var(--ink-soft)',
                  fontSize: 13,
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                {DEPARTMENT_LABEL[d]}
                <span style={{
                  fontSize: 11,
                  padding: '1px 6px',
                  borderRadius: 999,
                  background: active ? 'rgba(255,255,255,0.22)' : 'var(--paper-dim)',
                  color: active ? '#fff' : 'var(--pencil)',
                  minWidth: 18, textAlign: 'center',
                }}>
                  {counts[d]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── List ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 14px 100px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, color: 'var(--pencil)' }}>
            <Loader2 size={28} strokeWidth={1.5} style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 220, color: 'var(--pencil)', gap: 10 }}>
            <FileText size={40} strokeWidth={1.2} />
            <div style={{ fontSize: 15, fontWeight: 500 }}>
              {q ? 'Ничего не найдено' : `Нет накладных — ${DEPARTMENT_LABEL[dept]}`}
            </div>
            {!q && (
              <div style={{ fontSize: 13, color: 'var(--pencil)' }}>Нажмите + чтобы создать первую</div>
            )}
          </div>
        ) : null}
        {!loading && filtered.map(inv => {
          const total = computeTotal(inv.items);
          return (
            <SBox
              key={inv.id}
              onClick={() => router.push(`/invoice/${inv.id}`)}
              style={{ padding: '13px 14px', background: '#fff', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                {/* Number badge */}
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: 'var(--paper-dim)', border: '1px solid var(--border)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'var(--pencil)', lineHeight: 1 }}>№</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.2 }}>{inv.number}</span>
                </div>

                {/* Info */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {inv.fromPerson || <span style={{ color: 'var(--pencil)', fontStyle: 'italic' }}>Без имени</span>}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--pencil)', fontWeight: 500 }}>
                    {formatDateTime(inv.createdAt)}
                  </div>
                </div>

                {/* Qty */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>{total}</div>
                  <div style={{ fontSize: 10, color: 'var(--pencil)', fontWeight: 500 }}>шт</div>
                </div>
              </div>
            </SBox>
          );
        })}
      </div>


      {/* FAB — creates invoice in currently selected department */}
      <SFab onClick={() => router.push(`/new?dept=${dept}`)} style={{ position: 'fixed', right: 20, bottom: 28, zIndex: 25 }} />
    </div>
  );
}
