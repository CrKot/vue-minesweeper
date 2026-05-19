# Тестирование

## Стек

- Vitest.
- Vue Test Utils.
- jsdom.

## Команды

Разовый прогон:

```bash
npm test
```

Watch mode:

```bash
npm run test:watch
```

Проверка перед завершением задачи:

```bash
npm test
npm run build
```

## Текущие тесты

Spec-файлы лежат рядом с кодом в папке модуля. Компоненты в тестах импортируются через `@/components/<Name>`, composable — через `@/composables/useMinesweeper`.

### `src/components/Cell/Cell.spec.ts`

Проверяет:

- левый клик эмитит `reveal(row, col)`;
- правый клик эмитит `flag(row, col)`;
- keyboard actions;
- accessibility attributes;
- открытая клетка с соседними минами показывает число.

### `src/components/GameBoard/GameBoard.spec.ts`

Проверяет:

- рендерится правильное количество клеток;
- CSS grid обновляет количество колонок при смене ширины board;
- событие из `Cell` пробрасывается наружу с координатами.

### `src/components/GameControls/GameControls.spec.ts`

Проверяет:

- активную сложность;
- событие смены сложности;
- событие reset.

### `src/components/GameStatus/GameStatus.spec.ts`

Проверяет:

- отображение флагов, времени и emoji статуса;
- обновление emoji и accessibility label при смене статуса.

### `src/composables/useMinesweeper/useMinesweeper.spec.ts`

Проверяет:

- начальное easy-поле;
- смену сложности;
- safe first click;
- флаги и счетчик оставшихся флагов;
- ограничения на флаги до старта и на открытых клетках;
- проигрыш при открытии мины;
- победу после открытия всех безопасных клеток;
- остановку таймера после unmount.

## Что тестировать дальше

При новых изменениях:

- Изменение логики `useMinesweeper` -> добавлять тест в `src/composables/useMinesweeper/useMinesweeper.spec.ts`.
- Изменение рендера или событий компонента -> добавлять spec в папку компонента (`<Name>/<Name>.spec.ts`).
- Новый компонент -> папка `src/components/<Name>/` с `<Name>.vue`, `index.ts` и при необходимости spec; добавить реэкспорт в `src/components/index.ts`.
- Изменение уровней сложности -> проверять размеры и счетчик мин.
- Изменение таймера -> использовать fake timers.

## Недостающее покрытие

Полезно добавить:

- Тест на chording, если эта механика будет добавлена.
- Тесты для будущих рекордов в `localStorage`.
- E2E-тесты для полного пользовательского сценария.
