# Проект

## Назначение

Браузерная игра "Сапер": пользователь открывает клетки, ставит флажки, избегает мин и выигрывает, когда открыты все безопасные клетки.

## Стек

- Vue 3.
- Composition API.
- `<script setup>`.
- TypeScript.
- Vite.
- Vitest.
- Vue Test Utils.
- jsdom.

## Структура

```text
src/
├── App.vue
├── main.ts
├── style.css
├── components/
│   ├── index.ts
│   ├── Cell/
│   │   ├── Cell.vue
│   │   ├── Cell.spec.ts
│   │   └── index.ts
│   ├── GameBoard/
│   │   ├── GameBoard.vue
│   │   ├── GameBoard.spec.ts
│   │   └── index.ts
│   ├── GameControls/
│   │   ├── GameControls.vue
│   │   ├── GameControls.spec.ts
│   │   └── index.ts
│   └── GameStatus/
│       ├── GameStatus.vue
│       ├── GameStatus.spec.ts
│       └── index.ts
├── composables/
│   ├── index.ts
│   └── useMinesweeper/
│       ├── useMinesweeper.ts
│       ├── useMinesweeper.spec.ts
│       └── index.ts
└── types/
    ├── game.ts
    └── index.ts
```

Каждый компонент и composable лежит в своей папке; `index.ts` реэкспортирует публичный API. Импорты — через алиас `@/`:

```typescript
import { GameBoard, GameControls, GameStatus } from '@/components'
import { useMinesweeper } from '@/composables'
import type { CellState } from '@/types'
import { DIFFICULTY_CONFIG } from '@/types'
```

## Ключевые зоны

### `src/types/`

- `game.ts` — интерфейсы, union-типы и константы.
- `index.ts` — barrel: `export type { ... }` и `export { GAME_BOARD, DIFFICULTY_CONFIG }`.

Содержит типы и настройки:

- `CellState`
- `GameStatus`
- `Difficulty`
- `GameConfig`
- `GAME_BOARD`
- `DIFFICULTY_CONFIG`

Текущие сложности:

| Сложность | Размер | Мины |
| --- | --- | --- |
| `easy` | 9x9 | 10 |
| `medium` | 16x16 | 40 |
| `hard` | 16x30 | 99 |

### `src/composables/useMinesweeper/useMinesweeper.ts`

Основная логика:

- создание пустого поля;
- расстановка мин;
- safe first click;
- подсчет соседних мин;
- итеративное открытие пустых клеток через очередь;
- флаги;
- победа/поражение;
- таймер;
- смена сложности.

Важные детали:

- До первого клика статус `idle`.
- Первый `reveal(row, col)` запускает игру и исключает эту клетку из расстановки мин.
- `flag()` работает только в статусе `playing`.
- При проигрыше открываются все мины.
- Таймер очищается при reset, win, lost и unmount.

### `src/components/GameBoard/GameBoard.vue`

Отвечает за визуальную сетку:

- принимает `board: CellState[][]`;
- считает количество колонок реактивно;
- рендерит `Cell` через вложенный `v-for`;
- пробрасывает события `reveal` и `flag` наверх;
- содержит `.board-wrap` с горизонтальным скроллом для широкого поля.

### `src/components/Cell/Cell.vue`

Отвечает за одну клетку:

- закрытая/открытая клетка;
- мина;
- флаг;
- число соседних мин;
- левый клик -> `reveal`;
- правый клик -> `flag`.
- Enter/Space -> `reveal`.
- F -> `flag`.
- Есть `role="gridcell"`, `tabindex` и `aria-label`.

### `src/components/GameControls/GameControls.vue`

Кнопки сложности и новая игра.

### `src/components/GameStatus/GameStatus.vue`

Отображает счетчик мин/флагов, emoji статуса и таймер.

Есть `aria-live="polite"` для объявления изменений статуса.
