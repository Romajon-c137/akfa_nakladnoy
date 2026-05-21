'use client';

import SPill from '@/components/SPill';

type Props = {
  visible: boolean;
  itemsCount: number;
  totalQty: number;
  onDone: () => void;
};

export default function EditBottomBar({ visible, itemsCount, totalQty, onDone }: Props) {
  return (
    <div className="no-print" style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 390, zIndex: 20,
      padding: '12px 16px 24px',
      background: '#fff', borderTop: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', gap: 12,
      opacity: visible ? 1 : 0,
      pointerEvents: visible ? 'auto' : 'none',
      transition: 'opacity 0.25s ease',
    }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ fontSize: 10, color: 'var(--pencil)', fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase' }}>
          Итого · {itemsCount} позиц.
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700 }}>{totalQty} шт</div>
      </div>
      <SPill variant="accent" big onClick={onDone}>Готово →</SPill>
    </div>
  );
}
