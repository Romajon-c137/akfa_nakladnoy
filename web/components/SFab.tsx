import React from 'react';

type Props = {
  onClick?: () => void;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  className?: string;
};

export default function SFab({ onClick, style, children = '+', className }: Props) {
  return (
    <button
      onClick={onClick}
      className={className}
      style={{
        width: 56,
        height: 56,
        borderRadius: 999,
        background: 'var(--accent)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 28,
        fontWeight: 400,
        lineHeight: 1,
        boxShadow: '0 8px 24px rgba(238,54,38,.35), 0 2px 6px rgba(0,0,0,.08)',
        border: 'none',
        cursor: 'pointer',
        ...style,
      }}
    >
      {children}
    </button>
  );
}
