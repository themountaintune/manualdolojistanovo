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
