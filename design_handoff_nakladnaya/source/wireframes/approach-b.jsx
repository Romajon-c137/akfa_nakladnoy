/* Approach B — Quick Entry Bar (clean) */

function B_QuickEmpty() {
  return (
    <div style={{height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', background: sketchTokens.paperDim}}>
      <CompactHeader />
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: 24, textAlign: 'center'}}>
        <div style={{
          width: 120, height: 70, borderRadius: 10,
          border: `1px dashed ${sketchTokens.border}`,
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 6,
          background: '#fff',
        }}>
          <div style={{width: 70, height: 1.5, background: sketchTokens.pencilLight}} />
          <div style={{width: 90, height: 1.5, background: sketchTokens.pencilLight}} />
          <div style={{width: 50, height: 1.5, background: sketchTokens.pencilLight}} />
        </div>
        <div style={{fontSize: 16, fontWeight: 600, color: sketchTokens.ink}}>
          Начни вводить артикул
        </div>
        <div style={{fontSize: 13, color: sketchTokens.pencil, lineHeight: 1.45, maxWidth: 260}}>
          код · количество · ⏎ — добавляет товар в список
        </div>
      </div>
      <QuickBar focused />
    </div>
  );
}

function B_QuickTyping() {
  const items = [
    { n: '2920-1295 L-1', qty: 3, price: 1200, sum: 3600 },
    { n: '2920-1285 L2-3', qty: 6, price: 1150, sum: 6900 },
    { n: '3030-1255 L1-1', qty: 2, price: 1400, sum: 2800 },
  ];
  return (
    <div style={{height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', background: sketchTokens.paperDim}}>
      <CompactHeader badge="3 · 13 300 c" />
      <div style={{flex: 1, overflow: 'hidden', padding: '10px 14px 0', display: 'flex', flexDirection: 'column', gap: 8}}>
        {items.map((it, i) => <ItemRow key={i} idx={i+1} {...it} />)}
      </div>
      {/* autocomplete dropdown above the entry bar */}
      <div style={{
        position: 'absolute', left: 12, right: 12, bottom: 158,
        background: '#fff',
        border: `1px solid ${sketchTokens.border}`,
        borderRadius: 12,
        boxShadow: '0 10px 30px rgba(0,0,0,.10)',
        padding: 4,
        display: 'flex', flexDirection: 'column', gap: 2,
      }}>
        {[
          ['3030-1250 L1-3', '1380'],
          ['3030-1250 L1-1', '1400'],
          ['3030-1250 L2-2', '1410'],
        ].map((r, i) => (
          <div key={i} style={{
            padding: '10px 12px',
            background: i === 0 ? sketchTokens.accentTint : 'transparent',
            borderRadius: 8,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{fontFamily: MONO_FONT, fontSize: 13, fontWeight: 700}}>
              <Highlight color={sketchTokens.accentSoft}>3030-1250</Highlight>{' '}{r[0].split(' ')[1]}
            </span>
            <span style={{fontFamily: MONO_FONT, fontSize: 12, color: sketchTokens.inkSoft, fontWeight: 600}}>{r[1]} c</span>
          </div>
        ))}
      </div>
      <QuickBar value="3030-1250" qty="6" focused />
    </div>
  );
}

function B_QuickFull() {
  const items = [
    { n: '2920-1295 L-1', qty: 3, price: 1200, sum: 3600 },
    { n: '2920-1285 L2-3', qty: 6, price: 1150, sum: 6900 },
    { n: '3030-1255 L1-1', qty: 2, price: 1400, sum: 2800 },
    { n: '3030-1250 L1-3', qty: 6, price: 1380, sum: 8280 },
    { n: '2920-1285 L2-1', qty: 2, price: 1150, sum: 2300 },
    { n: '2920-1300 L2', qty: 1, price: 1180, sum: 1180 },
    { n: '2920-1280 L3-3', qty: 3, price: 1150, sum: 3450 },
    { n: '870-1250 L1-3', qty: 1, price: 620, sum: 620 },
  ];
  return (
    <div style={{height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', background: sketchTokens.paperDim}}>
      <CompactHeader />
      <div style={{flex: 1, overflow: 'hidden', padding: '10px 14px 0', display: 'flex', flexDirection: 'column', gap: 6}}>
        {items.map((it, i) => <ItemRow key={i} idx={i+1} {...it} compact />)}
      </div>
      <div style={{
        padding: '10px 14px',
        background: '#fff',
        borderTop: `1px solid ${sketchTokens.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{fontSize: 12, color: sketchTokens.pencil}}>
          8 позиций · <span style={{fontFamily: MONO_FONT, fontWeight: 700, color: sketchTokens.ink, fontSize: 14}}>29 130 c</span>
        </div>
        <div style={{display: 'flex', gap: 6}}>
          <SPill ghost>⤓</SPill>
          <SPill accent>Отправить →</SPill>
        </div>
      </div>
      <QuickBar />
    </div>
  );
}

function CompactHeader({ badge }) {
  return (
    <div style={{padding: '10px 14px 10px', display: 'flex', alignItems: 'center', gap: 8, background: '#fff', borderBottom: `1px solid ${sketchTokens.border}`}}>
      <div style={{width: 30, height: 30, borderRadius: 8, border: `1px solid ${sketchTokens.border}`, display: 'grid', placeItems: 'center', fontSize: 16, fontWeight: 500}}>‹</div>
      <SBox style={{flex: 1, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8}}>
        <span style={{fontFamily: MONO_FONT, fontSize: 13, fontWeight: 700}}>№ 1024</span>
        <span style={{color: sketchTokens.pencilLight}}>|</span>
        <span style={{fontSize: 13, color: sketchTokens.inkSoft, fontWeight: 500}}>«Алтын-Курулуш»</span>
        <span style={{marginLeft: 'auto', fontSize: 12, color: sketchTokens.pencil}}>✎</span>
      </SBox>
      {badge ? (
        <div style={{
          background: sketchTokens.ink, color: '#fff',
          padding: '5px 10px', borderRadius: 999,
          fontFamily: MONO_FONT, fontSize: 11, fontWeight: 700,
        }}>{badge}</div>
      ) : (
        <SPill ghost style={{padding: '7px 9px'}}>⌕</SPill>
      )}
    </div>
  );
}

function ItemRow({ idx, n, qty, price, sum, compact }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: compact ? '8px 12px' : '10px 14px',
      background: '#fff',
      border: `1px solid ${sketchTokens.border}`,
      borderRadius: 10,
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: 5,
        background: sketchTokens.paperDim,
        display: 'grid', placeItems: 'center',
        fontFamily: MONO_FONT, fontSize: 10, fontWeight: 700,
      }}>{idx}</div>
      <div style={{flex: 1, fontFamily: MONO_FONT, fontSize: 13, fontWeight: 700}}>{n}</div>
      <div style={{fontFamily: MONO_FONT, fontSize: 12, color: sketchTokens.inkSoft, minWidth: 32, textAlign: 'right'}}>×{qty}</div>
      <div style={{fontFamily: MONO_FONT, fontSize: 12, color: sketchTokens.inkSoft, minWidth: 46, textAlign: 'right'}}>{price}</div>
      <div style={{fontFamily: MONO_FONT, fontSize: 13, fontWeight: 700, minWidth: 52, textAlign: 'right'}}>{sum}</div>
    </div>
  );
}

function QuickBar({ value, qty, focused }) {
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: '#fff',
      borderTop: `1px solid ${sketchTokens.border}`,
      padding: '12px 14px 22px',
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
        <div style={{
          flex: 2,
          border: `1.5px solid ${focused ? sketchTokens.accent : sketchTokens.border}`,
          borderRadius: 10,
          padding: '10px 12px',
          fontFamily: MONO_FONT, fontSize: 14, fontWeight: 700,
          background: '#fff',
          display: 'flex', alignItems: 'center',
          minHeight: 44,
        }}>
          {value
            ? <span><Highlight color={sketchTokens.accentSoft}>{value}</Highlight><span style={{borderLeft: `2px solid ${sketchTokens.accent}`, height: 14, display: 'inline-block', marginLeft: 1, verticalAlign: 'middle'}} /></span>
            : <span style={{color: sketchTokens.pencil, fontWeight: 500}}>код / артикул</span>
          }
        </div>
        <div style={{
          width: 60,
          border: `1px solid ${sketchTokens.border}`,
          borderRadius: 10,
          padding: '10px 0',
          textAlign: 'center',
          fontFamily: MONO_FONT, fontSize: 15, fontWeight: 700,
          minHeight: 44,
        }}>×{qty || '1'}</div>
        <div style={{
          width: 44, height: 44, borderRadius: 10,
          background: sketchTokens.accent, color: '#fff',
          display: 'grid', placeItems: 'center',
          fontSize: 20, fontWeight: 600,
        }}>↵</div>
      </div>
      <div style={{display: 'flex', gap: 14, fontSize: 11, color: sketchTokens.pencil, fontWeight: 500}}>
        <span>⏎ добавить</span><span>▢ скан</span><span>🎤 голос</span>
      </div>
    </div>
  );
}

Object.assign(window, { B_QuickEmpty, B_QuickTyping, B_QuickFull });
