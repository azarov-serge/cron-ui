# cron-ui

Демо-приложение и UI-библиотека для создания и проверки пятичастных cron-выражений (минута, час, день месяца, месяц, день недели — без секунд).

**Демо:** https://azarov-serge.github.io/cron-ui/  
**Версия:** `1.0.9` (в шапке приложения рядом с логотипом)

**Языки:** [English](README.md) · Русский (этот файл) · [中文](README.zh.md) · [हिन्दी](README.hi.md)

## Компоненты

| Что | Путь |
| --- | ---- |
| `Header` | `src/shared/components/Header/` — логотип, версия, язык RU / EN / ZH / HI, переключатель темы |
| `CronExpressionField` | `src/features/cron/components/CronEditor/components/CronFields/` — cron-выражение и копирование |
| `CronDescriptionField` | `src/features/cron/components/CronEditor/components/CronFields/` — описание расписания |
| `CronEditor` | `src/features/cron/components/CronEditor/` |
| `CronChecker` | `src/features/cron/components/CronChecker/` |
| `CronPage` | `src/features/cron/pages/CronPage.tsx` |
| `TimePicker` | `src/shared/components/TimePicker/` |
| ТЗ | [`src/features/cron/components/CronEditor/SRS.md`](src/features/cron/components/CronEditor/SRS.md) |

## Структура проекта

```text
src/
├── App.tsx
├── features/cron/
│   ├── components/
│   │   ├── CronEditor/       # CronEditor, CronFields/, секции
│   │   └── CronChecker/
│   ├── hooks/
│   ├── pages/CronPage.tsx
│   └── utils/
└── shared/
    ├── components/Header/, TimePicker/
    ├── constants/layout.ts   # LAYOUT_MAX_WIDTH_PX = 1280
    ├── i18n/                 # ru, en, zh, hi
    └── providers/            # AppThemeProvider, LocaleProvider
```

Алиасы: `@features/*`, `@shared/*`.

## Запуск

```bash
npm install
npm run dev      # https://localhost:5173/ (самоподписанный HTTPS)
npm run build
npm run preview  # локальная проверка production-сборки
```

## Публикация

GitHub Actions (`.github/workflows/deploy.yml`) деплоит при push в `main`.  
`vite.config.ts`: `base: '/cron-ui/'` для production, `'/'` для dev.

**GitHub Pages (один раз):** Settings → Pages → Source → **GitHub Actions**.

## Версионирование

| Источник | Назначение |
| -------- | ---------- |
| `package.json` → `version` | Единый номер версии приложения |
| `CHANGELOG.md` | Опциональные release notes |

## Зависимости

- `@admiral-ds/react-ui`, `@admiral-ds/icons` — UI
- `@ant-design/icons` — иконка редактирования на `CronPage`
- `cronstrue` — описание расписания (с кастомным билдером для Hindi)
- `styled-components`

## CronPage (демо)

Три вкладки, состояние синхронизируется с URL (`?cron=0+9+*+*+1`, `?tab=checker`):

| Вкладка | URL | Содержимое |
| ------- | --- | ---------- |
| Конструктор cron | _(по умолчанию)_ | inline `CronEditor` (cron и «Описание» внизу формы) |
| Параметры редактора | `editorParams` | панели `CronOptions` |
| Проверка cron | `checker` | `CronChecker`, **Редактор cron** → переход на конструктор с разобранным расписанием |

- Изменения в `CronEditor` сразу попадают в URL через `onChange`.
- **Редактор cron** на вкладке проверки переносит валидное выражение на конструктор.
- **Копировать** в блоке cron — `TextButton` с локализованной подписью на mobile.
- Язык (`cron-ui-locale`) и тема (`cron-ui-theme`) сохраняются в `localStorage`; при первом визите — язык браузера, если поддерживается.

## CronEditor

Пропсы: `cron`, `onChange`, `options` (`CronOptions`).

`onChange` вызывается при каждом изменении расписания (без кнопки «Сохранить»).

`CronOptions` управляют видимыми секциями, `minuteStep`, `weeklyWeekNumbers` и валидацией `requires`. Опции только для UI и на бэкенд не отправляются.

На выходе: `cron.toExpression()` — пятичастная строка для API.

### Контракт с бэкендом

| Поле | Тип | Описание |
| ---- | --- | -------- |
| `minute` | `string` | 0–59, `*`, `*/N` |
| `hour` | `string` | 0–23, `*`, `*/N` |
| `day_of_month` | `string \| null` | 1–31 или `null` → `*` |
| `month_of_year` | `string \| null` | 1–12 или `null` → `*` |
| `day_of_week` | `string \| null` | 0–6, списки, `день#неделя` или `null` → `*` |

Разбор: `Cron.fromString(expression)`. Невалидный ввод в редакторе → `0 9 * * *`; в `CronChecker` — ошибка разбора.

Рекомендуемая сущность API:

```ts
type ScheduleEntity = {
  id: string;
  name: string;
  enabled: boolean;
  cron_expression: string; // cron.toExpression()
};
```

`CronPage` хранит в URL только `cron` — не `name`, `enabled` и не `CronOptions`.

### CronOptions (по умолчанию)

| Параметр | По умолчанию | Поведение |
| -------- | ------------ | --------- |
| `scheduleTypes` | `recurring`, `one-time` | Один элемент — блок «Тип расписания» скрыт |
| `occursFrequencies` | `daily`, `weekly`, `monthly` | Один элемент — список «Выполняется» скрыт |
| `dailyFrequencies` | `once`, `every` | Один элемент — радиокнопки «Ежедневная частота» скрыты |
| `minuteStep` | `1` | Шаг минут в полях времени и в «каждые N минут» |
| `weeklyWeekNumbers` | `false` | Чекбоксы недель месяца (1–5) для еженедельного режима |
| `showYearNotice` | `false` | Предупреждение «Год не входит в cron» для one-time |
| `requires` | `[]` | Обязательные поля: `weeklyWeekDays`, `weeklyWeekNumbers` |

Допустимые `minuteStep`: `1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30`.

### UI → cron (примеры)

| Настройка | Выражение |
| --------- | --------- |
| Ежедневно в 09:00 | `0 9 * * *` |
| Еженедельно, пн, 09:00 | `0 9 * * 1` |
| Еженедельно, пн, 1-я неделя | `0 9 * * 1#1` |
| Ежемесячно, 15-е число | `0 9 15 * *` |
| Каждые 10 минут | `*/10 * * * *` |
| Каждые 2 часа | `0 */2 * * *` |
| Однократно 25.03 в 14:30 | `30 14 25 3 *` |

Дни недели: 0 = вс, 1 = пн, …, 6 = сб.

## CronChecker

Вставка cron-выражения → разбор полей, описание, интерпретация редактора, ошибки валидации.

## Пример интеграции

```tsx
import {
  CronEditor,
  type CronOptions,
} from '@features/cron/components/CronEditor';
import { Cron } from '@features/cron/components/CronEditor/models/cron';

<CronEditor
  cron={task.cron}
  options={{
    scheduleTypes: ['recurring'],
    occursFrequencies: ['daily', 'weekly'],
    dailyFrequencies: ['once'],
    minuteStep: 5,
  }}
  onChange={saveCron}
/>;
```
