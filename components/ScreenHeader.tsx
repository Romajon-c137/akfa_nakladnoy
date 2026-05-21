import React from 'react';

type Props = {
  title: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  onLeft?: () => void;
  onRight?: () => void;
};

export default function ScreenHeader({ title, left = '‹', right, onLeft, onRight }: Props) {
  return (
    <div style={{
      padding: '4px 16px 12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 48,
      borderBottom: '1px solid var(--border)',
      background: '#fff',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }}>
      <button
        onClick={onLeft}
        style={{
          fontSize: 22,
          lineHeight: 1,
          color: 'var(--ink)',
          minWidth: 28,
          minHeight: 44,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {left}
      </button>
      <div style={{
        fontSize: 16,
        fontWeight: 600,
        color: 'var(--ink)',
        flex: 1,
        textAlign: 'center',
      }}>
        {title}
      </div>
      <button
        onClick={onRight}
        style={{
          fontSize: 14,
          fontWeight: 500,
          color: 'var(--ink)',
          minWidth: 28,
          minHeight: 44,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        {right ?? ''}
      </button>
    </div>
  );
}
