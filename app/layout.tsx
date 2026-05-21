import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Накладные — Glass Center',
  description: 'Мобильная платформа для создания накладных',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <div
          style={{
            maxWidth: 390,
            margin: '0 auto',
            minHeight: '100dvh',
            position: 'relative',
            background: 'var(--paper)',
            overflow: 'hidden',
          }}
        >
          {children}
        </div>
      </body>
    </html>
  );
}
