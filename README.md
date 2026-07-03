# cron-ui

Demo app and UI library for building and validating five-field cron schedules (minute, hour, day of month, month, day of week — no seconds).

**Demo:** https://azarov-serge.github.io/cron-ui/  
**Version:** `1.0.7` (shown in the app header next to the logo)

**Languages:** English (this file) · [Русский](README.ru.md) · [中文](README.zh.md) · [हिन्दी](README.hi.md)

## Components

| Item | Path |
| ---- | ---- |
| `Header` | `src/shared/components/Header/` — logo, version, language menu (RU / EN / ZH / HI), theme toggle |
| `CronExpressionField` | `src/features/cron/components/CronFields/` — cron expression + copy |
| `CronDescriptionField` | `src/features/cron/components/CronFields/` — human-readable schedule |
| `CronEditor` | `src/features/cron/components/CronEditor/` |
| `CronChecker` | `src/features/cron/components/CronChecker/` |
| `CronPage` | `src/features/cron/pages/CronPage.tsx` |
| `TimePicker` | `src/shared/components/TimePicker/` |
| Spec | [`src/features/cron/components/CronEditor/SRS.md`](src/features/cron/components/CronEditor/SRS.md) |

## Project structure

```text
src/
├── App.tsx
├── features/cron/
│   ├── components/
│   │   ├── CronEditor/
│   │   ├── CronChecker/
│   │   └── CronFields/       # CronExpressionField, CronDescriptionField
│   ├── hooks/
│   ├── pages/CronPage.tsx
│   └── utils/
└── shared/
    ├── components/Header/, TimePicker/
    ├── constants/layout.ts   # LAYOUT_MAX_WIDTH_PX = 1920
    ├── i18n/                 # ru, en, zh, hi
    └── providers/            # AppThemeProvider, LocaleProvider
```

Path aliases: `@features/*`, `@shared/*`.

## Quick start

```bash
npm install
npm run dev      # https://localhost:5173/ (self-signed HTTPS)
npm run build
npm run preview  # test production build locally
```

## Deployment

GitHub Actions (`.github/workflows/deploy.yml`) deploys on push to `main`.  
`vite.config.ts`: `base: '/cron-ui/'` for production, `'/'` for dev.

**GitHub Pages (one-time):** Settings → Pages → Source → **GitHub Actions**.

## Versioning

| Source | Purpose |
| ------ | ------- |
| `package.json` → `version` | Single app version (UI, releases) |
| `CHANGELOG.md` | Optional release notes |

## Dependencies

- `@admiral-ds/react-ui`, `@admiral-ds/icons` — UI
- `@ant-design/icons` — edit icon on `CronPage`
- `cronstrue` — schedule descriptions (with custom Hindi builder)
- `styled-components`

## CronPage (demo)

Two tabs, state synced with URL (`?cron=0+9+*+*+1`, `?tab=checker`):

| Tab | URL | Content |
| --- | --- | ------- |
| Cron constructor | _(default)_ | cron & description fields, editor options, `CronEditor` |
| Cron checker | `checker` | `CronChecker` |

- **cron** and **Description** fields show the current schedule; they do not change until you save from the editor.
- **Edit cron** opens the cron editor (window on desktop, full-screen on mobile).
- **Copy** — `TextButton` with localized label on mobile.
- Locale (`cron-ui-locale`) and theme (`cron-ui-theme`) persist in `localStorage`; first visit uses browser language when supported.

## CronEditor

Props: `cron`, `onSubmit`, `options` (`CronOptions`).  
Form id: `cron-schedule-form` — external submit via `form="cron-schedule-form"`.

`CronOptions` control visible sections, `minuteStep`, `weeklyWeekNumbers`, and `requires` validation. Options are UI-only and are not sent to a backend.

Output: `cron.toExpression()` — five-field string for APIs.

### Backend contract

| Field | Type | Notes |
| ----- | ---- | ----- |
| `minute` | `string` | 0–59, `*`, `*/N` |
| `hour` | `string` | 0–23, `*`, `*/N` |
| `day_of_month` | `string \| null` | 1–31 or `null` → `*` |
| `month_of_year` | `string \| null` | 1–12 or `null` → `*` |
| `day_of_week` | `string \| null` | 0–6, lists, `day#week` or `null` → `*` |

Parse: `Cron.fromString(expression)`. Invalid input in the editor falls back to `0 9 * * *`; in `CronChecker` — parse error.

Recommended API shape:

```ts
type ScheduleEntity = {
  id: string;
  name: string;
  enabled: boolean;
  cron_expression: string; // cron.toExpression()
};
```

`CronPage` stores only `cron` in the URL — not `name`, `enabled`, or `CronOptions`.

### CronOptions (defaults)

| Option | Default | Effect |
| ------ | ------- | ------ |
| `scheduleTypes` | `recurring`, `one-time` | Single value hides the schedule-type block |
| `occursFrequencies` | `daily`, `weekly`, `monthly` | Single value hides the frequency select |
| `dailyFrequencies` | `once`, `every` | Single value hides daily-frequency radios |
| `minuteStep` | `1` | Minute step for time fields and “every N minutes” |
| `weeklyWeekNumbers` | `false` | Week-of-month checkboxes (1–5) for weekly mode |
| `requires` | `[]` | Required fields: `weeklyWeekDays`, `weeklyWeekNumbers` |

Allowed `minuteStep`: `1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30`.

### UI → cron examples

| Setting | Expression |
| ------- | ---------- |
| Daily at 09:00 | `0 9 * * *` |
| Weekly Mon 09:00 | `0 9 * * 1` |
| Weekly Mon, 1st week | `0 9 * * 1#1` |
| Monthly on 15th | `0 9 15 * *` |
| Every 10 minutes | `*/10 * * * *` |
| Every 2 hours | `0 */2 * * *` |
| One-time 25 Mar 14:30 | `30 14 25 3 *` |

Day of week: 0 = Sun, 1 = Mon, …, 6 = Sat.

## CronChecker

Paste a cron expression → field breakdown, human description, editor interpretation, validation errors.

## Integration example

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
  onSubmit={saveCron}
/>;
```
