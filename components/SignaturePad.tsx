'use client';

import { useEffect, useRef, useState } from 'react';
import { X, RotateCcw, Check } from 'lucide-react';
import { SIGNATURE_VIEWBOX } from '@/lib/types';

type Props = {
  open: boolean;
  title: string;
  initial?: string;
  onClose: () => void;
  onSave: (svgPath: string) => void;
};

const { w: VBW, h: VBH } = SIGNATURE_VIEWBOX;

/** Round to 1 decimal — keeps SVG path small */
const r = (n: number) => Math.round(n * 10) / 10;

export default function SignaturePad({ open, title, initial, onClose, onSave }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [strokes, setStrokes] = useState<string[]>([]);   // committed strokes (SVG path subpaths)
  const [current, setCurrent] = useState<string>('');     // active stroke being drawn
  const drawing = useRef(false);

  // Reset on open / load initial
  useEffect(() => {
    if (open) {
      setStrokes(initial ? [initial] : []);
      setCurrent('');
    }
  }, [open, initial]);

  function toViewBox(e: React.PointerEvent<SVGSVGElement>) {
    const svg = svgRef.current!;
    const rect = svg.getBoundingClientRect();
    // Map screen coords to 400×150 viewBox
    const x = ((e.clientX - rect.left) / rect.width) * VBW;
    const y = ((e.clientY - rect.top) / rect.height) * VBH;
    return { x: r(Math.max(0, Math.min(VBW, x))), y: r(Math.max(0, Math.min(VBH, y))) };
  }

  function down(e: React.PointerEvent<SVGSVGElement>) {
    e.preventDefault();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    drawing.current = true;
    const { x, y } = toViewBox(e);
    setCurrent(`M${x} ${y}`);
  }
  function move(e: React.PointerEvent<SVGSVGElement>) {
    if (!drawing.current) return;
    e.preventDefault();
    const { x, y } = toViewBox(e);
    setCurrent(c => `${c} L${x} ${y}`);
  }
  function up() {
    if (!drawing.current) return;
    drawing.current = false;
    if (current) {
      setStrokes(s => [...s, current]);
      setCurrent('');
    }
  }

  function clear()  { setStrokes([]); setCurrent(''); }
  function save() {
    const path = [...strokes, current].filter(Boolean).join(' ');
    onSave(path);
    onClose();
  }

  const fullPath = [...strokes, current].filter(Boolean).join(' ');
  const isEmpty  = strokes.length === 0 && !current;

  if (!open) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(10,10,10,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
    }}>
      <div style={{
        width: '100%', maxWidth: 520,
        background: '#fff', borderRadius: 16,
        boxShadow: '0 20px 60px rgba(0,0,0,.25)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px', borderBottom: '1px solid var(--border)',
        }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>{title}</div>
          <button onClick={onClose} style={{ minWidth: 36, minHeight: 36, display: 'grid', placeItems: 'center', color: 'var(--pencil)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Canvas */}
        <div style={{ padding: 12, background: 'var(--paper-dim)' }}>
          <svg
            ref={svgRef}
            viewBox={`0 0 ${VBW} ${VBH}`}
            preserveAspectRatio="xMidYMid meet"
            onPointerDown={down}
            onPointerMove={move}
            onPointerUp={up}
            onPointerCancel={up}
            onPointerLeave={up}
            style={{
              width: '100%', height: 'auto', display: 'block',
              background: '#fff',
              border: '1px solid var(--border)', borderRadius: 8,
              touchAction: 'none',
              cursor: 'crosshair',
            }}
          >
            {/* Baseline + hint */}
            <line x1={20} y1={VBH - 18} x2={VBW - 20} y2={VBH - 18}
                  stroke="var(--pencil-light)" strokeDasharray="4 4" strokeWidth={1} />
            {isEmpty && (
              <text x={VBW / 2} y={VBH - 28} textAnchor="middle"
                    fill="var(--pencil)" fontSize={14} fontFamily="var(--font-ui)">
                Распишитесь здесь
              </text>
            )}

            {/* Signature path */}
            {fullPath && (
              <path d={fullPath} fill="none" stroke="var(--ink)"
                    strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
            )}
          </svg>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, padding: 12, borderTop: '1px solid var(--border)' }}>
          <button
            onClick={clear}
            disabled={isEmpty}
            style={{
              flex: 1, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              borderRadius: 10, border: '1px solid var(--border)', background: '#fff',
              fontSize: 13, fontWeight: 600, color: 'var(--ink)',
              opacity: isEmpty ? 0.4 : 1,
            }}
          >
            <RotateCcw size={15} /> Очистить
          </button>
          <button
            onClick={save}
            disabled={isEmpty}
            style={{
              flex: 1.4, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              borderRadius: 10, border: '1px solid var(--accent)', background: 'var(--accent)',
              fontSize: 14, fontWeight: 700, color: '#fff',
              opacity: isEmpty ? 0.4 : 1,
            }}
          >
            <Check size={16} /> Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}
