'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore, computeTotal } from '@/lib/store';
import { InvoiceItem } from '@/lib/types';
import { X, ChevronLeft, Download, Printer, Loader2, Pencil } from 'lucide-react';
import { createInvoice, updateInvoice as updateInvoiceDB } from '@/lib/actions';
import { shareInvoicePDF } from '@/lib/pdf';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import ScreenHeader from '@/components/ScreenHeader';
import SBox from '@/components/SBox';
import SField from '@/components/SField';
import SPill from '@/components/SPill';
import SFab from '@/components/SFab';
import NakladnayaDocument from '@/components/NakladnayaDocument';
import BottomSheet from '@/components/BottomSheet';

function uid() { return Math.random().toString(36).slice(2, 10); }
function todayISO() { return new Date().toISOString().slice(0, 10); }

/* phase: 'edit' = заполнение, 'done' = готово/печать */
type Phase = 'edit' | 'done';
/* tab: вкладка внутри режима edit */
type Tab = 'form' | 'preview';

const TRANS = 'opacity 0.28s ease, transform 0.3s cubic-bezier(0.34,1.2,0.64,1)';

export default function NewPage() {
  const router = useRouter();
  const { addInvoice, updateInvoice, nextNumber } = useStore();

  const [savedId]  = useState(uid);
  const [phase, setPhase] = useState<Phase>('edit');
  const [tab,   setTab]   = useState<Tab>('form');
  const [number]   = useState(() => nextNumber());
  const [date]     = useState(todayISO);
  const [fromPerson, setFromPerson] = useState('');
  const [vehicle,    setVehicle]    = useState('');
  const [driver,     setDriver]     = useState('');
  const [items,       setItems]       = useState<InvoiceItem[]>([]);
  const [sheetOpen,   setSheetOpen]   = useState(false);
  const [editingItem, setEditingItem] = useState<InvoiceItem | null>(null);
  const [saved,     setSaved]     = useState(false);
  const [waLoading, setWaLoading] = useState(false);

  const totalQty = computeTotal(items);
  const invoice  = { id: savedId, number, date, fromPerson, vehicle, driver, items, status: 'draft' as const, createdAt: '', updatedAt: '' };

  function handleAddItem(sku: string, qty: number) {
    setItems(prev => [...prev, { id: uid(), sku, qty }]);
  }
  function handleEditItem(id: string, sku: string, qty: number) {
    setItems(prev => prev.map(it => it.id === id ? { ...it, sku, qty } : it));
    setEditingItem(null);
  }
  function removeItem(id: string) {
    setItems(prev => prev.filter(i => i.id !== id));
  }
  function openEdit(item: InvoiceItem) {
    setEditingItem(item);
    setSheetOpen(true);
  }
  function handleSheetClose() {
    setSheetOpen(false);
    setEditingItem(null);
  }

  async function handleDone() {
    const now = new Date().toISOString();
    if (!saved) {
      const inv = { ...invoice, status: 'draft' as const, createdAt: now, updatedAt: now };
      addInvoice(inv);
      setSaved(true);
      await createInvoice(inv);
    } else {
      const patch = { fromPerson, vehicle, driver, items };
      updateInvoice(savedId, patch);
      await updateInvoiceDB(savedId, patch);
    }
    setPhase('done');
  }

  async function handleSend() {
    updateInvoice(savedId, { status: 'sent' });
    await updateInvoiceDB(savedId, { status: 'sent' });
    router.push('/');
  }

  const editVisible = phase === 'edit';
  const doneVisible = phase === 'done';

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--paper-dim)', position: 'relative', overflow: 'hidden' }}>

      {/* ── Header: edit ── */}
      <div className="no-print" style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
        opacity: editVisible ? 1 : 0,
        transform: editVisible ? 'translateY(0)' : 'translateY(-12px)',
        pointerEvents: editVisible ? 'auto' : 'none',
        transition: TRANS,
      }}>
        <ScreenHeader
          title="Новая накладная"
          left={<X size={18} />}
          right="Сохр."
          onLeft={() => router.back()}
          onRight={async () => {
            const now = new Date().toISOString();
            if (!saved) {
              const inv = { ...invoice, status: 'draft' as const, createdAt: now, updatedAt: now };
              addInvoice(inv);
              setSaved(true);
              await createInvoice(inv);
            } else {
              const patch = { fromPerson, vehicle, driver, items };
              updateInvoice(savedId, patch);
              await updateInvoiceDB(savedId, patch);
            }
            router.push('/');
          }}
        />
      </div>

      {/* ── Header: done ── */}
      <div className="no-print" style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
        opacity: doneVisible ? 1 : 0,
        transform: doneVisible ? 'translateY(0)' : 'translateY(12px)',
        pointerEvents: doneVisible ? 'auto' : 'none',
        transition: TRANS,
      }}>
        <ScreenHeader
          title={`Накладная № ${number}`}
          left={<ChevronLeft size={22} />}
          onLeft={() => setPhase('edit')}
        />
      </div>

      {/* ── Content area ── */}
      <div style={{ flex: 1, position: 'relative', marginTop: 57 }}>

        {/* EDIT PANEL */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          opacity: editVisible ? 1 : 0,
          transform: editVisible ? 'scale(1) translateY(0)' : 'scale(0.97) translateY(-20px)',
          pointerEvents: editVisible ? 'auto' : 'none',
          transition: TRANS,
        }}>
          {/* Toggle */}
          <div style={{ padding: '10px 16px 8px', background: '#fff', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
            <div style={{ display: 'flex', background: 'var(--paper-dim)', borderRadius: 10, padding: 3, border: '1px solid var(--border)' }}>
              {(['form', 'preview'] as Tab[]).map(v => (
                <button key={v} onClick={() => setTab(v)} style={{
                  flex: 1, textAlign: 'center', padding: '8px 0',
                  background: tab === v ? '#fff' : 'transparent',
                  borderRadius: 8, fontSize: 13,
                  fontWeight: tab === v ? 600 : 500,
                  color: tab === v ? 'var(--ink)' : 'var(--pencil)',
                  boxShadow: tab === v ? '0 1px 2px rgba(0,0,0,.05)' : 'none',
                  transition: 'all 0.15s ease',
                }}>
                  {v === 'form' ? 'Форма' : 'Предпросмотр'}
                </button>
              ))}
            </div>
          </div>

          {/* Sub-panels */}
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            {/* Form sub-panel */}
            <div style={{
              position: 'absolute', inset: 0, overflowY: 'auto',
              opacity: tab === 'form' ? 1 : 0,
              transform: tab === 'form' ? 'translateX(0)' : 'translateX(-24px)',
              pointerEvents: tab === 'form' ? 'auto' : 'none',
              transition: 'opacity 0.2s ease, transform 0.2s ease',
            }}>
              <div style={{ padding: '12px 14px 180px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <SBox style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', gap: 14 }}>
                    <SField label="№" value={number} style={{ width: 72, flexShrink: 0, flex: 'none' }} />
                    <SField label="Дата" value={date.split('-').reverse().join('.')} style={{ flex: 1 }} />
                  </div>
                  <SField label="Передал ФИО" value={fromPerson} placeholder="Алимжанов С.А." onChange={setFromPerson} maxLength={100} />
                  <div style={{ display: 'flex', gap: 14 }}>
                    <SField label="Машина" value={vehicle} placeholder="гос. номер" onChange={setVehicle} maxLength={30} />
                    <SField label="Водитель" value={driver} placeholder="Имя" onChange={setDriver} maxLength={60} />
                  </div>
                </SBox>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '6px 4px 2px' }}>
                  <div style={{ fontSize: 11, color: 'var(--pencil)', fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                    Товары · {items.length}
                  </div>
                  {items.length > 0 && <div style={{ fontSize: 11, color: 'var(--pencil)' }}>тап × удалить</div>}
                </div>

                {items.map((item, i) => (
                  <SBox key={item.id} style={{ padding: '11px 12px', display: 'flex', gap: 10, alignItems: 'center' }}>
                    {/* Index */}
                    <div style={{ width: 26, height: 26, borderRadius: 6, background: 'var(--paper-dim)', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                      {i + 1}
                    </div>

                    {/* SKU + qty */}
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <div style={{
                        fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700,
                        overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                      }}>
                        {item.sku}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--pencil)' }}>× {item.qty} шт</div>
                    </div>

                    {/* Edit */}
                    <button
                      onClick={() => openEdit(item)}
                      style={{ color: 'var(--pencil)', minHeight: 44, minWidth: 36, display: 'grid', placeItems: 'center' }}
                    >
                      <Pencil size={15} />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => removeItem(item.id)}
                      style={{ color: 'var(--pencil)', minHeight: 44, minWidth: 32, fontSize: 18, display: 'grid', placeItems: 'center' }}
                    >
                      ×
                    </button>
                  </SBox>
                ))}

                <SBox dashed onClick={() => setSheetOpen(true)} style={{ padding: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: 'var(--accent)', borderColor: 'var(--accent)', fontSize: 13, fontWeight: 600, background: 'transparent', cursor: 'pointer' }}>
                  + добавить товар
                </SBox>
              </div>
            </div>

            {/* Preview sub-panel */}
            <div style={{
              position: 'absolute', inset: 0, overflowY: 'auto',
              background: 'var(--paper-deep)',
              opacity: tab === 'preview' ? 1 : 0,
              transform: tab === 'preview' ? 'translateX(0)' : 'translateX(24px)',
              pointerEvents: tab === 'preview' ? 'auto' : 'none',
              transition: 'opacity 0.2s ease, transform 0.2s ease',
            }}>
              <div style={{ padding: '14px 12px 110px' }}>
                <div style={{ background: '#fff', boxShadow: '0 4px 18px rgba(0,0,0,.08)' }}>
                  <NakladnayaDocument invoice={invoice} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DONE PANEL */}
        <div className="print-scroll" style={{
          position: 'absolute', inset: 0, overflowY: 'auto',
          background: 'var(--paper-deep)',
          opacity: doneVisible ? 1 : 0,
          transform: doneVisible ? 'translateY(0)' : 'translateY(36px)',
          pointerEvents: doneVisible ? 'auto' : 'none',
          transition: TRANS,
        }}>
          <div style={{ padding: '14px 12px 110px' }}>
            <div className="print-doc-wrap" style={{ background: '#fff', boxShadow: '0 6px 24px rgba(0,0,0,.12)' }}>
              <NakladnayaDocument invoice={invoice} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar: edit ── */}
      <div className="no-print" style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 390, zIndex: 20,
        padding: '12px 16px 24px',
        background: '#fff', borderTop: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 12,
        opacity: editVisible ? 1 : 0,
        pointerEvents: editVisible ? 'auto' : 'none',
        transition: 'opacity 0.25s ease',
      }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ fontSize: 10, color: 'var(--pencil)', fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase' }}>
            Итого · {items.length} позиц.
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700 }}>{totalQty} шт</div>
        </div>
        <SPill variant="accent" big onClick={handleDone}>Готово →</SPill>
      </div>

      {/* ── Bottom bar: done ── */}
      <div className="no-print" style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 390, zIndex: 20,
        padding: '12px 14px 24px',
        background: '#fff', borderTop: '1px solid var(--border)',
        display: 'flex', gap: 8,
        opacity: doneVisible ? 1 : 0,
        pointerEvents: doneVisible ? 'auto' : 'none',
        transition: 'opacity 0.25s ease',
      }}>
        <SPill variant="ghost" big onClick={() => window.print()} style={{ flex: 1, justifyContent: 'center', gap: 5 }}>
          <Download size={15} /> PDF
        </SPill>
        <SPill
          variant="ghost" big
          disabled={waLoading}
          onClick={async () => {
            setWaLoading(true);
            try { await shareInvoicePDF(number); } finally { setWaLoading(false); }
          }}
          style={{ flex: 1, justifyContent: 'center', gap: 5, background: '#25D366', color: '#fff', border: '1px solid #25D366' }}
        >
          {waLoading
            ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
            : <WhatsAppIcon />}
          WhatsApp
        </SPill>
        <SPill variant="accent" big onClick={() => window.print()} style={{ flex: 1, justifyContent: 'center', gap: 5 }}>
          <Printer size={15} /> Печать
        </SPill>
      </div>

      {/* FAB */}
      <SFab
        onClick={() => setSheetOpen(true)}
        style={{
          position: 'fixed', right: 18, bottom: 108, zIndex: 25,
          opacity: (editVisible && tab === 'form') ? 1 : 0,
          pointerEvents: (editVisible && tab === 'form') ? 'auto' : 'none',
          transition: 'opacity 0.2s ease',
        }}
        className="no-print"
      />

      <BottomSheet
        open={sheetOpen}
        onClose={handleSheetClose}
        onAdd={handleAddItem}
        editItem={editingItem ?? undefined}
        onEdit={handleEditItem}
      />
    </div>
  );
}
