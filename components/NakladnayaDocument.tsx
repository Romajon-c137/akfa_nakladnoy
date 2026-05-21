import React from 'react';
import Image from 'next/image';
import { Pencil } from 'lucide-react';
import { Invoice, SIGNATURE_VIEWBOX } from '@/lib/types';

type Props = {
  invoice?: Partial<Invoice>;
  scale?: number;
  /** When provided, "Передал" line becomes clickable to open signature pad */
  onSignFrom?: () => void;
  /** When provided, "Водитель" line becomes clickable to open signature pad */
  onSignDriver?: () => void;
};

const INFO_BLUE = '#1a56c4';

export default function NakladnayaDocument({ invoice, scale = 1, onSignFrom, onSignDriver }: Props) {
  const s = scale;
  const items = invoice?.items ?? [];
  const totalQty = items.reduce((sum, it) => sum + it.qty, 0);

  const dateStr = (() => {
    if (!invoice?.date) return { day: '  ', month: '      ' };
    const d = new Date(invoice.date);
    return {
      day: d.getDate().toString(),
      month: d.toLocaleDateString('ru-RU', { month: 'long' }),
    };
  })();

  // Grid: Наименование | Кол-во | Цена | Сумма
  const cols = `1fr ${78 * s}px ${78 * s}px ${92 * s}px`;

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
        fontSize: 10 * s, color: INFO_BLUE,
        paddingTop: 2 * s, lineHeight: 1.4, textAlign: 'center',
      }}>
        <span>тел.: +996 997 000 571; +996 226 400 400</span>
        <span>E-mail: glasscenter.kg@gmail.com</span>
        <span style={{ fontFamily: 'var(--font-mono)' }}>ИНН: 00610202310298 · ОКПО: 32200485</span>
      </div>

      {/* Date */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: 12 * s, marginTop: 4 * s }}>
        {`Дата: «${dateStr.day}» ${dateStr.month} 2026 г.`}
      </div>

      {/* Title */}
      <div style={{
        textAlign: 'center', fontSize: 18 * s, fontWeight: 700,
        margin: `${6 * s}px 0 ${4 * s}px`,
        textTransform: 'uppercase', letterSpacing: 3 * s,
      }}>
        {'Накладная  №  '}
        <span style={{
          borderBottom: `1px solid var(--ink)`,
          padding: `0 ${22 * s}px`,
          fontFamily: 'var(--font-mono)', fontWeight: 700, letterSpacing: 0,
        }}>
          {invoice?.number ?? '      '}
        </span>
      </div>

      {/* Table */}
      <div style={{ border: `1.2px solid var(--ink)` }}>
        {/* Header row */}
        <div style={{ display: 'grid', gridTemplateColumns: cols, borderBottom: `1.2px solid var(--ink)` }}>
          <Cell s={s} br head namecol>Наименование</Cell>
          <Cell s={s} br head center>Кол-во</Cell>
          <Cell s={s} br head center>Цена</Cell>
          <Cell s={s} head center>Сумма</Cell>
        </div>

        {/* Data rows */}
        {items.map((item, i) => (
          <div
            key={item.id}
            style={{
              display: 'grid',
              gridTemplateColumns: cols,
              borderBottom: i < items.length - 1 ? `1px solid var(--ink)` : 'none',
              minHeight: 26 * s,
            }}
          >
            <Cell s={s} br mono namecol>{item.sku.replace(/\*/g, '×')}</Cell>
            <Cell s={s} br mono right>{item.qty} шт</Cell>
            <Cell s={s} br mono right />
            <Cell s={s} mono right />
          </div>
        ))}

        {/* Итого */}
        {items.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: cols,
              borderTop: `1.2px solid var(--ink)`,
              background: '#f5f5f5',
              fontWeight: 700,
              minHeight: 28 * s,
            }}
          >
            <Cell s={s} br namecol bold>Итого</Cell>
            <Cell s={s} br mono right bold>{totalQty} шт</Cell>
            <Cell s={s} br right bold />
            <Cell s={s} right bold />
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 14 * s, fontSize: 13 * s, paddingTop: 16 * s }}>
        <div style={{ display: 'flex', gap: 12 * s, alignItems: 'flex-end' }}>
          <span style={{ whiteSpace: 'nowrap' }}>Машина:</span>
          <PlainLine s={s} flex={1} value={invoice?.vehicle ?? ''} />
          <span style={{ whiteSpace: 'nowrap' }}>Водитель:</span>
          <SignatureLine
            s={s}
            flex={1.6}
            value={invoice?.driver ?? ''}
            signature={invoice?.signatureDriver}
            onSign={onSignDriver}
          />
        </div>
        <div style={{ display: 'flex', gap: 12 * s, alignItems: 'flex-end' }}>
          <span style={{ whiteSpace: 'nowrap' }}>Передал:</span>
          <SignatureLine
            s={s}
            flex={1}
            value={invoice?.fromPerson ?? ''}
            signature={invoice?.signatureFrom}
            onSign={onSignFrom}
          />
          <span style={{ whiteSpace: 'nowrap' }}>Получил:</span>
          <PlainLine s={s} flex={1} value="" />
        </div>
      </div>
    </div>
  );
}

/* ── Footer line variants ──────────────────────────────────── */

function PlainLine({ s, flex, value }: { s: number; flex: number; value: string }) {
  return (
    <span style={{ flex, borderBottom: `1px solid var(--ink)`, paddingBottom: 3 * s, minWidth: 0 }}>
      {value}
    </span>
  );
}

function SignatureLine({
  s, flex, value, signature, onSign,
}: {
  s: number; flex: number; value: string; signature?: string; onSign?: () => void;
}) {
  const interactive = !!onSign;
  const lineMinHeight = Math.max(28 * s, 24);

  return (
    <span
      onClick={onSign}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      style={{
        flex,
        position: 'relative',
        borderBottom: `1px solid var(--ink)`,
        paddingBottom: 3 * s,
        minHeight: lineMinHeight,
        minWidth: 0,
        cursor: interactive ? 'pointer' : undefined,
        display: 'block',
      }}
    >
      {/* Typed name (underneath signature) */}
      <span style={{ position: 'relative', zIndex: 1 }}>{value}</span>

      {/* Signature SVG overlay (above name, anchored to bottom) */}
      {signature && (
        <svg
          viewBox={`0 0 ${SIGNATURE_VIEWBOX.w} ${SIGNATURE_VIEWBOX.h}`}
          preserveAspectRatio="xMidYMax meet"
          style={{
            position: 'absolute', left: 0, right: 0, bottom: 0,
            width: '100%', height: 'auto', maxHeight: lineMinHeight * 2.4,
            pointerEvents: 'none',
            zIndex: 2,
          }}
        >
          <path d={signature} fill="none" stroke="var(--ink)" strokeWidth={2.2}
                strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}

      {/* "Tap to sign" hint — only when no signature and interactive (hidden on print) */}
      {interactive && !signature && (
        <span
          className="no-print"
          style={{
            position: 'absolute', right: 4, bottom: 4,
            display: 'inline-flex', alignItems: 'center', gap: 3,
            fontSize: 10, color: 'var(--pencil)', fontStyle: 'italic',
            pointerEvents: 'none',
          }}
        >
          <Pencil size={11} /> подпись
        </span>
      )}
    </span>
  );
}

function Cell({
  children, s, br, mono, center, right, head, namecol, bold,
}: {
  children?: React.ReactNode;
  s: number; br?: boolean; mono?: boolean;
  center?: boolean; right?: boolean; head?: boolean; namecol?: boolean; bold?: boolean;
}) {
  return (
    <div style={{
      padding: `${4 * s}px ${8 * s}px`,
      borderRight: br ? `1px solid var(--ink)` : 'none',
      fontFamily: mono ? 'var(--font-mono)' : 'var(--font-ui)',
      fontSize: head ? 13 * s : 13.5 * s,
      fontWeight: head || bold ? 700 : 400,
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
