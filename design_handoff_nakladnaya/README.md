# Handoff: Накладная — mobile-first платформа

## Overview

Это мобильная платформа для быстрого создания накладных (delivery notes / waybills) с телефона. Основной use case: пользователь стекольного центра «Glass Center» выписывает накладную клиенту прямо со склада — минимум тапов, ввод в одно касание, итоговый документ строго соответствует загруженному Word-шаблону компании.

В этом бандле лежат **4 разных UX-подхода × 3 ключевых экрана** = 12 мобильных экранов + 3 общих (главная, превью документа, легенда). На этапе hand-off нужно либо выбрать один подход, либо обсудить с дизайнером гибрид. README описывает все четыре, чтобы можно было защитить решение.

## About the Design Files

Файлы в папке `source/` — **дизайн-референсы**, сделанные как HTML+React-прототипы для быстрой итерации. Это **не production-код для копирования напрямую**. Задача: пересоздать эти экраны в боевом окружении проекта (React Native / Flutter / SwiftUI / Jetpack Compose / nativeweb — что используется), следуя существующим компонентам, дизайн-системе и навигации.

Если окружения ещё нет — рекомендуется React Native или Flutter, потому что приоритет жёсткий mobile-first (см. ниже).

## Fidelity

**Средняя фидельность (med-fi).** Не пиксель-перфект, но:
- Цвета, типографика, spacing **финальные** — следуй им строго.
- Документ накладной (превью) — **pixel-perfect к загруженному `source/uploads/nakladnaya.docx`**. Структура, поля и порядок колонок не меняются.
- Иконки даны как Unicode-плейсхолдеры (▤, ⌕, ↗, ⤓, ↵, ›, ✎ и т. п.) — заменяй на иконки из своего набора (SF Symbols, Material Symbols, Lucide и т. п.). Семантика подписана ниже.
- Конкретные товарные коды, имена клиентов, ИНН — иллюстрация. В проде идут из БД.

## Critical Constraint: Mobile-first, strictly

Платформа проектируется **строго mobile-first**. **Не делать desktop с адаптацией.** Главный приоритет — идеальный UX на смартфоне. UI должен ощущаться как современное мобильное приложение: ultra smooth, одной рукой, минимум лишних действий, максимум читаемости.

Ключевые паттерны, которые **обязательно** должны быть на мобиле:
- Вертикальный flow, sticky preview, bottom sheets
- Floating action buttons (FAB), swipe gestures
- Fullscreen edit mode для таблицы товаров
- Большие tap-зоны (минимум 44×44 pt)
- Realtime preview документа, pinch-to-zoom
- Bottom navigation, быстрый доступ к последним накладным
- Карточный режим для таблицы товаров (НЕ desktop-таблица)

## Design Tokens

### Colors

| Token | Hex | Использование |
|---|---|---|
| `--ink` | `#0a0a0a` | основной текст, иконки, рамки активных элементов |
| `--ink-soft` | `#3a3a3a` | вторичный текст |
| `--pencil` | `#8a8a8a` | подписи, плейсхолдеры, метаданные |
| `--pencil-light` | `#d6d6d6` | разделители, неактивные точки прогресса |
| `--border` | `#d6d6d6` | границы карточек, инпутов |
| `--paper` | `#ffffff` | фон карточек и поверхностей |
| `--paper-dim` | `#f5f6f7` | фон под карточками (страница) |
| `--paper-deep` | `#eceef0` | фон под документом-превью |
| `--accent` | `#EE3626` | **главный акцент** — FAB, primary CTA, highlight активного, focus border |
| `--accent-tint` | `#fff5f3` | очень светлый фон акцентных карточек |
| `--accent-soft` | `#fde6e3` | подсветка совпадений в автокомплите |

Только два «брендовых» цвета: **чёрный + #EE3626**. Никаких посторонних цветов (без зелёного «success», синего «info» и т.п. — статусы решаются через border + иконку + текст).

### Typography

- **UI font**: `Inter` (weights 400, 500, 600, 700, 800). Fallback: `-apple-system, BlinkMacSystemFont, "Helvetica Neue", system-ui, sans-serif`.
- **Tabular / mono font**: `SF Mono` (fallback `Menlo`, `Consolas`, `Roboto Mono`, `monospace`). Используется для **артикулов товаров, номеров накладных, цен и сумм**. Везде, где важно выравнивание цифр — mono.

Шкала:

| Использование | Size | Weight | Letter-spacing | Notes |
|---|---|---|---|---|
| Page title (Главная: «Накладные») | 28 | 700 | -0.4 | |
| Section / sheet title | 18 | 700 | 0 | |
| Screen header title | 16 | 600 | 0 | по центру header'а |
| Body text | 14–15 | 500 | 0 | |
| Field value (input value) | 15 | 500 | 0 | |
| Item code (артикул, mono) | 13 | 700 | 0 | SF Mono |
| Total amount (mono) | 18–24 | 700 | 0 | SF Mono |
| Metadata / chips text | 11–12 | 500–600 | 0 | |
| Label "uppercase" (например «ИТОГО») | 10–11 | 600 | 0.4 | `text-transform: uppercase` |
| Button text | 13–15 | 600 | 0 | |
| Bottom nav label | 10 | 500 | 0.2 | |

### Spacing & geometry

- Border radius: `10px` (chips, маленькие кнопки), `12px` (карточки, инпуты), `14px` (большие кнопки), `999px` (pills, FAB, статус-чипы).
- Phone screen padding (от края экрана): `14–18px`.
- Между карточками в списке: `8–10px`.
- Внутри карточки: `12–14px`.
- FAB размер: `56×56`, offset от края: `right: 18px, bottom: 92px` (над bottom-nav).
- Bottom nav высота: `72px` (включая `padding-bottom: 14px` под home indicator).
- Тач-таргеты: всё интерактивное — минимум `44×44pt`.

### Shadows

Минималистично, без дешёвых «материал»-теней:

- Карточки в списке: только border, без shadow.
- FAB: `0 8px 24px rgba(238,54,38,.35), 0 2px 6px rgba(0,0,0,.08)` (мягкий цветной glow).
- Bottom sheet (когда поднят): `0 -10px 30px rgba(0,0,0,.18)`.
- Документ превью: `0 6px 24px rgba(0,0,0,.12), 0 1px 3px rgba(0,0,0,.08)`.
- Сегментированный toggle (активный сегмент): `0 1px 2px rgba(0,0,0,.05)`.

### Phone frame

Все экраны проектируются под `390 × 844 pt` (iPhone 14/15 регулярный). Status bar `50pt`, home indicator занимает нижние `~14pt`. Все нижние bottom-bar'ы учитывают safe-area (padding-bottom `22–26px`).

## Screens / Views

### 0. Document Preview (ГЛАВНЫЙ КОНТРАКТ — match docx)

Самый важный экран — **документ накладной в превью**. Он встречается на нескольких экранах (сплит-превью, fullscreen, перед отправкой). **Должен совпадать с `source/uploads/nakladnaya.docx`** по структуре:

```
┌─────────────────────────────────────────────┐
│ [GC]  Glass Center                    723899│
│       тел.: +996 997 000 571;         303311│
│              +996 226 400 400               │
│       E-mail: glasscenter.kg@gmail.com      │
│       ИНН: 00610202310298 · ОКПО: 32200485  │
├─────────────────────────────────────────────┤  ← толстая (2px) разделительная линия
│                              Дата: « 20 » мая 2026 г.
│
│              НАКЛАДНАЯ № ____1024____
│
│  ┌────┬─────────────────┬──────┬──────┬───────┐
│  │ №  │  Наименование   │ Кол- │ Цена │ Сумма │
│  │    │                 │ во   │      │       │
│  ├────┼─────────────────┼──────┼──────┼───────┤
│  │ 1  │ 2920-1295 L-1   │  3   │      │       │
│  │ 2  │ 2920-1285 L2-3  │  6   │      │       │
│  │ 3  │ 3030-1255 L1-1  │  2   │      │       │
│  │ 4  │ 3030-1250 L1-3  │  6   │      │       │
│  │ 5  │ 2920-1285 L2-1  │  2   │      │       │
│  │ 6  │ 2920-1300 L2    │  1   │      │       │
│  │ 7  │ 2920-1280 L3-3  │  3   │      │       │
│  │ 8  │ 870-1250 L1-3   │  1   │      │       │
│  │    │                 │      │      │       │  ← пустые строки
│  │    │                 │      │      │       │     для дозаполнения
│  │    │                 │      │      │       │
│  │    │                 │      │      │       │
│  └────┴─────────────────┴──────┴──────┴───────┘
│
│  Машина: _____________  Водитель: _______________
│
│  Передал: _____________  Получил: ________________
└─────────────────────────────────────────────┘
```

Реализовано в компоненте `NakladnayaDocument` (см. `source/wireframes/common.jsx`, ~280–410 строки). Поддерживает `scale` (для эмбеддинга в превью разного размера), `fillData` (предзаполненные цены/суммы для демо), `highlightHeader` (подсветка шапки — используется в split-режиме).

**Печать**: при экспорте в PDF тот же макет, на формате A4 portrait. Шрифт документа — Inter; цифры/артикулы — SF Mono.

---

### 1. Home / список накладных (общий, не зависит от подхода)

**Purpose**: точка входа. Список ранее созданных накладных + быстрый старт новой.

**Layout** (сверху вниз):
1. **Title block** (white, border-bottom): kicker «GLASS CENTER» 11pt uppercase, заголовок «Накладные» 28pt/700.
2. **Filter chips** (overflow-x scroll): «Все · 247» (dark pill), «Черновики · 4», «Отправлено», «Оплачено» (ghost pills).
3. **Date group label**: «СЕГОДНЯ» 11pt uppercase 600.
4. **List of cards**: каждая карточка — `№ ____` (mono), дата справа, имя получателя, статус-чип + сумма.
5. **FAB** `+` правый нижний (над bottom nav).
6. **Bottom navigation**: 4 пункта (Накладные · Товары · Клиенты · Ещё), активный пункт акцентного цвета.

**Status chip** варианты:
- `draft` — серый фон `#f0f0f0`, текст ink-soft, серая рамка
- `sent` — белый фон, чёрная рамка, чёрный текст
- `paid` — `accent-tint` фон, accent текст, accent рамка

**Behavior**:
- Тап на карточку → детали накладной (открыть в превью).
- Свайп влево на карточке → опции (удалить/копировать).
- FAB → создание новой накладной (один из подходов A/B/C/D ниже).
- Pull-to-refresh.
- Поиск (иконка ⌕ в title block) открывает sticky поиск по № и имени клиента.

---

### 2. Preview / экспорт документа (общий)

**Purpose**: показать готовый PDF, дать поделиться/распечатать.

**Layout**:
- Screen header «Накладная № 1024», слева ‹ назад, справа ⋯
- Большой контейнер с `NakladnayaDocument` внутри (full-bleed по горизонтали, со скруглением 0). Тень мягкая.
- Бейдж «1 / 1 · 100%» (mono, dark, белый текст) — top-right оверлей.
- **Bottom action bar** (white, border-top, safe-area padding): 3 кнопки в строку — «⤓ PDF» (ghost), «WhatsApp» (ghost), «Печать» (accent).

**Behavior**:
- **Pinch-to-zoom** на документе (1.0×–3.0×).
- Дабл-тап = zoom 200% / 100%.
- Свайп вниз с самого верха документа → close.
- «PDF» → нативный share sheet с PDF файлом.
- «WhatsApp» → готовит сообщение «Накладная № __» + PDF attachment в WhatsApp.
- «Печать» → нативный print dialog.

---

## Approach A · Cards + Bottom Sheet

**Идея**: классический mobile pattern. Форма + список карточек товаров. FAB открывает bottom sheet с поиском по справочнику и счётчиком количества.

### A1 · Форма с карточками

- Screen header «Новая накладная», слева ✕, справа «Сохр.»
- **Сегментированный переключатель** «Форма / Preview» (top, white).
- **Карточка шапки**: №, Дата (в строку), Получатель (full), Машина + Водитель (в строку).
- **Section title** «ТОВАРЫ · 4», справа подсказка «свайп ← удалить».
- **Item cards** (1 на строку): порядковый № (square chip), артикул (mono 13/700), «× qty» + цена строкой ниже, сумма справа (mono 14/700), chevron ›. Карточка с незаполненной ценой — `accent-tint` фон + accent border, цена показывает «цена?» красным.
- **Dashed card-CTA**: «+ добавить товар».
- **Sticky totals bar** (white, border-top, safe-area):
  - Слева: «ИТОГО · 4 ПОЗИЦИИ» 10pt uppercase + сумма 22pt/700 mono.
  - Справа: accent pill «Готово →».
- **FAB** `+` правый нижний (над totals bar).

### A2 · Bottom sheet добавления товара

- Полупрозрачная тёмная подложка `rgba(10,10,10,0.45)` поверх затемнённой формы.
- **Sheet** (height ~660px из 844): белый, top corners radius 24px, soft top shadow.
- Drag handle `40×4` сверху.
- Title «Добавить товар» (18/700) + ✕.
- **Search input** (карточка): иконка ⌕ + текущий ввод mono (с blinking caret accent), справа квадратная кнопка скана штрихкода `▢`.
- **Suggestions block**: лейбл «НАЙДЕНО В СПРАВОЧНИКЕ», далее 3 карточки. Топовый матч — `accent-tint` фон + accent border. Совпавшая часть артикула подсвечена `accent-soft`. Цена справа mono.
- **Quantity stepper**:
  - Лейбл «КОЛИЧЕСТВО»
  - Большой степпер: `−` (50×50, border, white) — число 36pt/700 mono — `+` (50×50, accent border + accent-tint bg + accent text).
- **Bottom CTA**: full-width accent pill «Добавить · 8 280 c» (16/600, padding 14×0).

**Behavior**:
- Печатаешь артикул → debounced fuzzy match по справочнику.
- Тап по suggestion → префилл с ценой из справочника.
- Скан штрихкода (▢) открывает камеру → опознанный код вписывается в поле.
- ⏎ на клавиатуре = «Добавить».
- Drag-down закрывает sheet.

### A3 · Preview tab (тот же экран, переключатель → Preview)

- Тот же header и сегментированный переключатель, но активен «Preview».
- В контентной области — `NakladnayaDocument` (fillData).
- Bottom bar: ⤓ (ghost) + ↗ (ghost) + accent «Отправить» (flex 1).

---

## Approach B · Quick Entry Bar

**Идея**: speed-first. Sticky bottom bar (артикул + количество + ⏎). Товары появляются над ним «как чат». 3 действия на товар.

### B1 · Старт (пустой стейт)

- **Compact header** (white, border-bottom):
  - Кнопка ‹ назад (32×32, border)
  - Inline-чип «№ 1024 | «Алтын-Курулуш» ✎» — тапни → quick edit получателя/номера
  - Кнопка ⌕ справа
- **Empty state**: dashed-border плейсхолдер с тремя серыми линиями + «Начни вводить артикул» (16/600) + подсказка «код · количество · ⏎ — добавляет товар в список» 13/500 pencil.
- **QuickBar** (sticky bottom, focused state — accent border):
  - Большой input (flex 2): mono 14/700, placeholder «код / артикул» (pencil 500).
  - Quantity box (60×44): mono 15/700, дефолт «×1».
  - Send button (44×44, accent, ↵).
  - Под ним hint row: «⏎ добавить · ▢ скан · 🎤 голос» 11pt pencil.

### B2 · Ввод + автокомплит

- Header заменяет ⌕ на dark mono-чип «3 · 13 300 c» (live total).
- 3 item-rows над bar'ом (см. ниже).
- **Autocomplete dropdown** над QuickBar: floating card, 3 suggestions, top match с `accent-tint` фоном. Совпавшая часть артикула — `accent-soft` highlight.
- QuickBar показывает введённое значение в input (с blinking caret accent), qty=6.

### B3 · 8 позиций (заполнено)

- 8 item-rows в стандартном виде (compact).
- Между списком и QuickBar — **summary row**: «8 позиций · 29 130 c» (mono) + 2 chips: ⤓ (ghost) + «Отправить →» (accent).
- QuickBar в неfocus состоянии.

**ItemRow** (использовать в обоих B2/B3):
- Порядковый № (square chip 22×22, `paper-dim` фон, mono 10/700)
- Артикул (mono 13/700, flex)
- ×qty (mono 12, pencil), цена (mono 12, pencil), сумма (mono 13/700)
- Border 1px, radius 10.

**Behavior**:
- Поле артикула autofocus при открытии экрана (клавиатура открыта).
- ⏎ при заполненном поле → новый item-row сверху с анимацией fade-up + scale 0.95→1.0.
- Long-press ItemRow → меню «Изменить / Удалить».
- Свайп влево по ItemRow → красная зона «Удалить».
- Live total в верхнем чипе обновляется после каждого добавления.
- ▢ → BarcodeScanner. 🎤 → SpeechRecognition + парсер «два тысячи девятьсот двадцать тире двенадцать девяносто пять, три штуки».

---

## Approach C · Sticky Live Preview

**Идея**: документ-viewer сверху (40%), форма снизу (60%). Видишь итоговый PDF прямо во время заполнения. Тап по полю в превью → фокус в форме. Drag-handle меняет пропорции.

### C1 · Split · форма товаров

- Screen header «Накладная № 1024».
- **Sticky preview** (height 320, `paper-deep` фон с inner padding 12×16): `NakladnayaDocument scale=0.85 fillData`. Иконки ⤢ (fullscreen) и ↗ (share) — top right оверлей. Drag handle снизу по центру (52×16, белая капсула с серой полоской).
- **Form area**:
  - **Tabs** «Шапка / Товары · 8 / Подпись», активный с accent underline 2px.
  - **Smart horizontal-scroll table**: header row 11pt uppercase pencil, далее строки с порядковым № (mono pencil), артикулом (mono 13/700), кол-во, цена, сумма (mono 13/700 right). Текущая редактируемая строка — `accent-tint` фон.
  - **Bottom action row**: FAB (42×42 squared 10) `+` + блок «ИТОГО / 29 130 c» + accent pill «Готово».

### C2 · Split · форма шапки

- Same структура, но активный таб «Шапка», и preview подсвечивает шапку накладной (`highlightHeader` proп — добавляет `accent-tint` фон вокруг шапки документа).
- В форме — карточка с 5 SField'ами (№, Дата, Получатель, Адрес доставки, Машина + Водитель в строку).
- **Auto-save badge** внизу: dot 6×6 accent + «авто-сохранено · 2 сек назад» 12pt ink-soft.

### C3 · Fullscreen zoom

- Header same, но контент — `NakladnayaDocument scale=1.0` с `transform: scale(1.15)` внутри padding=20.
- Бейдж «1 / 1 · 150%» (dark mono pill) — bottom-center над action bar.
- **Bottom action bar**: 4 равных tile'a — «PDF ⤓», «Печать 🖨», «Share ↗», «Подпись ✎» (последний accent). Каждый tile: column flex, icon 18pt сверху + label 12pt/600 снизу, border-radius 12, border 1px.

**Behavior**:
- Drag-handle на стыке preview/form → меняет пропорции 30/70 ↔ 50/50 ↔ 70/30 (3 snap-точки).
- Тап на поле/раздел в preview → подсветка раздела + переключение таба формы + фокус нужного инпута.
- При редактировании поля — preview обновляется live (без debounce).
- Pinch на preview → fullscreen view (C3).
- Auto-save каждые 2 сек (после последнего изменения).

---

## Approach D · Wizard / Stepper

**Идея**: разбивка процесса на 3 свайпаемых шага. Меньше скролла на шаг, больше hit-зон, хорошо для одной руки и новых пользователей.

### D1 · Шаг 1 · Кому и куда

- **StepHeader**:
  - ‹ назад + center title «Шаг 1/3 · Кому и куда» (pencil «Шаг 1/3» + ink название)
  - Progress bar из 3 сегментов: текущий шире (flex 2 vs flex 1), пройденные accent, остальные pencil-light.
- **Cards**:
  - № (1×) + Дата (1.4×) в строку (mono значения).
  - **Получатель**: квадратный аватар 42×42 (ink bg, white initial 18/700) + 2 строки (имя 15/600, ИНН mono 11/pencil) + chevron ›.
  - **Недавние клиенты** (horizontal scroll chips): «СтройПлюс», «ИП Бек.», «Окна 24», «+ новый».
  - **Доставка**: SField Адрес (full), Машина + Водитель (в строку).
- **StepFooter**: nav-стиль — слева пусто, справа accent pill «Товары →».

### D2 · Шаг 2 · Товары

- StepHeader «Шаг 2/3 · Товары · 5», прогресс 2/3.
- **List of cards**: круглый № chip, артикул (mono) + «qty шт × price c» (11 pencil), inline qty stepper справа (−/число/+).
- **Dashed add card**: круглая accent кнопка + label «добавить товар».
- **StepFooter**: ← back (ghost) + «ИТОГО / 21 880 c» (mono) + accent pill «Подпись →».

### D3 · Шаг 3 · Подпись и отправка

- StepHeader «Шаг 3/3 · Подпись и отправка», прогресс 3/3.
- **Signature pad #1 «Передал»**:
  - header «Передал» + ghost pill «очистить»
  - холст 70px с dashed border, paper-dim фон. Уже нарисована подпись (SVG path) — иллюстрация.
  - имя «Тилек К.» pencil snippet.
- **Signature pad #2 «Получил»**:
  - header
  - пустой холст с placeholder «распишитесь здесь ✎» по центру (pencil 13/500)
  - SField «Имя» пустой.
- **Summary card** (dark): фон ink, белый текст, accent сумма.
  - top row: «№ 1024» (mono opacity 0.7) и «5 позиций»
  - main row: «Итого к оплате» 13/0.8 + сумма accent 24/700 mono.
- **StepFooter** finalStep: ← back + full-width accent pill «✓ Отправить».

**Behavior**:
- Свайп влево/вправо между шагами (с pull-resistance на крайних).
- Тап на progress segment → прыжок на тот шаг (если уже заполнен).
- Подпись — touch drawing на canvas, сохранение в PNG как часть документа.
- «Отправить» → запись в БД + переход на превью с share-sheet (см. экран 2).

---

## Component Patterns Reference

Все ниже определены в `source/wireframes/common.jsx`, используй как ТЗ:

- **`SketchPhone`** — обёртка iPhone-bezel 390×844 (только для дизайн-канваса; в проде не нужна).
- **`StatusBar`** — фейковый iOS status bar (опять же, в проде заменяется на нативный).
- **`SBox`** — стандартная карточка: `1px solid var(--border)`, `border-radius: 12px`, `bg: #fff`. Поддерживает `dashed` (пунктир для empty/CTA) и `accent` (`accent-tint` фон).
- **`SField`** — текстовое поле в карточке: лейбл uppercase 11/500 + значение 15/500 на нижней границе.
- **`SPill`** — кнопка/чип. Варианты: дефолт (white + border), `ghost` (transparent + border), `accent` (`#EE3626` bg, white text), `dark` (`#0a0a0a` bg, white text), `big` (padding 12×18, radius 12, font 15).
- **`SFab`** — floating action button 56×56, accent bg, white `+`, soft accent glow shadow.
- **`ScreenHeader`** — левая кнопка / центр-title / правая кнопка, border-bottom, white bg.
- **`BottomNav`** — 4 пункта (Накладные · Товары · Клиенты · Ещё), 72px height с safe-area padding.
- **`StatusChip`** — статус-чип (draft / sent / paid).
- **`NakladnayaDocument`** — strict документ (см. секцию 0).

## State Management

Что должно жить в стейте (минимум):

```ts
type Nakladnaya = {
  id: string;
  number: string;            // "1024"
  date: string;              // ISO "2026-05-20"
  recipient: { id, name, inn };
  deliveryAddress?: string;
  vehicle?: string;
  driver?: string;
  items: Array<{
    id: string;
    sku: string;             // "2920-1295 L-1"
    name?: string;
    qty: number;
    price?: number;
    sum?: number;            // computed = qty * price
  }>;
  signatures: {
    from?: { name, dataUrl };  // PNG из canvas
    to?: { name, dataUrl };
  };
  status: 'draft' | 'sent' | 'paid';
  total: number;             // computed
  createdAt, updatedAt;
};
```

Storage:
- Список накладных — `IndexedDB` (offline-first) + sync с бэком.
- Справочник товаров (SKU + цена) — закешировать на устройстве для fuzzy search без сети.

## Interactions & Behavior — summary

- **Realtime preview**: документ обновляется сразу при изменении формы (без debounce). Производительность важна — render NakladnayaDocument должен быть `< 16ms`.
- **Pinch-to-zoom**: поддержать в Preview через нативное `react-native-gesture-handler` / `UIScrollView.minimumZoomScale`.
- **Bottom sheet**: snap points (например 30% / 70% / 100%), drag-to-dismiss.
- **FAB**: при скролле вниз — слегка прячется (translate Y), при скролле вверх — возвращается.
- **Swipe to delete** на ItemRow / NakladnayaCard.
- **Auto-save**: каждые 2 сек после последнего ввода, индикатор внизу формы.
- **Haptic feedback**: при добавлении товара (light), на success-отправке (success), на удалении (warning).
- **Скан штрихкода**: камера + `MLKit` / нативный barcode reader → авто-заполнение SKU.
- **Голосовой ввод**: native SpeechRecognition → парсинг числа + «штук».

## Files (handoff)

```
source/
├── index.html                        ← точка входа (design canvas со всеми 15 артбордами)
├── lib/
│   ├── design-canvas.jsx             ← scaffolding для пан/зум canvas (не нужно в проде)
│   └── tweaks-panel.jsx              ← scaffolding для tweaks (не нужно в проде)
├── wireframes/
│   ├── common.jsx                    ← ВАЖНО — токены, SketchPhone, ScreenHeader, SField, SPill, SFab,
│   │                                    BottomNav, SketchAnnotation, NakladnayaDocument
│   ├── home.jsx                      ← Главная список + Preview документа
│   ├── approach-a.jsx                ← Cards + Bottom Sheet (A1, A2, A3)
│   ├── approach-b.jsx                ← Quick Entry Bar (B1, B2, B3)
│   ├── approach-c.jsx                ← Sticky Live Preview (C1, C2, C3)
│   ├── approach-d.jsx                ← Wizard Stepper (D1, D2, D3)
│   └── app.jsx                       ← композиция всех артбордов в design canvas
└── uploads/
    └── nakladnaya.docx               ← оригинальный Word-шаблон, по которому должен пиксель-в-пиксель
                                         совпадать NakladnayaDocument при экспорте в PDF
```

## Assets

Иконки в прототипе — **Unicode-плейсхолдеры**. Замени на иконки из стандартного набора целевой платформы:

| Unicode | Что значит | Рекомендация |
|---|---|---|
| ⌕ | search | `magnifyingglass` / `search` |
| › | chevron right | `chevron.right` |
| ‹ | back | `chevron.left` |
| ✕ | close | `xmark` |
| ⤓ | download / PDF export | `arrow.down.to.line` |
| ↗ | share | `square.and.arrow.up` |
| ⤢ | fullscreen | `arrow.up.left.and.arrow.down.right` |
| ▢ | scan barcode | `barcode.viewfinder` |
| 🎤 | voice input | `mic` |
| 🖨 | print | `printer` |
| ✎ | edit / signature | `pencil` |
| ↵ | send / enter | `arrow.return.left` |
| ⋯ | more menu | `ellipsis` |
| ▤ / ▦ / ◯ | bottom-nav placeholders | заменить на доменные (накладные / товары / клиенты) |
| + | add / FAB | `plus` |
| − / + (stepper) | qty stepper | `minus` / `plus` |

Логотип «GC» в шапке документа — placeholder. Реальная компания загрузит свой логотип; нужно поддержать загрузку (settings → company logo, max 200×200).

## Open questions for the dev

1. Целевая платформа: React Native / Flutter / native iOS+Android / web PWA?
2. Какой иконочный набор используется в проекте?
3. Готов ли бэк выдавать `recipients`, `products` для autocomplete?
4. Нужна ли offline-first архитектура (создание/редактирование без сети + later sync)?
5. Подпись — touch drawing или integration с e-signature провайдером (DocuSign / KEP)?
6. Локализация: только ru/kg или планируется en?
