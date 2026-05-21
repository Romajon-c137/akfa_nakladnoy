/* Approach C — Sticky Live Preview (clean) */

function C_SplitTable() {
  return (
    <div style={{height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', background: sketchTokens.paperDim}}>
      <ScreenHeader title="Накладная № 1024" left="‹" right="⤓" />

      {/* sticky preview top */}
      <div style={{
        height: 320,
        background: sketchTokens.paperDeep,
        borderBottom: `1px solid ${sketchTokens.border}`,
        position: 'relative',
        padding: '12px 16px 18px',
      }}>
        <div style={{
          width: '100%', height: '100%',
          background: '#fff',
          boxShadow: '0 4px 14px rgba(0,0,0,.08)',
          overflow: 'hidden',
        }}>
          <NakladnayaDocument scale={0.85} fillData />
        </div>
        <div style={{position: 'absolute', top: 18, right: 24, display: 'flex', gap: 6}}>
          <IconBtn>⤢</IconBtn>
          <IconBtn>↗</IconBtn>
        </div>
        {/* drag handle */}
        <div style={{
          position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)',
          width: 52, height: 16, background: '#fff', border: `1px solid ${sketchTokens.border}`,
          borderRadius: 10, display: 'grid', placeItems: 'center', zIndex: 2,
          boxShadow: '0 1px 4px rgba(0,0,0,.06)',
        }}>
          <div style={{width: 22, height: 2.5, background: sketchTokens.pencil, borderRadius: 2}} />
        </div>
      </div>

      {/* form area */}
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#fff'}}>
        <div style={{padding: '12px 14px 0', display: 'flex', gap: 18, borderBottom: `1px solid ${sketchTokens.border}`}}>
          <TabHead label="Шапка" />
          <TabHead label="Товары · 8" active />
          <TabHead label="Подпись" />
        </div>
        <div style={{flex: 1, overflow: 'hidden'}}>
          <div style={{display: 'flex', padding: '10px 0', borderBottom: `1px solid ${sketchTokens.border}`, fontSize: 11, color: sketchTokens.pencil, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase'}}>
            <div style={{width: 28, paddingLeft: 14}}>№</div>
            <div style={{width: 130, paddingLeft: 4}}>наимен.</div>
            <div style={{width: 50, textAlign: 'right'}}>кол</div>
            <div style={{width: 66, textAlign: 'right'}}>цена</div>
            <div style={{width: 76, textAlign: 'right', paddingRight: 14}}>сумма</div>
          </div>
          <div style={{position: 'relative'}}>
            {[
              ['1','2920-1295 L-1','3','1200','3600'],
              ['2','2920-1285 L2-3','6','1150','6900'],
              ['3','3030-1255 L1-1','2','1400','2800'],
              ['4','3030-1250 L1-3','6','1380','8280'],
              ['5','2920-1285 L2-1','2','1150','2300'],
              ['6','2920-1300 L2','1','1180','1180'],
            ].map((r, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', padding: '10px 0',
                borderBottom: `1px solid ${sketchTokens.border}`,
                background: i === 3 ? sketchTokens.accentTint : '#fff',
              }}>
                <div style={{width: 28, paddingLeft: 14, fontFamily: MONO_FONT, fontSize: 11, fontWeight: 600, color: sketchTokens.pencil}}>{r[0]}</div>
                <div style={{width: 130, paddingLeft: 4, fontFamily: MONO_FONT, fontSize: 13, fontWeight: 700}}>{r[1]}</div>
                <div style={{width: 50, textAlign: 'right', fontFamily: MONO_FONT, fontSize: 13}}>{r[2]}</div>
                <div style={{width: 66, textAlign: 'right', fontFamily: MONO_FONT, fontSize: 13}}>{r[3]}</div>
                <div style={{width: 76, textAlign: 'right', paddingRight: 14, fontFamily: MONO_FONT, fontSize: 13, fontWeight: 700}}>{r[4]}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{
          padding: '12px 14px 22px',
          borderTop: `1px solid ${sketchTokens.border}`,
          background: '#fff',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <SFab style={{width: 42, height: 42, borderRadius: 10, fontSize: 20}}>+</SFab>
          <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 2}}>
            <div style={{fontSize: 10, color: sketchTokens.pencil, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase'}}>Итого</div>
            <div style={{fontFamily: MONO_FONT, fontSize: 18, fontWeight: 700}}>29 130 c</div>
          </div>
          <SPill big accent>Готово</SPill>
        </div>
      </div>
    </div>
  );
}

function C_PreviewZoom() {
  return (
    <div style={{height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', background: sketchTokens.paperDeep}}>
      <ScreenHeader title="Накладная № 1024" left="‹" right="⤓" />
      <div style={{flex: 1, position: 'relative', overflow: 'hidden', padding: 20}}>
        <div style={{
          width: '100%', height: '100%',
          background: '#fff',
          boxShadow: '0 8px 28px rgba(0,0,0,.15)',
          overflow: 'hidden',
          transform: 'scale(1.15)',
          transformOrigin: 'center center',
        }}>
          <NakladnayaDocument scale={1.0} fillData />
        </div>
        <div style={{
          position: 'absolute', bottom: 90, left: '50%', transform: 'translateX(-50%)',
          background: sketchTokens.ink, color: '#fff',
          padding: '5px 12px', borderRadius: 999,
          fontFamily: MONO_FONT, fontSize: 11, fontWeight: 600,
        }}>1 / 1 · 150%</div>
      </div>
      <div style={{
        padding: '12px 12px 22px',
        background: '#fff',
        borderTop: `1px solid ${sketchTokens.border}`,
        display: 'flex', gap: 8,
      }}>
        <ActionTile label="PDF" icon="⤓" />
        <ActionTile label="Печать" icon="🖨" />
        <ActionTile label="Share" icon="↗" />
        <ActionTile label="Подпись" icon="✎" accent />
      </div>
    </div>
  );
}

function C_SplitForm() {
  return (
    <div style={{height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', background: sketchTokens.paperDim}}>
      <ScreenHeader title="Накладная № 1024" left="‹" right="⤓" />
      <div style={{
        height: 320, background: sketchTokens.paperDeep,
        borderBottom: `1px solid ${sketchTokens.border}`,
        position: 'relative', padding: '12px 16px 18px',
      }}>
        <div style={{
          width: '100%', height: '100%',
          background: '#fff',
          boxShadow: '0 4px 14px rgba(0,0,0,.08)',
          overflow: 'hidden',
        }}>
          <NakladnayaDocument scale={0.85} fillData highlightHeader />
        </div>
        <div style={{position: 'absolute', top: 18, right: 24, display: 'flex', gap: 6}}>
          <IconBtn>⤢</IconBtn>
          <IconBtn>↗</IconBtn>
        </div>
      </div>
      <div style={{flex: 1, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12, overflow: 'hidden', background: '#fff'}}>
        <div style={{display: 'flex', gap: 18, borderBottom: `1px solid ${sketchTokens.border}`, padding: '0 0 0'}}>
          <TabHead label="Шапка" active />
          <TabHead label="Товары · 8" />
          <TabHead label="Подпись" />
        </div>
        <SBox style={{padding: 14, display: 'flex', flexDirection: 'column', gap: 12}}>
          <div style={{display: 'flex', gap: 14}}>
            <SField label="№" value="1024" full />
            <SField label="Дата" value="20.05.2026" full />
          </div>
          <SField label="Получатель" value="ОсОО «Алтын-Курулуш»" />
          <SField label="Адрес доставки" value="Бишкек, ул. Ибраимова 115" />
          <div style={{display: 'flex', gap: 14}}>
            <SField label="Машина" value="01KG 480 ABC" full />
            <SField label="Водитель" value="Бек." full />
          </div>
        </SBox>
        <div style={{
          marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 12px',
          background: sketchTokens.paperDim,
          border: `1px solid ${sketchTokens.border}`,
          borderRadius: 8,
          fontSize: 12, color: sketchTokens.inkSoft,
        }}>
          <span style={{width: 6, height: 6, borderRadius: 3, background: sketchTokens.accent}} />
          <span>авто-сохранено · 2 сек назад</span>
        </div>
      </div>
    </div>
  );
}

function IconBtn({ children }) {
  return (
    <div style={{
      width: 28, height: 28, borderRadius: 7,
      background: '#fff',
      border: `1px solid ${sketchTokens.border}`,
      display: 'grid', placeItems: 'center',
      fontSize: 13,
      boxShadow: '0 1px 3px rgba(0,0,0,.06)',
    }}>{children}</div>
  );
}

function TabHead({ label, active }) {
  return (
    <div style={{
      padding: '10px 0',
      fontFamily: UI_FONT,
      fontSize: 13,
      fontWeight: active ? 700 : 500,
      color: active ? sketchTokens.ink : sketchTokens.pencil,
      borderBottom: active ? `2px solid ${sketchTokens.accent}` : '2px solid transparent',
      marginBottom: -1,
    }}>{label}</div>
  );
}

function ActionTile({ label, icon, accent }) {
  return (
    <div style={{
      flex: 1, padding: '12px 0',
      borderRadius: 12,
      border: `1px solid ${accent ? sketchTokens.accent : sketchTokens.border}`,
      background: accent ? sketchTokens.accent : '#fff',
      color: accent ? '#fff' : sketchTokens.ink,
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
      fontFamily: UI_FONT,
    }}>
      <div style={{fontSize: 18, lineHeight: 1}}>{icon}</div>
      <div style={{fontSize: 12, fontWeight: 600}}>{label}</div>
    </div>
  );
}

// keep export compat
const MiniDocPreview = (props) => (
  <div style={{width: '100%', height: '100%', background: '#fff'}}>
    <NakladnayaDocument scale={0.7} fillData {...props} />
  </div>
);

Object.assign(window, { C_SplitTable, C_PreviewZoom, C_SplitForm, MiniDocPreview, TabHead, ActionTile, IconBtn });
