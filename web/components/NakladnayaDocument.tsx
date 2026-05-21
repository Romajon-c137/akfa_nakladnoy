import React from 'react';
import Image from 'next/image';
import { Invoice } from '@/lib/types';
import s from './NakladnayaDocument.module.css';

type Props = {
  invoice?: Partial<Invoice>;
  scale?: number;
};

function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export default function NakladnayaDocument({ invoice, scale = 1 }: Props) {
  const items = invoice?.items ?? [];
  const totalQty = items.reduce((sum, it) => sum + it.qty, 0);

  const date = (() => {
    if (!invoice?.date) return '';
    const d = new Date(invoice.date);
    const day   = d.getDate();
    const month = d.toLocaleDateString('ru-RU', { month: 'long' });
    return `Дата: «${day}» ${month} 2026 г.`;
  })();

  return (
    <div
      id="nakladnaya-doc"
      className={s.doc}
      style={{ '--s': scale } as React.CSSProperties}
    >
      {/* Logo */}
      <div className={s.logoWrap}>
        <Image
          src="/logo.png"
          alt="akfa Glass"
          width={220}
          height={66}
          className={s.logoImg}
          priority
        />
      </div>

      {/* Red divider */}
      <hr className={s.divider} />

      {/* Company info */}
      <p className={s.companyInfo}>
        <span>тел.: +996 997 000 571; +996 226 400 400</span>
        <span>E-mail: glasscenter.kg@gmail.com</span>
        <span className={s.companyMono}>ИНН: 00610202310298 · ОКПО: 32200485</span>
      </p>

      {/* Date */}
      {date && <div className={s.date}>{date}</div>}

      {/* Title */}
      <div className={s.title}>
        Накладная &nbsp;№&nbsp;
        <span className={s.titleNumber}>
          {invoice?.number ?? '      '}
        </span>
      </div>

      {/* Table */}
      <div className={s.table}>
        {/* Header */}
        <div className={cx(s.row, s.rowHead)}>
          <Cell name head border>Наименование</Cell>
          <Cell center head border>Кол-во</Cell>
          <Cell center head border>Цена</Cell>
          <Cell center head>Сумма</Cell>
        </div>

        {/* Data rows */}
        {items.map(item => (
          <div key={item.id} className={cx(s.row, s.rowData)}>
            <Cell name mono border>{item.sku.replace(/\*/g, '×')}</Cell>
            <Cell right mono border>{item.qty} шт</Cell>
            <Cell right mono border />
            <Cell right mono />
          </div>
        ))}

        {/* Total */}
        {items.length > 0 && (
          <div className={cx(s.row, s.rowTotal)}>
            <Cell name border>Итого</Cell>
            <Cell right mono border>{totalQty} шт</Cell>
            <Cell right border />
            <Cell right />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className={s.footer}>
        <div className={s.footerRow}>
          <span className={s.footerLabel}>Машина:</span>
          <span className={s.footerLine}>{invoice?.vehicle ?? ''}</span>
          <span className={s.footerLabel}>Водитель:</span>
          <span className={s.footerLineWide}>{invoice?.driver ?? ''}</span>
        </div>
        <div className={s.footerRow}>
          <span className={s.footerLabel}>Передал:</span>
          <span className={s.footerLine}>{invoice?.fromPerson ?? ''}</span>
          <span className={s.footerLabel}>Получил:</span>
          <span className={s.footerLine} />
        </div>
      </footer>
    </div>
  );
}

/* ── Cell ── */
type CellProps = {
  children?: React.ReactNode;
  border?: boolean;
  mono?:   boolean;
  center?: boolean;
  right?:  boolean;
  head?:   boolean;
  name?:   boolean;
};

function Cell({ children, border, mono, center, right, head, name }: CellProps) {
  return (
    <div className={cx(
      s.cell,
      border && s.cellBorder,
      mono   && s.cellMono,
      center && s.cellCenter,
      right  && s.cellRight,
      head   && !name && s.cellHead,
      name   && !head && s.cellName,
      name   && head  && s.cellNameHead,
    )}>
      {children}
    </div>
  );
}
