/* Approach A — Cards + Bottom Sheet (clean) */

function A_FormCards() {
  const items = [
    { n: '2920-1295 L-1', qty: 3, price: 1200, sum: 3600 },
    { n: '2920-1285 L2-3', qty: 6, price: 1150, sum: 6900 },
    { n: '3030-1255 L1-1', qty: 2, price: 1400, sum: 2800 },
    { n: '3030-1250 L1-3', qty: 6, price: null, sum: null },
  ];
  return (
    <div style={{height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', background: sketchTokens.paperDim}}>
      <ScreenHeader title="Новая накладная" left="✕" right="Сохр." />

      {/* segmented form/preview */}
      <div style={{padding: '12px 16px 8px', background: '#fff', borderBottom: `1px solid ${sketchTokens.border}`}}>
        <div style={{
          display: 'flex', background: sketchTokens.paperDim,
          borderRadius: 10, padding: 3,
          border: `1px solid ${sketchTokens.border}`,
        }}>
          <div style={{
            flex: 1, textAlign: 'center', padding: '8px 0',
            background: '#fff', borderRadius: 8,
            fontFamily: UI_FONT, fontWeight: 600, fontSize: 13,
            boxShadow: '0 1px 2px rgba(0,0,0,.05)',
          }}>Форма</div>
          <div style={{flex: 1, textAlign: 'center', padding: '8px 0', color: sketchTokens.pencil, fontFamily: UI_FONT, fontSize: 13, fontWeight: 500}}>Preview</div>
        </div>
      </div>

      {/* scroll */}
      <div style={{flex: 1, overflow: 'hidden', padding: '12px 14px 200px', display: 'flex', flexDirection: 'column', gap: 10}}>
        <SBox style={{padding: 14, display: 'flex', flexDirection: 'column', gap: 12}}>
          <div style={{display: 'flex', gap: 14}}>
            <SField label="№" value="1024" style={{width: 72}} />
            <SField label="Дата" value="20.05.2026" full />
          </div>
          <SField label="Получатель" value="ОсОО «Алтын-Курулуш»" />
          <div style={{display: 'flex', gap: 14}}>
            <SField label="Машина" value="01KG 480 ABC" full />
            <SField label="Водитель" value="Бек." full />
          </div>
        </SBox>

        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '6px 4px 2px'}}>
          <div style={{fontSize: 11, color: sketchTokens.pencil, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase'}}>Товары · {items.length}</div>
          <div style={{fontSize: 11, color: sketchTokens.pencil}}>свайп ← удалить</div>
        </div>

        {items.map((it, i) => (
          <SBox key={i} style={{
            padding: '12px 14px', display: 'flex', gap: 12, alignItems: 'center',
            background: i === 3 ? sketchTokens.accentTint : '#fff',
            borderColor: i === 3 ? sketchTokens.accent : sketchTokens.border,
          }}>
            <div style={{
              width: 26, height: 26, borderRadius: 6,
              background: sketchTokens.paperDim,
              display: 'grid', placeItems: 'center',
              fontFamily: MONO_FONT, fontSize: 11, fontWeight: 700,
            }}>{i+1}</div>
            <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 3}}>
              <div style={{fontFamily: MONO_FONT, fontSize: 13, fontWeight: 700}}>{it.n}</div>
              <div style={{display: 'flex', gap: 12, fontSize: 12, color: sketchTokens.pencil}}>
                <span>× {it.qty}</span>
                <span>{it.price ? `${it.price} c` : <span style={{color: sketchTokens.accent, fontWeight: 600}}>цена?</span>}</span>
              </div>
            </div>
            <div style={{fontFamily: MONO_FONT, fontSize: 14, fontWeight: 700}}>
              {it.sum != null ? it.sum : '—'}
            </div>
            <div style={{fontSize: 16, color: sketchTokens.pencil}}>›</div>
          </SBox>
        ))}

        <SBox dashed style={{
          padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          color: sketchTokens.pencil, fontSize: 13, fontWeight: 500, background: 'transparent',
        }}>
          + добавить товар
        </SBox>
      </div>

      {/* sticky totals bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '12px 16px 22px',
        background: '#fff',
        borderTop: `1px solid ${sketchTokens.border}`,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 2}}>
          <div style={{fontSize: 10, color: sketchTokens.pencil, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase'}}>Итого · 4 позиции</div>
          <div style={{fontFamily: MONO_FONT, fontSize: 22, fontWeight: 700}}>13 300 c</div>
        </div>
        <SPill big accent>Готово →</SPill>
      </div>

      <SFab style={{position: 'absolute', right: 18, bottom: 108}}>+</SFab>
    </div>
  );
}

function A_BottomSheet() {
  return (
    <div style={{height: '100%', position: 'relative', background: sketchTokens.paperDim}}>
      {/* dimmed background */}
      <div style={{position: 'absolute', inset: 0, opacity: 0.7}}>
        <ScreenHeader title="Новая накладная" left="✕" right="Сохр." />
        <div style={{padding: 14, opacity: 0.5}}>
          <SBox style={{height: 110}} />
          <div style={{height: 12}} />
          <SBox style={{height: 70}} />
          <div style={{height: 12}} />
          <SBox style={{height: 70}} />
        </div>
      </div>
      <div style={{position: 'absolute', inset: 0, background: 'rgba(10,10,10,.45)'}} />

      {/* sheet */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: '#fff',
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: '10px 18px 26px',
        display: 'flex', flexDirection: 'column', gap: 14,
        height: 560,
        boxShadow: '0 -10px 30px rgba(0,0,0,.18)',
      }}>
        <div style={{width: 40, height: 4, background: sketchTokens.pencilLight, borderRadius: 3, margin: '6px auto 4px'}} />
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{fontSize: 18, fontWeight: 700}}>Добавить товар</div>
          <div style={{fontSize: 14, color: sketchTokens.pencil}}>✕</div>
        </div>

        <SBox style={{padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10}}>
          <span style={{fontSize: 16, color: sketchTokens.pencil}}>⌕</span>
          <span style={{flex: 1, fontFamily: MONO_FONT, fontSize: 14, fontWeight: 700}}>
            3030-1250<span style={{borderLeft: `2px solid ${sketchTokens.accent}`, marginLeft: 2, height: 14, display: 'inline-block', verticalAlign: 'middle'}}></span>
          </span>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            border: `1px solid ${sketchTokens.border}`, display: 'grid', placeItems: 'center',
            fontSize: 14,
          }}>▢</div>
        </SBox>

        <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
          <div style={{fontSize: 11, color: sketchTokens.pencil, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase'}}>Найдено в справочнике</div>
          {[
            ['3030-1250 L1-3', '1380'],
            ['3030-1250 L1-1', '1400'],
            ['3030-1250 L2-2', '1410'],
          ].map((r, i) => (
            <SBox key={i} style={{
              padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: i === 0 ? sketchTokens.accentTint : '#fff',
              borderColor: i === 0 ? sketchTokens.accent : sketchTokens.border,
            }}>
              <span style={{fontFamily: MONO_FONT, fontSize: 13, fontWeight: 700}}>{r[0]}</span>
              <span style={{fontFamily: MONO_FONT, fontSize: 13, color: sketchTokens.inkSoft, fontWeight: 600}}>{r[1]} c</span>
            </SBox>
          ))}
        </div>

        <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
          <div style={{fontSize: 11, color: sketchTokens.pencil, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase'}}>Количество</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 14, justifyContent: 'center'}}>
            <div style={{width: 50, height: 50, borderRadius: 12, border: `1px solid ${sketchTokens.border}`, display: 'grid', placeItems: 'center', fontSize: 24, background: '#fff', fontWeight: 400}}>−</div>
            <div style={{fontFamily: MONO_FONT, fontSize: 36, fontWeight: 700, minWidth: 56, textAlign: 'center'}}>6</div>
            <div style={{width: 50, height: 50, borderRadius: 12, border: `1px solid ${sketchTokens.accent}`, color: sketchTokens.accent, display: 'grid', placeItems: 'center', fontSize: 24, background: sketchTokens.accentTint, fontWeight: 400}}>+</div>
          </div>
        </div>

        <div style={{marginTop: 'auto'}}>
          <SPill big accent style={{width: '100%', justifyContent: 'center', padding: '14px 0', fontSize: 16}}>
            Добавить · 8 280 c
          </SPill>
        </div>
      </div>
    </div>
  );
}

function A_PreviewToggle() {
  return (
    <div style={{height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', background: sketchTokens.paperDeep}}>
      <ScreenHeader title="Новая накладная" left="✕" right="Сохр." />
      <div style={{padding: '12px 16px 8px', background: '#fff', borderBottom: `1px solid ${sketchTokens.border}`}}>
        <div style={{display: 'flex', background: sketchTokens.paperDim, borderRadius: 10, padding: 3, border: `1px solid ${sketchTokens.border}`}}>
          <div style={{flex: 1, textAlign: 'center', padding: '8px 0', color: sketchTokens.pencil, fontFamily: UI_FONT, fontSize: 13, fontWeight: 500}}>Форма</div>
          <div style={{
            flex: 1, textAlign: 'center', padding: '8px 0',
            background: '#fff', borderRadius: 8,
            fontFamily: UI_FONT, fontWeight: 600, fontSize: 13,
            boxShadow: '0 1px 2px rgba(0,0,0,.05)',
          }}>Preview</div>
        </div>
      </div>
      <div style={{flex: 1, padding: '14px 16px 100px', overflow: 'hidden'}}>
        <div style={{
          width: '100%', height: '100%',
          background: '#fff',
          boxShadow: '0 4px 18px rgba(0,0,0,.08)',
          overflow: 'hidden',
        }}>
          <NakladnayaDocument scale={1} fillData />
        </div>
      </div>
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '12px 14px 22px',
        background: '#fff',
        borderTop: `1px solid ${sketchTokens.border}`,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <SPill big ghost>⤓</SPill>
        <SPill big ghost>↗</SPill>
        <SPill big accent style={{flex: 1, justifyContent: 'center'}}>Отправить</SPill>
      </div>
    </div>
  );
}

Object.assign(window, { A_FormCards, A_BottomSheet, A_PreviewToggle });
