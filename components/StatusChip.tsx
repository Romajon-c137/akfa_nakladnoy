import { InvoiceStatus } from '@/lib/types';

const MAP: Record<InvoiceStatus, { label: string; bg: string; fg: string; border: string }> = {
  draft: { label: 'черновик',  bg: '#f0f0f0',          fg: 'var(--ink-soft)', border: 'var(--border)' },
  sent:  { label: 'отправлено', bg: '#fff',             fg: 'var(--ink)',      border: 'var(--ink)' },
  paid:    { label: 'оплачено',  bg: 'var(--accent-tint)', fg: 'var(--accent)',    border: 'var(--accent)' },
  deleted: { label: 'удалено',   bg: '#f0f0f0',            fg: 'var(--pencil)',   border: 'var(--border)' },
};

export default function StatusChip({ status }: { status: InvoiceStatus }) {
  const m = MAP[status];
  return (
    <span style={{
      padding: '3px 9px',
      borderRadius: 999,
      background: m.bg,
      color: m.fg,
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: 0.3,
      textTransform: 'uppercase',
      border: `1px solid ${m.border}`,
      whiteSpace: 'nowrap',
    }}>
      {m.label}
    </span>
  );
}
