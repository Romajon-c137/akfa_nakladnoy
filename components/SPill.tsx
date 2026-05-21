import React from 'react';

type Variant = 'default' | 'ghost' | 'accent' | 'dark';

type Props = {
  children: React.ReactNode;
  variant?: Variant;
  big?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
};

export default function SPill({
  children,
  variant = 'default',
  big,
  style,
  onClick,
  disabled,
  type = 'button',
}: Props) {
  const bg =
    variant === 'accent' ? 'var(--accent)' :
    variant === 'dark'   ? 'var(--ink)' :
    variant === 'ghost'  ? 'transparent' : '#fff';

  const fg =
    variant === 'accent' || variant === 'dark' ? '#fff' : 'var(--ink)';

  const border =
    variant === 'accent' ? 'var(--accent)' :
    variant === 'dark'   ? 'var(--ink)' :
    variant === 'ghost'  ? 'var(--border)' : 'var(--border)';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        padding: big ? '12px 18px' : '7px 12px',
        borderRadius: big ? 12 : 999,
        border: `1px solid ${border}`,
        background: bg,
        color: fg,
        fontSize: big ? 15 : 13,
        fontWeight: 600,
        lineHeight: 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        whiteSpace: 'nowrap',
        minHeight: 44,
        ...style,
      }}
    >
      {children}
    </button>
  );
}
