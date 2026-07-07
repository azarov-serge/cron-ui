# Code Guide

Соглашения по коду в проекте `cron-ui`. Эталонная реализация — `src/features/cron/components/CronEditor/`.

---

## 1. React

### Импорт

```tsx
import React from 'react';
```

Не использовать именованные импорты из React:

```tsx
// ❌
import { useState, useMemo, type FC } from 'react';
```

### API React — через namespace

```tsx
export const CronEditor: React.FC<CronEditorProps> = (props) => { ... };

const [state, setState] = React.useState(initial);
const memo = React.useMemo(() => ..., [deps]);
React.useEffect(() => ..., [deps]);
```

---

## 2. Компоненты

### Сигнатура и props

Компонент объявляется как `React.FC<Props>`, props принимаются одним объектом и сразу деструктурируются:

```tsx
export const MonthlyFields: React.FC<CronSectionProps> = (props) => {
  const { value, onChange } = props;
  // ...
};
```

Не деструктурировать props в параметрах функции:

```tsx
// ❌
export const MonthlyFields = ({ value, onChange }: CronSectionProps) => {
```

### Controlled-компонент (`CronEditor`)

- Единственный источник истины — проп `value: Cron`
- Изменения — через `onChange?: (value: Cron) => void`
- Внутренний `useState` для cron **не использовать**
- Секции получают общий контракт `CronSectionProps`:

```ts
type CronSectionProps = {
  value: Cron;
  options: Required<CronOptions>;
  onChange: (value: Cron) => void;
};
```

---

## 3. Styled-components

Импорт стилей модуля — namespace:

```tsx
import * as Styled from '../styles';

return (
  <Styled.Section>
    <Styled.InlineRow>...</Styled.InlineRow>
  </Styled.Section>
);
```

Не импортировать styled-компоненты поимённо из `styles.ts`:

```tsx
// ❌
import { Section, InlineRow } from '../styles';
```

Локальные styled внутри файла (например, `CopyButton`) допустимы, если не переиспользуются.

---

## 4. Barrel exports (`index.ts`)

Публичный API папки — через `export *`:

```ts
// utils/index.ts
export * from './constants';
export * from './options';
export * from './validation';
export * from './cronParsers';
// ...

// components/index.ts
export * from './WeeklyFields';
export * from './MonthlyFields';
// ...

// hooks/index.ts
export * from './useCronEditorConfig';
export * from './useCronEditorValidation';
```

Не перечислять экспорты вручную, если достаточно реэкспорта модуля:

```ts
// ❌
export { CronEditor } from './CronEditor';
export type { CronEditorProps } from './CronEditor';
```

---

## 5. Импорты из папок

Импортировать из **индекса папки**, а не из конкретного файла.

### Utils

```tsx
// ✅
import {
  parseScheduleFromCron,
  toggleWeekDay,
  isCronFieldRequired,
  WEEK_NUMBER_KEYS,
} from '../utils';

// ❌
import { WEEK_NUMBER_KEYS } from '../utils/scheduleTypes';
import { getEveryIntervalHint } from '../utils/validation';
```

### Hooks

```tsx
// ✅
import { useCronEditorConfig, useCronEditorValidation } from '../hooks';

// ❌
import { useCronEditorConfig } from '../hooks/useCronEditorConfig';
```

Хуки `CronEditor` реэкспортируются через:

```
CronEditor/hooks/index.ts
  → CronEditor/index.ts
    → features/cron/components/index.ts
```

### Components

```tsx
import { WeeklyFields, MonthlyFields } from './components';
```

---

## 6. Деструктуризация schedule

Если из результата парсера нужны отдельные поля — деструктурировать сразу:

```tsx
// ✅
const { weekDays, weekNumbers } = parseScheduleFromCron(value);
const { scheduleType, oneTimeDate, oneTimeTime } = getOneTimeSchedule(value);
const { onceAtTime, everyInterval, everyUnit } = getDailyFrequencySchedule(value);
const { schedule, isOneTime } = getOutputState(value);

// ❌
const schedule = parseScheduleFromCron(value);
const weekDays = schedule.weekDays;
const weekNumbers = schedule.weekNumbers;
```

Если объект целиком передаётся дальше (`validateSchedule(schedule, ...)`) — промежуточную переменную `schedule` оставлять.

---

## 7. Структура `CronEditor`

```
CronEditor/
  CronEditor.tsx          # точка входа, Styled.Form, prop drilling
  index.ts                # export * (компонент, components, hooks, utils)
  styles.ts               # общие styled-секции формы
  models/cron/            # класс Cron
  utils/
    index.ts              # export * из всех утилит
    cronParsers.ts        # parseScheduleFromCron / buildCronFromSchedule
    cronUiState.ts        # set/toggle/get для UI
    scheduleTypes.ts      # типы ScheduleInterface
    options.ts            # CronOptions
    validation.ts
  hooks/
    index.ts
    useCronEditorConfig.ts
    useCronEditorValidation.ts
  components/
    index.ts
    types.ts              # CronSectionProps
    styles.ts             # styled для CronExpressionField и др.
    *Section.tsx
    *Fields.tsx
```

### Поток данных

```
value (Cron) → секция → parse/get → UI
                ↓
         onChange(setX(value, ...)) → buildCronFromSchedule → родитель
```

Store (Zustand) и класс `Schedule` **не используются**.

---

## 8. `CronEditor` vs `CronEditorRU`

| | `CronEditor` | `CronEditorRU` |
| - | ------------ | -------------- |
| Тексты | `useTranslation()` | захардкоженный русский в JSX |
| Зависимости | i18n | автономная копия `models/`, `utils/`, `hooks/` |
| Описание | `describeScheduleHuman(..., locale)` | `describeScheduleHuman(...)` из локального `utils/describeCron` |

`CronEditorRU` — полная копия без импортов из `CronEditor`.

---

## 9. Именование

| Сущность | Паттерн |
| -------- | ------- |
| Компонент редактора | `CronEditor`, `CronEditorRU` |
| Секция формы | `*Section` (`ScheduleTypeSection`) |
| Поля внутри секции | `*Fields` (`WeeklyFields`) |
| Хуки | `useCronEditor*` |
| Парсер/билдер | `parseScheduleFromCron`, `buildCronFromSchedule` |
| Мутации UI | `set*`, `toggle*` в `cronUiState.ts` |
| Проп значения | `value` (не `cron`) |

---

## 10. Чеклист перед PR

- [ ] `import React from 'react'`, хуки через `React.use*`
- [ ] `React.FC<Props> = (props) => { const { ... } = props; }`
- [ ] `import * as Styled from '.../styles'`
- [ ] Импорты из `../utils`, `../hooks`, не из вложенных файлов
- [ ] `index.ts` — `export * from`
- [ ] Деструктуризация результата `parse*` / `get*`, где нужны отдельные поля
- [ ] `npm run build` проходит
