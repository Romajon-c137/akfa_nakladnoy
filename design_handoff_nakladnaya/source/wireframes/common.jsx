/* Common primitives — clean / strict document-style UI
   Palette: black + #EE3626 accent. Font: Inter. */

const PHONE_W = 390;
const PHONE_H = 844;

const sketchTokens = {
  paper: '#ffffff',
  paperDim: '#f5f6f7',
  paperDeep: '#eceef0',
  ink: '#0a0a0a',
  inkSoft: '#3a3a3a',
  pencil: '#8a8a8a',
  pencilLight: '#d6d6d6',
  border: '#d6d6d6',
  borderStrong: '#0a0a0a',
  accent: '#EE3626',
  accentSoft: '#fde6e3',
  accentTint: '#fff5f3',
  highlight: '#fde6e3',
  mint: '#e8e8e8',
  sky: '#e8e8e8',
};

const UI_FONT = 'Inter, -apple-system, BlinkMacSystemFont, "Helvetica Neue", system-ui, sans-serif';
const MONO_FONT = '"SF Mono", "Menlo", "Consolas", "Roboto Mono", monospace';

// ===== Phone wrapper — clean iOS-style frame =====
function SketchPhone({ title, children, tint = 'paper', annotate }) {
  return (
    <div style={{
      width: PHONE_W + 24,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 14,
      fontFamily: UI_FONT,
      color: sketchTokens.ink,
    }}>
      {title && (
        <div style={{
          fontFamily: UI_FONT,
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: 0.4,
          textTransform: 'uppercase',
          color: sketchTokens.ink,
          paddingLeft: 8,
        }}>
          {title}
        </div>
      )}
      <div style={{
        position: 'relative',
        width: PHONE_W + 12,
        height: PHONE_H + 12,
        borderRadius: 54,
        border: `1px solid ${sketchTokens.ink}`,
        background: '#000',
        padding: 6,
        boxShadow: '0 18px 40px rgba(0,0,0,.10), 0 2px 6px rgba(0,0,0,.08)',
      }}>
        <div style={{
          width: PHONE_W,
          height: PHONE_H,
          borderRadius: 48,
          background: sketchTokens[tint] || sketchTokens.paper,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <StatusBar />
          <div style={{
            position: 'absolute',
            top: 10,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 96,
            height: 26,
            borderRadius: 999,
            background: '#000',
          }} />
          <div style={{
            position: 'absolute',
            top: 50,
            left: 0,
            right: 0,
            bottom: 0,
          }}>
            {children}
          </div>
          <div style={{
            position: 'absolute',
            bottom: 7,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 130,
            height: 4,
            borderRadius: 3,
            background: sketchTokens.ink,
            opacity: 0.85,
          }} />
        </div>
      </div>
      {annotate && (
        <div style={{
          width: PHONE_W + 12,
          fontFamily: UI_FONT,
          fontSize: 12,
          color: sketchTokens.pencil,
          lineHeight: 1.45,
          padding: '0 8px',
        }}>
          {annotate}
        </div>
      )}
    </div>
  );
}

function StatusBar() {
  return (
    <div style={{
      position: 'absolute',
      top: 0, left: 0, right: 0,
      height: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 26px',
      fontFamily: UI_FONT,
      fontSize: 15,
      fontWeight: 600,
      color: sketchTokens.ink,
      zIndex: 2,
    }}>
      <span>9:41</span>
      <span style={{display: 'flex', gap: 5, alignItems: 'center'}}>
        <span style={{display:'inline-block', width: 16, height: 10, borderRadius: 2, background: sketchTokens.ink, opacity: 0.9}} />
        <span style={{display:'inline-block', width: 22, height: 11, border: `1.2px solid ${sketchTokens.ink}`, borderRadius: 3, position: 'relative'}}>
          <span style={{position: 'absolute', inset: 1.5, width: 13, background: sketchTokens.ink, borderRadius: 1}} />
        </span>
      </span>
    </div>
  );
}

// ===== Primitives =====
function SBox({ children, style, dashed, accent, ...rest }) {
  return (
    <div style={{
      border: `1px ${dashed ? 'dashed' : 'solid'} ${sketchTokens.border}`,
      borderRadius: 12,
      background: accent ? sketchTokens.accentTint : '#fff',
      ...style,
    }} {...rest}>{children}</div>
  );
}

function SLine({ w = '100%', dashed, style }) {
  return <div style={{
    width: w,
    height: 0,
    borderTop: `1px ${dashed ? 'dashed' : 'solid'} ${sketchTokens.pencilLight}`,
    ...style,
  }} />;
}

function SField({ label, value, full, style }) {
  return (
    <div style={{
      flex: full ? 1 : undefined,
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      ...style,
    }}>
      {label && (
        <div style={{
          fontSize: 11, color: sketchTokens.pencil,
          fontFamily: UI_FONT, fontWeight: 500,
          textTransform: 'uppercase', letterSpacing: 0.4,
        }}>{label}</div>
      )}
      <div style={{
        minHeight: 24,
        fontSize: 15,
        color: sketchTokens.ink,
        padding: '4px 0',
        fontFamily: UI_FONT,
        fontWeight: 500,
        borderBottom: `1px solid ${sketchTokens.border}`,
      }}>{value || ''}</div>
    </div>
  );
}

function SPill({ children, accent, ghost, dark, style, onClick, big }) {
  const bg = accent ? sketchTokens.accent : dark ? sketchTokens.ink : ghost ? 'transparent' : '#fff';
  const fg = accent || dark ? '#fff' : sketchTokens.ink;
  return (
    <div onClick={onClick} style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: big ? '12px 18px' : '7px 12px',
      borderRadius: big ? 12 : 999,
      border: ghost ? `1px solid ${sketchTokens.border}` : `1px solid ${accent ? sketchTokens.accent : dark ? sketchTokens.ink : sketchTokens.border}`,
      background: bg,
      color: fg,
      fontFamily: UI_FONT,
      fontSize: big ? 15 : 13,
      fontWeight: 600,
      lineHeight: 1,
      cursor: 'pointer',
      ...style,
    }}>{children}</div>
  );
}

function SFab({ children = '+', style, color }) {
  const bg = color || sketchTokens.accent;
  return (
    <div style={{
      width: 56, height: 56, borderRadius: 999,
      background: bg,
      color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 28, fontFamily: UI_FONT, fontWeight: 400,
      lineHeight: 1,
      boxShadow: '0 8px 24px rgba(238,54,38,.35), 0 2px 6px rgba(0,0,0,.08)',
      ...style,
    }}>{children}</div>
  );
}

function ScreenHeader({ title, left = '‹', right, sub }) {
  return (
    <div style={{
      padding: '4px 16px 12px',
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      borderBottom: `1px solid ${sketchTokens.border}`,
      background: '#fff',
    }}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 32}}>
        <div style={{fontSize: 22, lineHeight: 1, color: sketchTokens.ink, width: 24, fontFamily: UI_FONT, fontWeight: 400}}>{left}</div>
        <div style={{
          fontFamily: UI_FONT,
          fontSize: 16,
          fontWeight: 600,
          color: sketchTokens.ink,
        }}>{title}</div>
        <div style={{minWidth: 24, textAlign: 'right', fontSize: 14, fontFamily: UI_FONT, fontWeight: 500, color: sketchTokens.ink}}>{right}</div>
      </div>
      {sub && <div style={{fontSize: 11, color: sketchTokens.pencil, textAlign: 'center', fontFamily: UI_FONT}}>{sub}</div>}
    </div>
  );
}

function BottomNav({ active = 0 }) {
  const items = [
    { l: 'Накладные', i: '▤' },
    { l: 'Товары', i: '▦' },
    { l: 'Клиенты', i: '◯' },
    { l: 'Ещё', i: '⋯' },
  ];
  return (
    <div style={{
      position: 'absolute',
      bottom: 0, left: 0, right: 0,
      height: 72,
      borderTop: `1px solid ${sketchTokens.border}`,
      background: '#fff',
      display: 'flex',
      paddingBottom: 14,
    }}>
      {items.map((it, i) => (
        <div key={i} style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
          color: i === active ? sketchTokens.accent : sketchTokens.pencil,
          fontFamily: UI_FONT,
          fontWeight: 500,
        }}>
          <div style={{fontSize: 18, lineHeight: 1}}>{it.i}</div>
          <div style={{fontSize: 10, letterSpacing: 0.2}}>{it.l}</div>
        </div>
      ))}
    </div>
  );
}

function SketchAnnotation({ children, style }) {
  return (
    <div style={{
      fontFamily: UI_FONT,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: 0.4,
      textTransform: 'uppercase',
      color: sketchTokens.accent,
      lineHeight: 1.2,
      ...style,
    }}>
      {children}
    </div>
  );
}

function Highlight({ children, color, style }) {
  return (
    <span style={{
      background: color || sketchTokens.highlight,
      padding: '0 3px',
      borderRadius: 2,
      ...style,
    }}>{children}</span>
  );
}

function Squiggle({ style }) {
  return <div style={{height: 0, borderTop: `1px solid ${sketchTokens.border}`, ...style}} />;
}

// ===== Strict document — exactly as in uploaded docx =====
// Renders НАКЛАДНАЯ form with the original company header, fields, table, and footer.
function NakladnayaDocument({ scale = 1, fillData = false, highlightHeader = false, highlightTable = false }) {
  const items = fillData ? [
    ['1', '2920-1295 L-1', '3', '1200', '3600'],
    ['2', '2920-1285 L2-3', '6', '1150', '6900'],
    ['3', '3030-1255 L1-1', '2', '1400', '2800'],
    ['4', '3030-1250 L1-3', '6', '1380', '8280'],
    ['5', '2920-1285 L2-1', '2', '1150', '2300'],
    ['6', '2920-1300 L2', '1', '1180', '1180'],
    ['7', '2920-1280 L3-3', '3', '1150', '3450'],
    ['8', '870-1250 L1-3', '1', '620', '620'],
  ] : [
    ['1', '2920-1295 L-1', '3', '', ''],
    ['2', '2920-1285 L2-3', '6', '', ''],
    ['3', '3030-1255 L1-1', '2', '', ''],
    ['4', '3030-1250 L1-3', '6', '', ''],
    ['5', '2920-1285 L2-1', '2', '', ''],
    ['6', '2920-1300 L2', '1', '', ''],
    ['7', '2920-1280 L3-3', '3', '', ''],
    ['8', '870-1250 L1-3', '1', '', ''],
  ];
  // Add some empty rows to mirror docx blank rows (just a handful for screen)
  const emptyRows = 4;
  const s = scale;
  return (
    <div style={{
      fontFamily: UI_FONT,
      color: sketchTokens.ink,
      background: '#fff',
      padding: 18 * s,
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 6 * s,
      boxSizing: 'border-box',
    }}>
      {/* HEADER — company info */}
      <div style={{
        display: 'flex', gap: 10 * s,
        background: highlightHeader ? sketchTokens.accentTint : 'transparent',
        margin: highlightHeader ? `${-4*s}px ${-4*s}px` : 0,
        padding: highlightHeader ? `${4*s}px ${4*s}px` : 0,
        borderRadius: 4,
      }}>
        <div style={{
          width: 46*s, height: 46*s,
          border: `1px solid ${sketchTokens.ink}`,
          display: 'grid', placeItems: 'center',
          fontSize: 11*s, fontWeight: 700, letterSpacing: 0.5,
          flexShrink: 0,
        }}>GC</div>
        <div style={{flex: 1, lineHeight: 1.3, fontSize: 9*s}}>
          <div style={{fontWeight: 700, fontSize: 11*s}}>Glass Center</div>
          <div>тел.: +996 997 000 571; +996 226 400 400</div>
          <div>E-mail: glasscenter.kg@gmail.com</div>
          <div style={{fontFamily: MONO_FONT, fontSize: 9*s}}>ИНН: 00610202310298 · ОКПО: 32200485</div>
        </div>
        <div style={{
          textAlign: 'right', fontFamily: MONO_FONT,
          fontSize: 9*s, color: sketchTokens.inkSoft, lineHeight: 1.3,
        }}>
          <div>723899</div>
          <div>303311</div>
        </div>
      </div>

      <div style={{height: 0, borderTop: `2px solid ${sketchTokens.ink}`, marginTop: 2*s}} />

      {/* DATE */}
      <div style={{
        display: 'flex', justifyContent: 'flex-end',
        fontSize: 10*s, fontFamily: UI_FONT,
        marginTop: 4*s,
      }}>
        Дата: «{fillData ? ' 20 ' : '\u00A0\u00A0\u00A0'}»{fillData ? ' мая ' : '\u00A0\u00A0\u00A0\u00A0\u00A0'}2026 г.
      </div>

      {/* TITLE */}
      <div style={{
        textAlign: 'center',
        fontSize: 18*s,
        fontWeight: 800,
        letterSpacing: 4*s,
        margin: `${6*s}px 0 ${2*s}px`,
      }}>
        НАКЛАДНАЯ № <span style={{borderBottom: `1px solid ${sketchTokens.ink}`, padding: `0 ${20*s}px`, fontFamily: MONO_FONT, fontWeight: 700, letterSpacing: 0}}>{fillData ? '1024' : '\u00A0'}</span>
      </div>

      {/* TABLE */}
      <div style={{
        border: `1.2px solid ${sketchTokens.ink}`,
        fontFamily: UI_FONT,
        fontSize: 10*s,
        background: highlightTable ? sketchTokens.accentTint : 'transparent',
        marginTop: 4*s,
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `${24*s}px 1fr ${44*s}px ${52*s}px ${56*s}px`,
          fontWeight: 700,
          borderBottom: `1.2px solid ${sketchTokens.ink}`,
          background: '#fff',
        }}>
          <CellHead s={s} br>№</CellHead>
          <CellHead s={s} br>Наименование</CellHead>
          <CellHead s={s} br>Кол-во</CellHead>
          <CellHead s={s} br>Цена</CellHead>
          <CellHead s={s}>Сумма</CellHead>
        </div>
        {items.map((row, i) => (
          <div key={i} style={{
            display: 'grid',
            gridTemplateColumns: `${24*s}px 1fr ${44*s}px ${52*s}px ${56*s}px`,
            borderBottom: `1px solid ${sketchTokens.ink}`,
            minHeight: 18*s,
          }}>
            <Cell s={s} br mono>{row[0]}</Cell>
            <Cell s={s} br mono>{row[1]}</Cell>
            <Cell s={s} br mono center>{row[2]}</Cell>
            <Cell s={s} br mono right>{row[3]}</Cell>
            <Cell s={s} mono right>{row[4]}</Cell>
          </div>
        ))}
        {Array.from({length: emptyRows}).map((_, i) => (
          <div key={'e'+i} style={{
            display: 'grid',
            gridTemplateColumns: `${24*s}px 1fr ${44*s}px ${52*s}px ${56*s}px`,
            borderBottom: i === emptyRows-1 ? 'none' : `1px solid ${sketchTokens.ink}`,
            minHeight: 18*s,
          }}>
            <Cell s={s} br />
            <Cell s={s} br />
            <Cell s={s} br />
            <Cell s={s} br />
            <Cell s={s} />
          </div>
        ))}
      </div>

      {/* FOOTER lines */}
      <div style={{marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10*s, fontSize: 10*s, paddingTop: 14*s}}>
        <div style={{display: 'flex', gap: 10*s}}>
          <span>Машина:</span>
          <span style={{flex: 1, borderBottom: `1px solid ${sketchTokens.ink}`}} />
          <span>Водитель:</span>
          <span style={{flex: 1.6, borderBottom: `1px solid ${sketchTokens.ink}`}} />
        </div>
        <div style={{display: 'flex', gap: 10*s}}>
          <span>Передал:</span>
          <span style={{flex: 1, borderBottom: `1px solid ${sketchTokens.ink}`}} />
          <span>Получил:</span>
          <span style={{flex: 1, borderBottom: `1px solid ${sketchTokens.ink}`}} />
        </div>
      </div>
    </div>
  );
}

function CellHead({ children, s, br }) {
  return (
    <div style={{
      padding: `${3*s}px ${4*s}px`,
      borderRight: br ? `1px solid ${sketchTokens.ink}` : 'none',
      textAlign: 'center',
      fontSize: 9*s,
      fontWeight: 700,
      letterSpacing: 0.2,
    }}>{children}</div>
  );
}

function Cell({ children, s, br, mono, center, right }) {
  return (
    <div style={{
      padding: `${3*s}px ${5*s}px`,
      borderRight: br ? `1px solid ${sketchTokens.ink}` : 'none',
      fontSize: 9.5*s,
      fontFamily: mono ? MONO_FONT : UI_FONT,
      textAlign: center ? 'center' : right ? 'right' : 'left',
      display: 'flex',
      alignItems: 'center',
      justifyContent: center ? 'center' : right ? 'flex-end' : 'flex-start',
    }}>{children}</div>
  );
}

Object.assign(window, {
  PHONE_W, PHONE_H, sketchTokens, UI_FONT, MONO_FONT,
  SketchPhone, SBox, SLine, SField, SPill, SFab,
  ScreenHeader, BottomNav, SketchAnnotation, Highlight, Squiggle,
  NakladnayaDocument,
});
