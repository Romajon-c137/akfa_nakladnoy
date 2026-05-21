# akfa Nakladnaya

Mobile-first PWA для создания и печати накладных Glass Center. Next.js 16 + React 19 + MongoDB.

## Запуск локально

```powershell
npm install
cp .env.example .env.local      # заполни переменные
npm run dev
```

Откроется на http://localhost:3000.

## Переменные окружения

Файл `.env.local` (не коммитится):

| Ключ          | Назначение                          |
|---------------|-------------------------------------|
| `MONGODB_URI` | Строка подключения к MongoDB        |
| `MONGODB_DB`  | Имя БД (по умолчанию `akfa_nakladnaya`) |
| `DELETE_PIN`  | PIN для удаления накладных          |

## Структура

```
app/                Next.js App Router
  page.tsx          Список накладных
  new/page.tsx      Создание накладной
  invoice/[id]/     Просмотр и печать
components/         UI компоненты (SBox, SPill, NakladnayaDocument, ...)
lib/
  actions.ts        Server actions (Mongo I/O)
  mongodb.ts        Подключение с reconnect-на-dev
  store.ts          Zustand клиент-стор
  types.ts          Типы домена
  catalog.ts        Mock справочник товаров
  pdf.ts            Экспорт в PDF через html2canvas+jspdf
scripts/
  clear-invoices.mjs  Утилита очистки коллекции
```

## Скрипты

| Команда           | Что делает                          |
|-------------------|-------------------------------------|
| `npm run dev`     | Dev сервер (Turbopack)              |
| `npm run build`   | Production билд                     |
| `npm run start`   | Production сервер                   |
| `npm run lint`    | ESLint                              |

## Деплой

Любая платформа с Node 20+. Vercel — самый простой путь:
1. Подключить репо
2. Указать env vars в настройках проекта
3. Deploy

## Маршрут поддержки

- Изменения в дизайне — токены в `app/globals.css` (`--ink`, `--accent`, `--paper-*`)
- Бизнес-логика накладных — `lib/actions.ts` + `lib/schemas.ts`
- Печатный шаблон — `components/NakladnayaDocument.tsx` + `@media print` в `globals.css`
