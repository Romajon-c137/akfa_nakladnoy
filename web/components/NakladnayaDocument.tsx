import React from 'react';
import Image from 'next/image';
import { Invoice } from '@/lib/types';

type Props = {
  invoice?: Partial<Invoice>;
  scale?: number;
};

const INFO_BLUE = '#1a56c4';

export default function NakladnayaDocument({ invoice, scale = 1 }: Props) {
  const s = scale;
  const items = invoice?.items ?? [];
  const emptyRows = Math.max(0, 12 - items.length);

  const dateStr = (() => {
    if (!invoice?.date) return { day: '  ', month: '      ' };
    const d = new Date(invoice.date);
    return {
      day: d.getDate().toString(),
      month: d.toLocaleDateString('ru-RU', { month: 'long' }),
    };
  })();

  // Grid: №  | Наименование | Кол-во (wider) | Цена | Сумма
  const cols = `${28 * s}px 1fr ${58 * s}px ${50 * s}px ${54 * s}px`;

  return (
    <div
      id="nakladnaya-doc"
      style={{
        fontFamily: 'var(--font-ui)',
        color: 'var(--ink)',
        background: '#fff',
        padding: `${14 * s}px ${18 * s}px ${18 * s}px`,
        width: '100%',
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 5 * s,
        boxSizing: 'border-box',
        fontSize: 10 * s,
      }}
    >
      {/* LOGO */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 * s }}>
        <Image
          src="/logo.png"
          alt="akfa Glass"
          width={220}
          height={66}
          style={{ height: 58 * s, width: 'auto', objectFit: 'contain' }}
          priority
        />
      </div>

      {/* Red divider */}
      <div style={{ height: 0, borderTop: `3px solid var(--accent)` }} />

      {/* Company info */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
        gap: `${3 * s}px ${14 * s}px`,
        fontSize: 8.5 * s, color: INFO_BLUE,
        paddingTop: 2 * s, lineHeight: 1.4, textAlign: 'center',
      }}>
        <span>тел.: +996 997 000 571; +996 226 400 400</span>
        <span>E-mail: glasscenter.kg@gmail.com</span>
        <span style={{ fontFamily: 'var(--font-mono)' }}>ИНН: 00610202310298 · ОКПО: 32200485</span>
      </div>

      {/* Date */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: 10 * s, marginTop: 4 * s }}>
        {`Дата: «${dateStr.day}» ${dateStr.month} 2026 г.`}
      </div>

      {/* Title */}
      <div style={{
        textAlign: 'center', fontSize: 15 * s, fontWeight: 700,
        margin: `${6 * s}px 0 ${4 * s}px`,
        textTransform: 'uppercase',
      }}>
        {'Накладная  №  '}
        <span style={{
          borderBottom: `1px solid var(--ink)`,
          padding: `0 ${18 * s}px`,
          fontFamily: 'var(--font-mono)', fontWeight: 700, 
        }}>
          {invoice?.number ?? '      '}
        </span>
      </div>

      {/* Table */}
      <div style={{ border: `1.2px solid var(--ink)` }}>
        <div style={{ display: 'grid', gridTemplateColumns: cols, fontWeight: 700, borderBottom: `1.2px solid var(--ink)` }}>
          <Cell s={s} br head center>№</Cell>
          <Cell s={s} br head namecol>Наименование</Cell>
          <Cell s={s} br head center>Кол-во</Cell>
          <Cell s={s} br head center>Цена</Cell>
          <Cell s={s} head center>Сумма</Cell>
        </div>

        {items.map((item, i) => (
          <div key={item.id} style={{ display: 'grid', gridTemplateColumns: cols, borderBottom: `1px solid var(--ink)`, minHeight: 20 * s }}>
            <Cell s={s} br mono center>{String(i + 1).padStart(3, '0')}</Cell>
            <Cell s={s} br mono namecol>{item.sku}</Cell>
            <Cell s={s} br mono center>{item.qty}</Cell>
            <Cell s={s} br mono right />
            <Cell s={s} mono right />
          </div>
        ))}

        {Array.from({ length: emptyRows }).map((_, i) => (
          <div key={`e${i}`} style={{ display: 'grid', gridTemplateColumns: cols, borderBottom: i < emptyRows - 1 ? `1px solid var(--ink)` : 'none', minHeight: 20 * s }}>
            <Cell s={s} br /><Cell s={s} br /><Cell s={s} br /><Cell s={s} br /><Cell s={s} />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 14 * s, fontSize: 12 * s, paddingTop: 16 * s }}>
        <div style={{ display: 'flex', gap: 12 * s, alignItems: 'flex-end' }}>
          <span style={{ whiteSpace: 'nowrap' }}>Машина:</span>
          <span style={{ flex: 1, borderBottom: `1px solid var(--ink)`, paddingBottom: 3 * s }}>
            {invoice?.vehicle ?? ''}
          </span>
          <span style={{ whiteSpace: 'nowrap' }}>Водитель:</span>
          <span style={{ flex: 1.6, borderBottom: `1px solid var(--ink)`, paddingBottom: 3 * s }}>
            {invoice?.driver ?? ''}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 12 * s, alignItems: 'flex-end' }}>
          <span style={{ whiteSpace: 'nowrap' }}>Передал:</span>
          <span style={{ flex: 1, borderBottom: `1px solid var(--ink)`, paddingBottom: 3 * s }}>
            {invoice?.fromPerson ?? ''}
          </span>
          <span style={{ whiteSpace: 'nowrap' }}>Получил:</span>
          <span style={{ flex: 1, borderBottom: `1px solid var(--ink)`, paddingBottom: 3 * s }} />
        </div>
      </div>
    </div>
  );
}

function Cell({
  children, s, br, mono, center, right, head, namecol,
}: {
  children?: React.ReactNode;
  s: number; br?: boolean; mono?: boolean;
  center?: boolean; right?: boolean; head?: boolean; namecol?: boolean;
}) {


  return (
    <div style={{
      padding: `${4 * s}px ${5 * s}px`,
      borderRight: br ? `1px solid var(--ink)` : 'none',
      fontFamily: mono ? 'var(--font-mono)' : 'var(--font-ui)',
      fontSize: 16,
      fontWeight: head ? 700 : 400,
      textAlign: center ? 'center' : right ? 'right' : 'left',
      display: 'flex', alignItems: 'center',
      justifyContent: center ? 'center' : right ? 'flex-end' : 'flex-start',
      overflow: namecol ? 'hidden' : undefined,
      whiteSpace: namecol ? 'nowrap' : undefined,
      textOverflow: namecol ? 'ellipsis' : undefined,
    }}>
      {children}
    </div>
  );
}
