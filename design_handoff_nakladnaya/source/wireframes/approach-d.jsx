/* Approach D — Wizard / Stepper (clean) */

function D_Step1() {
  return (
    <div style={{height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', background: sketchTokens.paperDim}}>
      <StepHeader step={1} label="Кому и куда" />
      <div style={{flex: 1, padding: '14px 16px 100px', display: 'flex', flexDirection: 'column', gap: 12, overflow: 'hidden'}}>
        <div style={{display: 'flex', gap: 10}}>
          <SBox style={{flex: 1, padding: '12px 14px'}}>
            <div style={{fontSize: 10, color: sketchTokens.pencil, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase'}}>№</div>
            <div style={{fontFamily: MONO_FONT, fontSize: 22, fontWeight: 700, marginTop: 2}}>1024</div>
          </SBox>
          <SBox style={{flex: 1.4, padding: '12px 14px'}}>
            <div style={{fontSize: 10, color: sketchTokens.pencil, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase'}}>Дата</div>
            <div style={{fontFamily: MONO_FONT, fontSize: 17, fontWeight: 600, marginTop: 4}}>20.05.2026</div>
          </SBox>
        </div>

        <SBox style={{padding: 14, display: 'flex', flexDirection: 'column', gap: 10}}>
          <div style={{fontSize: 10, color: sketchTokens.pencil, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase'}}>Получатель</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
            <div style={{
              width: 42, height: 42, borderRadius: 10,
              background: sketchTokens.ink, color: '#fff',
              display: 'grid', placeItems: 'center',
              fontFamily: UI_FONT, fontSize: 18, fontWeight: 700,
            }}>А</div>
            <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 2}}>
              <div style={{fontSize: 15, fontWeight: 600}}>ОсОО «Алтын-Курулуш»</div>
              <div style={{fontSize: 11, color: sketchTokens.pencil, fontFamily: MONO_FONT}}>ИНН 02208201410025</div>
            </div>
            <div style={{fontSize: 16, color: sketchTokens.pencil}}>›</div>
          </div>
        </SBox>

        <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
          <div style={{fontSize: 10, color: sketchTokens.pencil, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase', paddingLeft: 4}}>Недавние</div>
          <div style={{display: 'flex', gap: 6, overflowX: 'auto'}}>
            {['СтройПлюс', 'ИП Бек.', 'Окна 24', '+ новый'].map((n, i) => (
              <SPill key={i} ghost style={{whiteSpace: 'nowrap', fontSize: 12}}>{n}</SPill>
            ))}
          </div>
        </div>

        <SBox style={{padding: 14, display: 'flex', flexDirection: 'column', gap: 10}}>
          <div style={{fontSize: 10, color: sketchTokens.pencil, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase'}}>Доставка</div>
          <SField label="Адрес" value="Бишкек, ул. Ибраимова 115" />
          <div style={{display: 'flex', gap: 14}}>
            <SField label="Машина" value="01KG 480 ABC" full />
            <SField label="Водитель" value="Бек." full />
          </div>
        </SBox>
      </div>
      <StepFooter step={1} nextLabel="Товары →" />
    </div>
  );
}

function D_Step2() {
  const items = [
    { n: '2920-1295 L-1', qty: 3, price: 1200 },
    { n: '2920-1285 L2-3', qty: 6, price: 1150 },
    { n: '3030-1255 L1-1', qty: 2, price: 1400 },
    { n: '3030-1250 L1-3', qty: 6, price: 1380 },
    { n: '2920-1285 L2-1', qty: 2, price: 1150 },
  ];
  return (
    <div style={{height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', background: sketchTokens.paperDim}}>
      <StepHeader step={2} label="Товары · 5" />
      <div style={{flex: 1, padding: '10px 14px 100px', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 8}}>
        {items.map((it, i) => (
          <div key={i} style={{
            background: '#fff',
            border: `1px solid ${sketchTokens.border}`,
            borderRadius: 12,
            padding: '10px 12px',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 7,
              background: sketchTokens.paperDim,
              display: 'grid', placeItems: 'center',
              fontFamily: MONO_FONT, fontSize: 12, fontWeight: 700,
            }}>{i+1}</div>
            <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
              <div style={{fontFamily: MONO_FONT, fontSize: 13, fontWeight: 700}}>{it.n}</div>
              <div style={{fontSize: 11, color: sketchTokens.pencil}}>
                {it.qty} шт × {it.price} c
              </div>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 4}}>
              <div style={{width: 28, height: 28, borderRadius: 7, border: `1px solid ${sketchTokens.border}`, display: 'grid', placeItems: 'center', fontSize: 16}}>−</div>
              <div style={{fontFamily: MONO_FONT, fontSize: 14, fontWeight: 700, minWidth: 22, textAlign: 'center'}}>{it.qty}</div>
              <div style={{width: 28, height: 28, borderRadius: 7, border: `1px solid ${sketchTokens.accent}`, background: sketchTokens.accentTint, color: sketchTokens.accent, display: 'grid', placeItems: 'center', fontSize: 16}}>+</div>
            </div>
          </div>
        ))}
        <SBox dashed style={{
          padding: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          background: 'transparent',
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: sketchTokens.accent, color: '#fff',
            display: 'grid', placeItems: 'center', fontSize: 18,
          }}>+</div>
          <span style={{fontSize: 13, color: sketchTokens.inkSoft, fontWeight: 500}}>добавить товар</span>
        </SBox>
      </div>
      <StepFooter step={2} nextLabel="Подпись →" totals="21 880 c" />
    </div>
  );
}

function D_Step3() {
  return (
    <div style={{height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', background: sketchTokens.paperDim}}>
      <StepHeader step={3} label="Подпись и отправка" />
      <div style={{flex: 1, padding: '14px 16px 100px', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 12}}>
        <SBox style={{padding: 14, display: 'flex', flexDirection: 'column', gap: 8}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <span style={{fontSize: 11, color: sketchTokens.pencil, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase'}}>Передал</span>
            <SPill ghost style={{fontSize: 11, padding: '4px 9px'}}>очистить</SPill>
          </div>
          <div style={{
            height: 70, borderRadius: 8,
            border: `1px dashed ${sketchTokens.border}`,
            background: sketchTokens.paperDim,
            position: 'relative',
          }}>
            <svg viewBox="0 0 280 70" style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}>
              <path d="M30 50 Q 40 22, 60 40 T 100 30 Q 130 14, 160 35 T 220 25" fill="none" stroke={sketchTokens.ink} strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <div style={{fontSize: 12, color: sketchTokens.inkSoft, fontWeight: 500}}>Тилек К.</div>
        </SBox>

        <SBox style={{padding: 14, display: 'flex', flexDirection: 'column', gap: 8}}>
          <span style={{fontSize: 11, color: sketchTokens.pencil, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase'}}>Получил</span>
          <div style={{
            height: 70, borderRadius: 8,
            border: `1px dashed ${sketchTokens.border}`,
            background: sketchTokens.paperDim,
            display: 'grid', placeItems: 'center',
            color: sketchTokens.pencil, fontSize: 13, fontWeight: 500,
          }}>распишитесь здесь ✎</div>
          <SField label="Имя" value="" />
        </SBox>

        <div style={{
          background: sketchTokens.ink, color: '#fff',
          borderRadius: 14, padding: '14px 16px',
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <span style={{fontSize: 12, opacity: 0.7, fontFamily: MONO_FONT}}>№ 1024</span>
            <span style={{fontSize: 12, opacity: 0.7}}>5 позиций</span>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 4}}>
            <span style={{fontSize: 13, opacity: 0.8}}>Итого к оплате</span>
            <span style={{fontFamily: MONO_FONT, fontSize: 24, fontWeight: 700, color: sketchTokens.accent}}>21 880 c</span>
          </div>
        </div>
      </div>
      <StepFooter step={3} nextLabel="✓ Отправить" finalStep />
    </div>
  );
}

function StepHeader({ step, label }) {
  return (
    <div style={{
      padding: '8px 16px 14px',
      background: '#fff',
      borderBottom: `1px solid ${sketchTokens.border}`,
      display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div style={{fontSize: 22, fontFamily: UI_FONT, color: sketchTokens.ink}}>‹</div>
        <div style={{fontFamily: UI_FONT, fontSize: 14, fontWeight: 700}}>
          <span style={{color: sketchTokens.pencil}}>Шаг {step}/3</span>
          <span style={{color: sketchTokens.ink, marginLeft: 8}}>· {label}</span>
        </div>
        <div style={{width: 22}} />
      </div>
      <div style={{display: 'flex', gap: 4}}>
        {[1,2,3].map(n => (
          <div key={n} style={{
            flex: n === step ? 2 : 1,
            height: 4,
            borderRadius: 2,
            background: n <= step ? sketchTokens.accent : sketchTokens.pencilLight,
          }} />
        ))}
      </div>
    </div>
  );
}

function StepFooter({ step, nextLabel, totals, finalStep }) {
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      padding: '12px 16px 22px',
      background: '#fff',
      borderTop: `1px solid ${sketchTokens.border}`,
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      {step > 1 && (
        <SPill big ghost style={{padding: '14px 18px'}}>←</SPill>
      )}
      {totals ? (
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 2}}>
          <div style={{fontSize: 10, color: sketchTokens.pencil, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase'}}>Итого</div>
          <div style={{fontFamily: MONO_FONT, fontSize: 18, fontWeight: 700}}>{totals}</div>
        </div>
      ) : step === 1 ? <div style={{flex: 1}} /> : null}
      <SPill big accent style={{padding: '14px 20px', fontSize: 15, ...(finalStep ? {flex: 1, justifyContent: 'center'} : {})}}>{nextLabel}</SPill>
    </div>
  );
}

Object.assign(window, { D_Step1, D_Step2, D_Step3, StepHeader, StepFooter });
