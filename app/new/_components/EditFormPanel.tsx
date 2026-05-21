'use client';

import { Pencil } from 'lucide-react';
import { InvoiceItem } from '@/lib/types';
import SBox from '@/components/SBox';
import SField from '@/components/SField';

type Tab = 'form' | 'preview';

type Props = {
  tab: Tab;
  onTabChange: (tab: Tab) => void;

  number: string;
  date: string;
  fromPerson: string;
  vehicle: string;
  driver: string;
  items: InvoiceItem[];

  onFromPersonChange: (v: string) => void;
  onVehicleChange: (v: string) => void;
  onDriverChange: (v: string) => void;
  onEditItem: (item: InvoiceItem) => void;
  onRemoveItem: (id: string) => void;
  onAddItemClick: () => void;

  previewSlot: React.ReactNode;
};

export default function EditFormPanel(p: Props) {
  return (
    <>
      {/* Toggle */}
      <div style={{ padding: '10px 16px 8px', background: '#fff', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', background: 'var(--paper-dim)', borderRadius: 10, padding: 3, border: '1px solid var(--border)' }}>
          {(['form', 'preview'] as Tab[]).map(v => {
            const active = p.tab === v;
            return (
              <button
                key={v}
                onClick={() => p.onTabChange(v)}
                style={{
                  flex: 1, textAlign: 'center', padding: '8px 0',
                  background: active ? '#fff' : 'transparent',
                  borderRadius: 8, fontSize: 13,
                  fontWeight: active ? 600 : 500,
                  color: active ? 'var(--ink)' : 'var(--pencil)',
                  boxShadow: active ? '0 1px 2px rgba(0,0,0,.05)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                {v === 'form' ? 'Форма' : 'Предпросмотр'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-panels */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0, overflowY: 'auto',
          opacity: p.tab === 'form' ? 1 : 0,
          transform: p.tab === 'form' ? 'translateX(0)' : 'translateX(-24px)',
          pointerEvents: p.tab === 'form' ? 'auto' : 'none',
          transition: 'opacity 0.2s ease, transform 0.2s ease',
        }}>
          <div style={{ padding: '12px 14px 180px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <SBox style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', gap: 14 }}>
                <SField label="№" value={p.number} style={{ width: 72, flexShrink: 0, flex: 'none' }} />
                <SField label="Дата" value={p.date.split('-').reverse().join('.')} style={{ flex: 1 }} />
              </div>
              <SField label="Передал ФИО" value={p.fromPerson} placeholder="Алимжанов С.А." onChange={p.onFromPersonChange} maxLength={100} />
              <div style={{ display: 'flex', gap: 14 }}>
                <SField label="Машина" value={p.vehicle} placeholder="гос. номер" onChange={p.onVehicleChange} maxLength={30} />
                <SField label="Водитель" value={p.driver} placeholder="Имя" onChange={p.onDriverChange} maxLength={60} />
              </div>
            </SBox>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '6px 4px 2px' }}>
              <div style={{ fontSize: 11, color: 'var(--pencil)', fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                Товары · {p.items.length}
              </div>
              {p.items.length > 0 && <div style={{ fontSize: 11, color: 'var(--pencil)' }}>тап × удалить</div>}
            </div>

            {p.items.map((item, i) => (
              <SBox key={item.id} style={{ padding: '11px 12px', display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ width: 26, height: 26, borderRadius: 6, background: 'var(--paper-dim)', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                    {item.sku}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--pencil)' }}>× {item.qty} шт</div>
                </div>
                <button onClick={() => p.onEditItem(item)} style={{ color: 'var(--pencil)', minHeight: 44, minWidth: 36, display: 'grid', placeItems: 'center' }}>
                  <Pencil size={15} />
                </button>
                <button onClick={() => p.onRemoveItem(item.id)} style={{ color: 'var(--pencil)', minHeight: 44, minWidth: 32, fontSize: 18, display: 'grid', placeItems: 'center' }}>
                  ×
                </button>
              </SBox>
            ))}

            <SBox dashed onClick={p.onAddItemClick} style={{ padding: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: 'var(--accent)', borderColor: 'var(--accent)', fontSize: 13, fontWeight: 600, background: 'transparent', cursor: 'pointer' }}>
              + добавить товар
            </SBox>
          </div>
        </div>

        {/* Preview sub-panel */}
        <div style={{
          position: 'absolute', inset: 0, overflowY: 'auto',
          background: 'var(--paper-deep)',
          opacity: p.tab === 'preview' ? 1 : 0,
          transform: p.tab === 'preview' ? 'translateX(0)' : 'translateX(24px)',
          pointerEvents: p.tab === 'preview' ? 'auto' : 'none',
          transition: 'opacity 0.2s ease, transform 0.2s ease',
        }}>
          {p.previewSlot}
        </div>
      </div>
    </>
  );
}
