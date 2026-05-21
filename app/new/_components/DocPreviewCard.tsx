'use client';

import { Invoice } from '@/lib/types';
import NakladnayaDocument from '@/components/NakladnayaDocument';

type Props = {
  invoice: Partial<Invoice>;
  shadow?: 'sm' | 'lg';
  onSignFrom?: () => void;
  onSignDriver?: () => void;
};

export default function DocPreviewCard({ invoice, shadow = 'sm', onSignFrom, onSignDriver }: Props) {
  const boxShadow =
    shadow === 'lg'
      ? '0 6px 24px rgba(0,0,0,.12)'
      : '0 4px 18px rgba(0,0,0,.08)';
  return (
    <div style={{ padding: '14px 12px 110px' }}>
      <div className="print-doc-wrap" style={{ background: '#fff', boxShadow }}>
        <NakladnayaDocument invoice={invoice} onSignFrom={onSignFrom} onSignDriver={onSignDriver} />
      </div>
    </div>
  );
}
