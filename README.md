# ManualDolojista Blog

Современный блог с использованием Node.js, React, PostgreSQL и Prisma ORM.

## Технологии

- **Backend**: Node.js + Express + Prisma ORM
- **Frontend**: React + Vite + TypeScript
- **База данных**: PostgreSQL
- **Стили**: Tailwind CSS
- **UI компоненты**: Headless UI

## Быстрый старт

1. Установите зависимости:
```bash
npm run install:all
```

2. Настройте базу данных:
```bash
npm run db:migrate
npm run db:seed
```

3. Запустите приложение:
```bash
npm run dev
```

## Доступные команды

- `npm run dev` - запуск в режиме разработки
- `npm run build` - сборка для продакшена
- `npm run db:migrate` - выполнение миграций
- `npm run db:studio` - открытие Prisma Studio
- `npm run db:seed` - заполнение базы тестовыми данными

## Структура проекта

```
├── client/          # React frontend
├── server/          # Node.js backend
├── shared/          # Общие типы и утилиты
└── docs/           # Документация
```

## API /api/ingest (Vercel)

Переменные окружения для Vercel:
- `SANITY_PROJECT_ID`
- `SANITY_DATASET`
- `SANITY_TOKEN`
- `INGEST_SECRET`

После обновления значений запустите повторный деплой продакшн-окружения.

### Проверка продакшн-эндпоинта

PowerShell
```powershell
$json='{"title":"Como escolher plataforma de e-commerce em 2025 (matriz neutra)","excerpt":"plataforma e-commerce, Shopify vs Nuvemshop, custo total","type":"guia","keywords":"plataforma e-commerce; comparativo 2025","siteDomain":"manualdolojista.com"}'
Invoke-RestMethod -Uri "https://manualdolojista.com/api/ingest" -Method POST -Headers @{ "x-ingest-secret" = "<INGEST_SECRET>" } -ContentType "application/json" -Body $json
```

curl.exe
```powershell
curl.exe -X POST "https://manualdolojista.com/api/ingest" -H "Content-Type: application/json" -H "x-ingest-secret: <INGEST_SECRET>" -d "{\"title\":\"Como escolher plataforma de e-commerce em 2025 (matriz neutra)\",\"excerpt\":\"plataforma e-commerce, Shopify vs Nuvemshop, custo total\",\"type\":\"guia\",\"keywords\":\"plataforma e-commerce; comparativo 2025\",\"siteDomain\":\"manualdolojista.com\"}"
```
