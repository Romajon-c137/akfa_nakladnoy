'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, Package, Users, MoreHorizontal } from 'lucide-react';

const ITEMS = [
  { label: 'Накладные', Icon: FileText,      href: '/' },
  { label: 'Товары',    Icon: Package,        href: '/products' },
  { label: 'Клиенты',  Icon: Users,          href: '/clients' },
  { label: 'Ещё',      Icon: MoreHorizontal, href: '/more' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 390,
      height: 72,
      borderTop: '1px solid var(--border)',
      background: '#fff',
      display: 'flex',
      paddingBottom: 14,
      zIndex: 20,
    }}>
      {ITEMS.map(({ label, Icon, href }) => {
        const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
        const color = active ? 'var(--accent)' : 'var(--pencil)';
        return (
          <Link
            key={href}
            href={href}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              color,
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: 0.2,
              textDecoration: 'none',
              minHeight: 44,
            }}
          >
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        );
      })}
    </div>
  );
}
