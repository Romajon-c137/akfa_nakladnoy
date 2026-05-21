'use client';

import { use, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { ChevronLeft, MoreHorizontal, Download, Printer, Loader2, ZoomIn, ZoomOut, Trash2, X } from 'lucide-react';
import { softDeleteInvoice, updateInvoice as updateInvoiceDB } from '@/lib/actions';
import { shareInvoicePDF } from '@/lib/pdf';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import ScreenHeader from '@/components/ScreenHeader';
import NakladnayaDocument from '@/components/NakladnayaDocument';
import SPill from '@/components/SPill';

// Unique key for rate-limiting (per page load, prevents trivial replay)
const SESSION_KEY = Math.random().toString(36).slice(2);

export default function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { invoices, deleteInvoice } = useStore();
  const [zoom, setZoom] = useState(1);

  const [waLoading,   setWaLoading]   = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [deleteOpen,  setDeleteOpen]  = useState(false);
  const [pin,         setPin]         = useState('');
  const [pinError,    setPinError]    = useState<string | null>(null);
  const [pinLocked,   setPinLocked]   = useState(false);
  const [deleting,    setDeleting]    = useState(false);
  const pinRef = useRef<HTMLInputElement>(null);

  const invoice = invoices.find(i => i.id === id && i.status !== 'deleted');

  function openDeleteModal() {
    setMenuOpen(false);
    setPin('');
    setPinError(null);
    setPinLocked(false);
    setDeleteOpen(true);
    setTimeout(() => pinRef.current?.focus(), 200);
  }

  async function handleDelete() {
    if (!invoice || pinLocked || deleting) return;
    setDeleting(true);
    setPinError(null);
    const res = await softDeleteInvoice(invoice.id, pin, SESSION_KEY);
    setDeleting(false);
    if (res.ok) {
      deleteInvoice(invoice.id);
      router.push('/');
    } else if (res.error === 'locked') {
      setPinLocked(true);
      setPinError('Слишком много попыток — подождите 10 минут');
    } else {
      setPinError('Неверный пароль');
      setPin('');
      pinRef.current?.focus();
    }
  }

  if (!invoice) {
    return (
      <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, color: 'var(--pencil)' }}>
        <div style={{ fontSize: 14, fontWeight: 500 }}>Накладная не найдена</div>
        <SPill variant="ghost" onClick={() => router.push('/')}>← Назад</SPill>
      </div>
    );
  }

  const zoomPct = Math.round(zoom * 100);

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--paper-deep)', position: 'relative' }}>

      {/* Header */}
      <div className="no-print">
        <ScreenHeader
          title={`Накладная № ${invoice.number}`}
          left={<ChevronLeft size={22} />}
          right={<MoreHorizontal size={20} />}
          onLeft={() => router.back()}
          onRight={() => setMenuOpen(true)}
        />
      </div>

      {/* Document */}
      <div className="print-scroll" style={{ flex: 1, padding: '16px 12px 110px', overflow: 'auto' }}>
        <div
          className="print-doc-wrap"
          style={{
            background: '#fff',
            boxShadow: '0 6px 24px rgba(0,0,0,.12), 0 1px 3px rgba(0,0,0,.08)',
            transformOrigin: 'top center',
            transform: `scale(${zoom})`,
          }}
        >
          <NakladnayaDocument invoice={invoice} />
        </div>
      </div>

      {/* Zoom controls */}
      <div className="no-print" style={{ position: 'fixed', top: 64, right: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, zIndex: 10 }}>
        <div style={{ background: 'var(--ink)', color: '#fff', padding: '3px 8px', borderRadius: 999, fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600 }}>
          {zoomPct}%
        </div>
        <button onClick={() => setZoom(z => Math.min(3, +(z + 0.25).toFixed(2)))}
          style={{ background: 'var(--ink)', color: '#fff', borderRadius: 999, width: 30, height: 30, display: 'grid', placeItems: 'center' }}>
          <ZoomIn size={14} />
        </button>
        <button onClick={() => setZoom(z => Math.max(0.5, +(z - 0.25).toFixed(2)))}
          style={{ background: 'var(--ink)', color: '#fff', borderRadius: 999, width: 30, height: 30, display: 'grid', placeItems: 'center' }}>
          <ZoomOut size={14} />
        </button>
      </div>

      {/* Bottom bar */}
      <div className="no-print" style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 390,
        padding: '12px 14px 26px',
        background: '#fff', borderTop: '1px solid var(--border)',
        display: 'flex', gap: 8, zIndex: 20,
      }}>
        <SPill variant="ghost" big onClick={() => window.print()} style={{ flex: 1, justifyContent: 'center', gap: 5 }}>
          <Download size={15} /> PDF
        </SPill>
        <SPill
          variant="ghost" big
          disabled={waLoading}
          onClick={async () => {
            setWaLoading(true);
            try { await shareInvoicePDF(invoice.number); } finally { setWaLoading(false); }
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

      {/* ── Three-dot menu backdrop ── */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 40 }}
        />
      )}

      {/* ── Three-dot menu panel ── */}
      {menuOpen && (
        <div style={{
          position: 'fixed',
          top: 52,
          right: 12,
          background: '#fff',
          borderRadius: 14,
          border: '1px solid var(--border)',
          boxShadow: '0 8px 32px rgba(0,0,0,.14)',
          zIndex: 50,
          overflow: 'hidden',
          minWidth: 200,
        }}>
          <button
            onClick={openDeleteModal}
            style={{
              width: '100%',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              fontSize: 15,
              fontWeight: 500,
              color: 'var(--accent)',
              textAlign: 'left',
            }}
          >
            <Trash2 size={18} />
            Удалить накладную
          </button>
        </div>
      )}

      {/* ── Delete modal backdrop ── */}
      {deleteOpen && (
        <div
          onClick={() => setDeleteOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(10,10,10,.5)', zIndex: 60 }}
        />
      )}

      {/* ── Delete modal ── */}
      {deleteOpen && (
        <div style={{
          position: 'fixed',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#fff',
          borderRadius: 20,
          padding: '24px 22px',
          width: 'calc(100% - 48px)',
          maxWidth: 340,
          zIndex: 70,
          boxShadow: '0 20px 60px rgba(0,0,0,.2)',
        }}>
          {/* Close */}
          <button onClick={() => setDeleteOpen(false)} style={{ position: 'absolute', top: 14, right: 14, color: 'var(--pencil)', minWidth: 36, minHeight: 36, display: 'grid', placeItems: 'center' }}>
            <X size={18} />
          </button>

          {/* Icon */}
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--accent-tint)', border: '1px solid var(--accent)', display: 'grid', placeItems: 'center', marginBottom: 14 }}>
            <Trash2 size={24} color="var(--accent)" />
          </div>

          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Удалить накладную?</div>
          <div style={{ fontSize: 13, color: 'var(--pencil)', marginBottom: 20, lineHeight: 1.45 }}>
            Накладная № {invoice?.number} скроется из списка (восстановима через базу).
          </div>

          {/* PIN input */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--pencil)', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 8 }}>
              Пароль
            </div>
            <input
              ref={pinRef}
              type="password"
              value={pin}
              onChange={e => { setPin(e.target.value.slice(0, 30)); setPinError(null); }}
              onKeyDown={e => { if (e.key === 'Enter') handleDelete(); }}
              placeholder="Введите пароль"
              maxLength={30}
              autoComplete="off"
              disabled={pinLocked || deleting}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 12,
                border: `1.5px solid ${pinError ? 'var(--accent)' : 'var(--border)'}`,
                fontSize: 15,
                fontWeight: 500,
                color: 'var(--ink)',
                background: (pinError || pinLocked) ? 'var(--accent-tint)' : 'var(--paper-dim)',
                opacity: (pinLocked || deleting) ? 0.6 : 1,
              }}
            />
            {pinError && (
              <div style={{ fontSize: 12, color: 'var(--accent)', marginTop: 6, fontWeight: 500 }}>
                {pinError}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 10 }}>
            <SPill variant="ghost" big onClick={() => setDeleteOpen(false)} style={{ flex: 1, justifyContent: 'center' }}>
              Отмена
            </SPill>
            <SPill variant="accent" big onClick={handleDelete} disabled={pinLocked || deleting} style={{ flex: 1, justifyContent: 'center' }}>
              {deleting ? '...' : 'Удалить'}
            </SPill>
          </div>
        </div>
      )}
    </div>
  );
}
