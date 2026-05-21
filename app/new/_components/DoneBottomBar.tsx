'use client';

import { useState } from 'react';
import { Download, Loader2, Printer } from 'lucide-react';
import { shareInvoicePDF } from '@/lib/pdf';
import SPill from '@/components/SPill';
import WhatsAppIcon from '@/components/WhatsAppIcon';

type Props = {
  visible: boolean;
  number: string;
};

export default function DoneBottomBar({ visible, number }: Props) {
  const [waLoading, setWaLoading] = useState(false);

  async function shareWhatsApp() {
    setWaLoading(true);
    try { await shareInvoicePDF(number); } finally { setWaLoading(false); }
  }

  return (
    <div className="no-print" style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 390, zIndex: 20,
      padding: '12px 14px 24px',
      background: '#fff', borderTop: '1px solid var(--border)',
      display: 'flex', gap: 8,
      opacity: visible ? 1 : 0,
      pointerEvents: visible ? 'auto' : 'none',
      transition: 'opacity 0.25s ease',
    }}>
      <SPill variant="ghost" big onClick={() => window.print()} style={{ flex: 1, justifyContent: 'center', gap: 5 }}>
        <Download size={15} /> PDF
      </SPill>
      <SPill
        variant="ghost" big
        disabled={waLoading}
        onClick={shareWhatsApp}
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
  );
}
