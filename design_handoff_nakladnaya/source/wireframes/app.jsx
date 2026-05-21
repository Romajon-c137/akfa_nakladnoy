/* Main canvas app — composes wireframes into sections */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "showAnnotations": true,
  "accent": "#EE3626"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // apply tweaks via CSS var
  React.useEffect(() => {
    document.documentElement.style.setProperty('--accent', t.accent);
  }, [t.accent]);

  const ABW = 440;
  const ABH = 980;

  const annot = (s) => t.showAnnotations ? s : undefined;

  return (
    <>
      <DesignCanvas>
        <DCSection id="intro" title="Накладная · mobile wireframes" subtitle="4 разных подхода к созданию накладной с телефона. Перетаскивай артборды, переименовывай, открывай в фокусе.">
          <DCArtboard id="legend" label="Легенда" width={420} height={520} style={{padding: 18}}>
            <Legend />
          </DCArtboard>
          <DCArtboard id="home" label="Главная (общая)" width={ABW} height={ABH} style={{padding: 12}}>
            <SketchPhone title="Главная · список" annotate={annot('FAB → создание · фильтры по статусу · поиск по № и клиенту')}>
              <HomeList />
            </SketchPhone>
          </DCArtboard>
          <DCArtboard id="preview" label="Preview / экспорт (общая)" width={ABW} height={ABH} style={{padding: 12}}>
            <SketchPhone title="Preview · PDF" annotate={annot('pinch-to-zoom · share в WhatsApp · печать · сохранить PDF')}>
              <PreviewPDF />
            </SketchPhone>
          </DCArtboard>
        </DCSection>

        <DCSection id="approach-a" title="A · Карточки + Bottom Sheet" subtitle="Классический mobile pattern. Вертикальный скролл, товары карточками, FAB открывает sheet для добавления. Toggle Форма ↔ Preview.">
          <DCArtboard id="a1" label="A1 · Форма" width={ABW} height={ABH} style={{padding: 12}}>
            <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'center'}}>
              <SketchPhone title="A1 · Форма с карточками" annotate={annot('toggle вверху · карточки товаров · sticky totals + готово · FAB добавляет')}>
              <A_FormCards />
            </SketchPhone>
            </div>
          </DCArtboard>
          <DCArtboard id="a2" label="A2 · Bottom sheet" width={ABW} height={ABH} style={{padding: 12}}>
            <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'center'}}>
              <SketchPhone title="A2 · Добавление товара" annotate={annot('70% высоты экрана · автокомплит · степпер кол-ва · большая кнопка добавить')}>
              <A_BottomSheet />
            </SketchPhone>
            </div>
          </DCArtboard>
          <DCArtboard id="a3" label="A3 · Preview tab" width={ABW} height={ABH} style={{padding: 12}}>
            <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'center'}}>
              <SketchPhone title="A3 · Preview tab" annotate={annot('тот же экран, переключение вкладки → realtime preview')}>
              <A_PreviewToggle />
            </SketchPhone>
            </div>
          </DCArtboard>
        </DCSection>

        <DCSection id="approach-b" title="B · Quick Entry Bar" subtitle="Speed-first. Sticky нижний бар (код · кол-во · enter). Товары растут вверх как чат. Минимум тапов на товар — буквально 3 действия.">
          <DCArtboard id="b1" label="B1 · Старт" width={ABW} height={ABH} style={{padding: 12}}>
            <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'center'}}>
              <SketchPhone title="B1 · Старт · пустой стейт" annotate={annot('фокус сразу на инпуте · клавиатура уже открыта · подсказки внизу')}>
              <B_QuickEmpty />
            </SketchPhone>
            </div>
          </DCArtboard>
          <DCArtboard id="b2" label="B2 · Ввод" width={ABW} height={ABH} style={{padding: 12}}>
            <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'center'}}>
              <SketchPhone title="B2 · Ввод + автокомплит" annotate={annot('подсказки появляются над баром · цена подтягивается из справочника · ⏎ добавляет')}>
              <B_QuickTyping />
            </SketchPhone>
            </div>
          </DCArtboard>
          <DCArtboard id="b3" label="B3 · Заполнено" width={ABW} height={ABH} style={{padding: 12}}>
            <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'center'}}>
              <SketchPhone title="B3 · 8 позиций за 30 сек" annotate={annot('товары как чат-сообщения · swipe ← удалить · бар всегда внизу')}>
              <B_QuickFull />
            </SketchPhone>
            </div>
          </DCArtboard>
        </DCSection>

        <DCSection id="approach-c" title="C · Sticky Live Preview" subtitle="Документ-вьюер сверху, форма снизу. Видишь итоговый PDF прямо во время заполнения. Тап по полю в preview → фокус в форме. Drag-handle меняет пропорции.">
          <DCArtboard id="c1" label="C1 · Split · товары" width={ABW} height={ABH} style={{padding: 12}}>
            <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'center'}}>
              <SketchPhone title="C1 · Live preview + таблица" annotate={annot('40/60 split · realtime sync · горизонтальный smart-scroll таблица')}>
              <C_SplitTable />
            </SketchPhone>
            </div>
          </DCArtboard>
          <DCArtboard id="c2" label="C2 · Split · шапка" width={ABW} height={ABH} style={{padding: 12}}>
            <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'center'}}>
              <SketchPhone title="C2 · Тап → редактирование" annotate={annot('желтый highlight = текущий раздел в preview · auto-save между')}>
              <C_SplitForm />
            </SketchPhone>
            </div>
          </DCArtboard>
          <DCArtboard id="c3" label="C3 · Fullscreen zoom" width={ABW} height={ABH} style={{padding: 12}}>
            <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'center'}}>
              <SketchPhone title="C3 · Pinch-to-zoom" annotate={annot('двойной тап на preview · fullscreen документ-вьюер · pinch zoom до 200%')}>
              <C_PreviewZoom />
            </SketchPhone>
            </div>
          </DCArtboard>
        </DCSection>

        <DCSection id="approach-d" title="D · Wizard / Stepper" subtitle="Три шага: кому → товары → подпись. Swipe между шагами. Меньше скролла на экран, больше hit-зон. Хорошо для новых пользователей и одной руки.">
          <DCArtboard id="d1" label="D1 · Шаг 1 · Кому" width={ABW} height={ABH} style={{padding: 12}}>
            <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'center'}}>
              <SketchPhone title="D1 · Шаг 1 · Кому и куда" annotate={annot('крупные карточки · недавние клиенты chips · ИНН подтягивается')}>
              <D_Step1 />
            </SketchPhone>
            </div>
          </DCArtboard>
          <DCArtboard id="d2" label="D2 · Шаг 2 · Товары" width={ABW} height={ABH} style={{padding: 12}}>
            <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'center'}}>
              <SketchPhone title="D2 · Шаг 2 · Товары" annotate={annot('inline степпер кол-ва · добавление как dashed card · swipe → шаг 3')}>
              <D_Step2 />
            </SketchPhone>
            </div>
          </DCArtboard>
          <DCArtboard id="d3" label="D3 · Шаг 3 · Подпись" width={ABW} height={ABH} style={{padding: 12}}>
            <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'center'}}>
              <SketchPhone title="D3 · Шаг 3 · Подпись" annotate={annot('touch signature pad · черная summary-карточка · одна кнопка отправить')}>
              <D_Step3 />
            </SketchPhone>
            </div>
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      {/* tweaks panel */}
      <TweaksPanel title="Tweaks">
        <TweakSection label="Подача">
          <TweakToggle
            label="Показывать пометки"
            value={t.showAnnotations}
            onChange={(v) => setTweak('showAnnotations', v)}
          />
        </TweakSection>
        <TweakSection label="Акцент">
          <TweakColor
            label="Цвет акцента"
            value={t.accent}
            options={['#EE3626', '#0a0a0a', '#2a6fdb', '#1f8a5b']}
            onChange={(v) => setTweak('accent', v)}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

function Legend() {
  return (
    <div style={{
      width: '100%', height: '100%',
      padding: 24,
      background: '#fff',
      border: `1px solid ${sketchTokens.border}`,
      borderRadius: 14,
      fontFamily: UI_FONT,
      color: sketchTokens.ink,
      display: 'flex', flexDirection: 'column', gap: 14,
      boxShadow: '0 1px 3px rgba(0,0,0,.04)',
    }}>
      <div style={{fontSize: 11, color: sketchTokens.pencil, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase'}}>Wireframes · v1</div>
      <div style={{fontSize: 22, fontWeight: 700, letterSpacing: -0.3, lineHeight: 1.15}}>
        Mobile накладная<br />— 4 подхода
      </div>
      <div style={{height: 0, borderTop: `1px solid ${sketchTokens.border}`, marginTop: 4}} />
      <LegendRow swatch={<div style={{width: 26, height: 18, border: `1px solid ${sketchTokens.border}`, borderRadius: 4, background: '#fff'}} />} label="Карточка / контейнер" />
      <LegendRow swatch={<div style={{width: 26, height: 18, border: `1px dashed ${sketchTokens.border}`, borderRadius: 4}} />} label="Пустое состояние · placeholder" />
      <LegendRow swatch={<div style={{width: 26, height: 18, background: sketchTokens.accentTint, border: `1px solid ${sketchTokens.accent}`, borderRadius: 4}} />} label="Текущий / выбранный элемент" />
      <LegendRow swatch={<div style={{padding: '3px 9px', borderRadius: 999, background: sketchTokens.accent, color: '#fff', fontSize: 10, fontWeight: 600}}>btn</div>} label="Акцентная кнопка · #EE3626" />
      <LegendRow swatch={<div style={{padding: '3px 9px', borderRadius: 999, border: `1px solid ${sketchTokens.border}`, fontSize: 10, fontWeight: 600, background: '#fff'}}>pill</div>} label="Кнопка / chip" />
      <LegendRow swatch={<div style={{width: 22, height: 22, borderRadius: 999, background: sketchTokens.accent, color: '#fff', fontSize: 16, display: 'grid', placeItems: 'center', fontWeight: 400, boxShadow: '0 4px 12px rgba(238,54,38,.35)'}}>+</div>} label="FAB · floating action" />
      <div style={{height: 0, borderTop: `1px solid ${sketchTokens.border}`, marginTop: 4}} />
      <div style={{fontSize: 12, lineHeight: 1.5, color: sketchTokens.inkSoft}}>
        Все экраны iPhone 390 × 844. Документ накладной в превью точно повторяет загруженный шаблон Glass Center: шапка, поля
        «Дата», «НАКЛАДНАЯ №», таблица товаров, строки «Машина / Водитель / Передал / Получил».
      </div>
      <div style={{fontSize: 12, lineHeight: 1.5, color: sketchTokens.pencil}}>
        Открой артборд во fullscreen (иконка в углу карточки) для деталей.
      </div>
    </div>
  );
}

function LegendRow({ swatch, label }) {
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
      <div style={{width: 32, display: 'grid', placeItems: 'center'}}>{swatch}</div>
      <div style={{fontSize: 13, color: sketchTokens.ink, fontWeight: 500}}>{label}</div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
