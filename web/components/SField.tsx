import React from 'react';

type Props = {
  label: string;
  value?: string;
  placeholder?: string;
  onChange?: (v: string) => void;
  style?: React.CSSProperties;
  mono?: boolean;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  maxLength?: number;
};

export default function SField({ label, value, placeholder, onChange, style, mono, inputMode, maxLength }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, ...style }}>
      <div style={{
        fontSize: 11,
        color: 'var(--pencil)',
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: 0.4,
      }}>
        {label}
      </div>
      {onChange ? (
        <input
          value={value ?? ''}
          placeholder={placeholder ?? ''}
          onChange={e => onChange(e.target.value)}
          inputMode={inputMode}
          maxLength={maxLength}
          style={{
            fontSize: 15,
            fontWeight: 500,
            color: 'var(--ink)',
            fontFamily: mono ? 'var(--font-mono)' : 'var(--font-ui)',
            borderBottom: '1px solid var(--border)',
            padding: '4px 0',
            width: '100%',
            minHeight: 28,
            background: 'transparent',
          }}
        />
      ) : (
        <div style={{
          fontSize: 15,
          fontWeight: 500,
          color: value ? 'var(--ink)' : 'var(--pencil)',
          fontFamily: mono ? 'var(--font-mono)' : 'var(--font-ui)',
          borderBottom: '1px solid var(--border)',
          padding: '4px 0',
          minHeight: 28,
        }}>
          {value || placeholder || ''}
        </div>
      )}
    </div>
  );
}
