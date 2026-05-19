# Сапер

Браузерная игра "Сапер" на Vue 3, TypeScript и Vite.

## Возможности

- Три уровня сложности: легкий, средний, сложный.
- Безопасный первый клик: первая открытая ячейка никогда не является миной.
- Флажки по правому клику.
- Таймер партии.
- Счетчик оставшихся флагов.
- Автоматическое открытие пустых областей.
- Горизонтальный скролл для широкого поля на маленьких экранах.
- Управление ячейками с клавиатуры: Enter/Space открывает, F ставит флаг.

## Стек

- Vue 3
- TypeScript
- Vite
- Vitest
- Vue Test Utils
- jsdom

## Установка

```bash
npm install
```

## Запуск

```bash
npm run dev
```

По умолчанию Vite поднимает приложение на:

```text
http://localhost:5173/
```

## Тесты

```bash
npm test
```

Запуск тестов в watch-режиме:

```bash
npm run test:watch
```

## Сборка

```bash
npm run build
```

Скрипт запускает проверку TypeScript через `vue-tsc` и затем production-сборку Vite.

## CI

В проекте настроен GitHub Actions workflow:

```text
.github/workflows/ci.yml
```

Он запускает `npm ci`, `npm test` и `npm run build` на каждый push и pull request в `main`.

## Структура проекта

```text
src/
├── App.vue
├── main.ts
├── style.css
├── components/
│   ├── index.ts
│   ├── Cell/
│   ├── GameBoard/
│   ├── GameControls/
│   └── GameStatus/
├── composables/
│   ├── index.ts
│   └── useMinesweeper/
└── types/
    ├── game.ts
    └── index.ts
```

В каждой папке компонента или composable: реализация, spec-тесты (если есть) и `index.ts` для реэкспорта.

## Где что находится

- `src/composables/useMinesweeper/useMinesweeper.ts` — основная игровая логика.
- `src/types/game.ts` — интерфейсы, union-типы и константы; импорт через `@/types`.
- `src/components/GameBoard/GameBoard.vue` — построение сетки ячеек.
- `src/components/Cell/Cell.vue` — отображение и события отдельной ячейки.
- `src/components/GameControls/GameControls.vue` — выбор сложности и новая игра.
- `src/components/GameStatus/GameStatus.vue` — таймер, флаги и статус игры.

Пример импортов:

```typescript
import { GameBoard, GameControls, GameStatus } from '@/components'
import { useMinesweeper } from '@/composables'
import type { CellState } from '@/types'
```

## Уровни сложности

| Уровень | Размер поля | Мины |
| --- | --- | --- |
| Легкий | 9x9 | 10 |
| Средний | 16x16 | 40 |
| Сложный | 16x30 | 99 |
