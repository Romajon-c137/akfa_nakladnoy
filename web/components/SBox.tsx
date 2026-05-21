import React from 'react';

type Props = {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  dashed?: boolean;
  accent?: boolean;
  onClick?: () => void;
};

export default function SBox({ children, style, dashed, accent, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      style={{
        border: `1px ${dashed ? 'dashed' : 'solid'} ${accent ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: 12,
        background: accent ? 'var(--accent-tint)' : '#fff',
        cursor: onClick ? 'pointer' : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
