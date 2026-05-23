'use client';

import React, { useEffect, useRef, useState } from 'react';
import SBox from './SBox';
import SPill from './SPill';

type EditItem = { id: string; sku: string; qty: number };

type Props = {
  open: boolean;
  onClose: () => void;
  onAdd: (sku: string, qty: number) => void;
  editItem?: EditItem;
  onEdit?: (id: string, sku: string, qty: number) => void;
};

export default function BottomSheet({ open, onClose, onAdd, editItem, onEdit }: Props) {
  const [sku,        setSku]        = useState('');
  const [qty,        setQty]        = useState(1);
  const [editingQty, setEditingQty] = useState(false);
  const [qtyInput,   setQtyInput]   = useState('1');
  const skuRef     = useRef<HTMLInputElement>(null);
  const qtyInputRef = useRef<HTMLInputElement>(null);

  const isEdit = !!editItem;

  useEffect(() => {
    if (open) {
      if (editItem) {
        setSku(editItem.sku);
        setQty(editItem.qty);
        setQtyInput(String(editItem.qty));
      } else {
        setSku('');
        setQty(1);
        setQtyInput('1');
      }
      setEditingQty(false);
      setTimeout(() => skuRef.current?.focus(), 300);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function handleSubmit() {
    if (!sku.trim()) return;
    if (isEdit && onEdit && editItem) {
      onEdit(editItem.id, sku.trim(), qty);
    } else {
      onAdd(sku.trim(), qty);
    }
    onClose();
  }

  function confirmQtyEdit() {
    const n = parseInt(qtyInput, 10);
    const valid = !isNaN(n) && n >= 1 && n <= 9999;
    if (valid) setQty(n);
    else setQtyInput(String(qty));
    setEditingQty(false);
  }

  function startQtyEdit() {
    setQtyInput(String(qty));
    setEditingQty(true);
    setTimeout(() => { qtyInputRef.current?.focus(); qtyInputRef.current?.select(); }, 50);
  }

  // Backdrop closes only when there's no entered data —
  // protects against accidental taps wiping a half-filled form
  const isDirty = sku.trim().length > 0 || qty !== (editItem?.qty ?? 1);
  const handleBackdrop = () => { if (!isDirty) onClose(); };

  return (
    <>
      <div className={`sheet-backdrop${open ? ' open' : ''}`} onClick={handleBackdrop} />

      <div className={`sheet-panel${open ? ' open' : ''}`} style={{ padding: '10px 18px 36px' }}>
        {/* Drag handle */}
        <div style={{ width: 40, height: 4, background: 'var(--pencil-light)', borderRadius: 3, margin: '6px auto 16px' }} />

        {/* Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>
            {isEdit ? 'Изменить товар' : 'Добавить товар'}
          </div>
          <button onClick={onClose} style={{ fontSize: 18, color: 'var(--pencil)', minHeight: 44, minWidth: 44, display: 'grid', placeItems: 'center' }}>✕</button>
        </div>

        {/* SKU input */}
        <div style={{ marginBottom: 24 }}>  
          <SBox style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <input
              ref={skuRef}
              value={sku}
              onChange={e => setSku(e.target.value.slice(0, 80))}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="например: 600х800 L-1"
              maxLength={80}
              style={{
                flex: 1,
                fontFamily: 'var(--font-mono)',
                fontSize: 14, fontWeight: 700, color: 'var(--ink)',
                background: 'transparent',
              }}
            />
            {sku && (
              <button onClick={() => { setSku(''); skuRef.current?.focus(); }}
                style={{ color: 'var(--pencil)', fontSize: 16, minHeight: 44, minWidth: 32 }}>
                ✕
              </button>
            )}
          </SBox>
        </div>

        {/* Qty stepper */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, color: 'var(--pencil)', fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 12 }}>
            Количество
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'center' }}>
            <button
              onClick={() => { const n = Math.max(1, qty - 1); setQty(n); setQtyInput(String(n)); }}
              style={{ width: 52, height: 52, borderRadius: 12, border: '1px solid var(--border)', background: '#fff', fontSize: 26, display: 'grid', placeItems: 'center' }}
            >−</button>

            {editingQty ? (
              <input
                ref={qtyInputRef}
                value={qtyInput}
                onChange={e => setQtyInput(e.target.value)}
                onBlur={confirmQtyEdit}
                onKeyDown={e => { if (e.key === 'Enter') confirmQtyEdit(); }}
                inputMode="numeric"
                maxLength={4}
                style={{
                  fontFamily: 'var(--font-mono)', fontSize: 36, fontWeight: 700,
                  width: 80, textAlign: 'center',
                  border: 'none', borderBottom: '2px solid var(--accent)',
                  background: 'transparent', color: 'var(--ink)',
                }}
              />
            ) : (
              <div
                onClick={startQtyEdit}
                style={{
                  fontFamily: 'var(--font-mono)', fontSize: 36, fontWeight: 700,
                  minWidth: 80, textAlign: 'center', cursor: 'text',
                  borderBottom: '2px solid transparent', padding: '0 4px',
                }}
              >
                {qty}
              </div>
            )}

            <button
              onClick={() => { const n = Math.min(9999, qty + 1); setQty(n); setQtyInput(String(n)); }}
              style={{ width: 52, height: 52, borderRadius: 12, border: '1px solid var(--accent)', color: 'var(--accent)', background: 'var(--accent-tint)', fontSize: 26, display: 'grid', placeItems: 'center' }}
            >+</button>
          </div>
        </div>

        {/* CTA */}
        <SPill
          variant="accent" big
          onClick={handleSubmit}
          disabled={!sku.trim()}
          style={{ width: '100%', justifyContent: 'center', padding: '14px 0', fontSize: 16 }}
        >
          {isEdit ? 'Сохранить изменения' : 'Добавить'}
        </SPill>
      </div>
    </>
  );
}
