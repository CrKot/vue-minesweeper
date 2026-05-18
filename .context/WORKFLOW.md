# Workflow

## Установка

```bash
npm install
```

## Запуск разработки

```bash
npm run dev
```

Обычно приложение доступно на:

```text
http://localhost:5173/
```

В sandbox запуск dev-сервера может падать с `listen EPERM`. В таком случае нужен запуск с escalated permissions.

## Проверки

После изменений в логике, компонентах, тестах, конфиге или зависимостях запускать:

```bash
npm test
npm run build
```

`npm run build` включает `vue-tsc -b`, поэтому ловит ошибки типов.

## CI

GitHub Actions workflow находится в `.github/workflows/ci.yml`.

Он запускается на `push` и `pull_request` в `main` и выполняет:

```bash
npm ci
npm test
npm run build
```

## Важное про репозиторий

Проект является git-репозиторием и запушен на GitHub:

```text
git@github.com:CrKot/vue-minesweeper.git
```

Для проверки локальных изменений использовать:

```bash
git status
git diff
```

Для поиска по файлам использовать:

```bash
find src -maxdepth 3 -type f -print
rg "pattern" src
```

## Как просить ассистента в будущей сессии

Для изменений:

```text
Прочитай .context/README.md, сделай <задача>, затем прогони npm test и npm run build.
```

Для анализа:

```text
Прочитай .context/PROJECT.md и объясни, где лучше менять <часть проекта>.
```

Для новой фичи:

```text
Прочитай .context/CONVENTIONS.md и .context/TESTING.md, добавь <фича> с тестами.
```

## Перед изменениями

1. Понять, затрагивается ли логика игры, UI или конфиг.
2. Найти ближайший существующий паттерн.
3. Изменять минимальный набор файлов.
4. Добавить или обновить тесты, если меняется поведение.
5. Запустить `npm test`.
6. Запустить `npm run build`.
