/* Home / list screen — strict document UI */

function HomeList() {
  const items = [
    { n: '№ 1024', who: 'ОсОО "Алтын-Курулуш"', date: 'сегодня · 14:20', sum: '48 200', status: 'draft' },
    { n: '№ 1023', who: 'ИП Бекмурзаев А.', date: 'сегодня · 11:05', sum: '12 750', status: 'sent' },
    { n: '№ 1022', who: 'СтройПлюс', date: 'вчера', sum: '94 300', status: 'sent' },
    { n: '№ 1021', who: 'Магазин «Окна 24»', date: 'вчера', sum: '6 400', status: 'paid' },
    { n: '№ 1020', who: 'Частное лицо', date: '12 мая', sum: '18 000', status: 'sent' },
  ];
  return (
    <div style={{height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', background: sketchTokens.paperDim}}>
      {/* large title block */}
      <div style={{padding: '8px 18px 14px', background: '#fff', borderBottom: `1px solid ${sketchTokens.border}`}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{fontSize: 11, color: sketchTokens.pencil, fontWeight: 500, letterSpacing: 0.5, textTransform: 'uppercase'}}>Glass Center</div>
          <div style={{fontSize: 16, color: sketchTokens.ink}}>⌕</div>
        </div>
        <div style={{fontSize: 28, fontWeight: 700, letterSpacing: -0.4, marginTop: 2}}>Накладные</div>
      </div>

      {/* filter chips */}
      <div style={{padding: '12px 16px 10px', display: 'flex', gap: 8, overflowX: 'auto', background: '#fff', borderBottom: `1px solid ${sketchTokens.border}`}}>
        <SPill dark>Все · 247</SPill>
        <SPill ghost>Черновики · 4</SPill>
        <SPill ghost>Отправлено</SPill>
        <SPill ghost>Оплачено</SPill>
      </div>

      {/* date group label */}
      <div style={{padding: '14px 18px 8px', fontSize: 11, color: sketchTokens.pencil, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase'}}>
        Сегодня
      </div>

      {/* items */}
      <div style={{flex: 1, overflow: 'hidden', padding: '0 14px', display: 'flex', flexDirection: 'column', gap: 8}}>
        {items.map((it, i) => (
          <SBox key={i} style={{padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, background: '#fff'}}>
            <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 4}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                <span style={{fontFamily: MONO_FONT, fontSize: 13, fontWeight: 700}}>{it.n}</span>
                <span style={{fontSize: 11, color: sketchTokens.pencil}}>{it.date}</span>
              </div>
              <div style={{fontSize: 14, fontWeight: 500}}>{it.who}</div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2}}>
                <StatusChip status={it.status} />
                <span style={{fontFamily: MONO_FONT, fontSize: 14, fontWeight: 700}}>{it.sum} c</span>
              </div>
            </div>
          </SBox>
        ))}
      </div>

      {/* FAB */}
      <SFab style={{position: 'absolute', right: 18, bottom: 92}}>+</SFab>

      <BottomNav active={0} />
    </div>
  );
}

function StatusChip({ status }) {
  const map = {
    draft: { l: 'черновик', bg: '#f0f0f0', fg: sketchTokens.inkSoft, border: sketchTokens.border },
    sent: { l: 'отправлено', bg: '#fff', fg: sketchTokens.ink, border: sketchTokens.ink },
    paid: { l: 'оплачено', bg: sketchTokens.accentTint, fg: sketchTokens.accent, border: sketchTokens.accent },
  };
  const m = map[status];
  return (
    <span style={{
      padding: '3px 9px',
      borderRadius: 999,
      background: m.bg,
      color: m.fg,
      fontFamily: UI_FONT,
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: 0.3,
      textTransform: 'uppercase',
      border: `1px solid ${m.border}`,
    }}>{m.l}</span>
  );
}

// ===== Shared PDF preview screen — uses strict NakladnayaDocument =====
function PreviewPDF() {
  return (
    <div style={{height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', background: sketchTokens.paperDeep}}>
      <ScreenHeader title="Накладная № 1024" left="‹" right="⋯" />
      <div style={{flex: 1, padding: '16px 16px 110px', overflow: 'hidden'}}>
        <div style={{
          width: '100%', height: '100%',
          background: '#fff',
          boxShadow: '0 6px 24px rgba(0,0,0,.12), 0 1px 3px rgba(0,0,0,.08)',
          overflow: 'hidden',
        }}>
          <NakladnayaDocument scale={1} fillData />
        </div>
      </div>

      {/* page indicator */}
      <div style={{
        position: 'absolute', top: 64, right: 16,
        background: sketchTokens.ink, color: '#fff',
        padding: '4px 10px', borderRadius: 999,
        fontFamily: MONO_FONT, fontSize: 10, fontWeight: 600,
      }}>1 / 1 · 100%</div>

      {/* bottom action bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '12px 14px 26px',
        background: '#fff',
        borderTop: `1px solid ${sketchTokens.border}`,
        display: 'flex', gap: 8,
      }}>
        <SPill big ghost style={{flex: 1, justifyContent: 'center'}}>⤓ PDF</SPill>
        <SPill big ghost style={{flex: 1, justifyContent: 'center'}}>WhatsApp</SPill>
        <SPill big accent style={{flex: 1, justifyContent: 'center'}}>Печать</SPill>
      </div>
    </div>
  );
}

Object.assign(window, { HomeList, PreviewPDF, StatusChip });
