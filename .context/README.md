# Контекст проекта

Эта папка нужна, чтобы будущая сессия с ассистентом быстро поняла проект и не тратила время на повторный разбор.

## Как пользоваться

Если ты открываешь новую сессию и просишь что-то сделать в этом проекте, сначала можно написать:

```text
Прочитай .context/README.md и работай по контексту проекта.
```

Если задача техническая или затрагивает код, полезно добавить:

```text
После изменений прогони npm test и npm run build.
```

## Что читать

- `PROJECT.md` — что это за проект, стек, структура, где искать ключевой код.
- `WORKFLOW.md` — как запускать, проверять и безопасно менять проект.
- `TESTING.md` — какие тесты есть и как добавлять новые.
- `CONVENTIONS.md` — локальные правила кода и архитектуры.
- `ROADMAP.md` — что уже сделано и что логично делать дальше.

## Самое короткое резюме

Это Vue 3 + TypeScript + Vite игра "Сапер".

Главные файлы:

- `src/composables/useMinesweeper/useMinesweeper.ts` — игровая логика.
- `src/components/GameBoard/GameBoard.vue` — построение сетки.
- `src/components/Cell/Cell.vue` — отдельная ячейка.
- `src/types/game.ts` — интерфейсы и константы; публичный импорт — `@/types`.

Импорты: `@/components`, `@/composables`, `import type` из `@/types`.

Команды:

```bash
npm run dev
npm test
npm run build
```

GitHub remote:

```text
git@github.com:CrKot/vue-minesweeper.git
```
