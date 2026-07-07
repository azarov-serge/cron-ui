# TimePicker

Компонент выбора времени на базе **Admiral DS** (`InputBox`, `InputLine`, `StyledDropdownContainer`).  
Формат значения — `string | null`: `HH:mm` / `HH:mm:ss` или `null` (время не выбрано).

Экспорт: `@shared/components/TimePicker` или `@shared/components`.

---

## Компоненты

|                        | `TimePicker`                                     | `TimePickerField`                                                         |
| ---------------------- | ------------------------------------------------ | ------------------------------------------------------------------------- |
| **Что это**            | Базовый виджет: поле ввода + выпадающие колонки  | Обёртка над `TimePicker` для форм                                         |
| **UI**                 | `InputBox` с иконкой часов, dropdown с колонками | То же + опциональный `Field` с подписью                                   |
| **Нормализация минут** | Нет                                              | Да — `normalizeTimeToMinuteStep` + `useEffect`                            |
| **Проп `label`**       | Нет                                              | Есть (`Field` из Admiral DS)                                              |
| **Где используется**   | `DateTimePicker`, `TimePickerField`              | `CronEditor` (`OneTimeSection` → `DateTimePicker`, `DailyFrequencySection`) |

### `TimePicker`

Controlled-компонент. Отвечает за:

- маску ввода `чч:мм` / `чч:мм:сс` (`utils.ts`, логика Admiral DS `defaultTimePickerHandle`);
- выпадающую панель с прокручиваемыми колонками (часы, минуты, опционально секунды);
- синхронизацию `value` ↔ внутреннего `innerValue`;
- клавиатуру (`Escape` — закрыть, `ArrowDown` — открыть);
- `onChange` при полном вводе, выборе в колонках и `blur`.

**Не** исправляет «левые» минуты при монтировании — отдаёт родителю то, что ввёл пользователь.

### `TimePickerField`

Тонкая обёртка:

```tsx
const normalizedValue = normalizeTimeToMinuteStep(value, minuteStep);

useEffect(() => {
  if (normalizedValue !== value) {
    onChange(normalizedValue);
  }
}, [normalizedValue, onChange, value]);
```

Дополнительно:

1. **Авто-нормализация** — если `value` не кратно `minuteStep`, округляет минуты и вызывает `onChange` (нужно для cron: URL, парсер, старое состояние).
2. **`label`** — если передан, оборачивает в `Field`; если нет — рендерит чистый `TimePicker`.

---

## Какой компонент когда

| Сценарий                                                       | Компонент         |
| -------------------------------------------------------------- | ----------------- |
| Форма cron-редактора, шаг минут из `CronOptions`               | `TimePickerField` |
| Нужна подпись поля (`label`)                                   | `TimePickerField` |
| Нужно авто-округление минут до шага                            | `TimePickerField` |
| Встраивание без подписи, шаг = 1, без авто-исправления `value` | `TimePicker`      |
| Кастомная обёртка (свой layout, своя валидация)                | `TimePicker`      |

В cron-редакторе: `OneTimeSection` — `DateTimePicker`; `DailyFrequencySection` — `TimePickerField`.

---

## Пропсы

### `TimePickerProps`

| Проп               | Тип                               | По умолчанию | Описание                                                   |
| ------------------ | --------------------------------- | ------------ | ---------------------------------------------------------- |
| `value`            | `string \| null`                  | —            | Время `HH:mm` / `HH:mm:ss` или `null` — не выбрано         |
| `onChange`         | `(value: string \| null) => void` | —            | `null` при очистке; строка при полном времени              |
| `disabled`         | `boolean`                         | `false`      | Блокирует ввод и dropdown                                  |
| `minuteStep`       | `number`                          | `1`          | Шаг минут в колонке (и при `snapMinuteToStep` в панели)    |
| `withSeconds`      | `boolean`                         | `false`      | Третья колонка и маска `HH:mm:ss`                          |
| `displayClearIcon` | `boolean`                         | `false`      | Иконка очистки слева от часов (видна при `value !== null`) |
| `showNow`          | `boolean`                         | `false`      | Кнопка «Сейчас» внизу панели (текущее время)               |
| `className`        | `string`                          | —            | На `InputBox`; для `styled(TimePicker)`                  |

### Стилизация через `styled` и mixins

У Admiral **`InputBox` рамка — `box-shadow: inset`**, не `border`.  
Обычный `border: 1px solid red` не перекрывает видимую обводку — используйте mixins.

Экспорт: `inputBoxBorder`, `inputBoxBorderMixin`, `inputBoxJoin`, `TimePickerInputBox`.

| Способ | Когда |
| ------ | ----- |
| `inputBoxBorder(color, options?)` | `styled(TimePicker)` или `styled(TimePickerInputBox)` |
| `inputBoxBorderMixin(color, options?)` | `styled(TimePickerField)` — className на обёртке |
| `inputBoxCss={inputBoxBorder(...)}` | Проп на `TimePicker` без отдельного styled |
| `inputBoxJoin(hide)` | `DateTimePicker`, стыковка полей (тема Admiral, без своего цвета) |

**`InputBoxBorderOptions`:**

| Опция | Описание |
| ----- | -------- |
| `width` | Толщина в px (по умолчанию `1`) |
| `hide` | Массив сторон без рамки: `'top' \| 'right' \| 'bottom' \| 'left'`; у соответствующих углов сбрасывается `border-radius` |

Произвольный `css` в `inputBoxCss` / `styled` — полный контроль над `box-shadow` и радиусами.

```tsx
// Вся рамка
${inputBoxBorder('red')}

// Без левой стороны (стыковка полей)
${inputBoxBorder('green', { hide: ['left'] })}

// Только верх и низ
${inputBoxBorder('blue', { hide: ['left', 'right'] })}

// styled(TimePicker) — className на InputBox
const BorderedTimePicker = styled(TimePicker)`
  ${inputBoxBorder('green', { hide: ['left'] })}
`;

// styled(TimePickerField) — mixin на .time-picker внутри
const BorderedField = styled(TimePickerField)`
  ${inputBoxBorderMixin('red', { hide: ['left'] })}
`;

// styled(TimePickerInputBox) — напрямую на InputBox
const BorderedInputBox = styled(TimePickerInputBox)`
  ${inputBoxBorder('blue', { hide: ['left'] })}
`;

// или проп inputBoxCss на TimePicker
<TimePicker value={time} onChange={setTime} inputBoxCss={inputBoxBorder('green')} />
```


### `TimePickerFieldProps`

Все пропсы `TimePicker` плюс:

| Проп    | Тип      | По умолчанию | Описание                                       |
| ------- | -------- | ------------ | ---------------------------------------------- |
| `label` | `string` | —            | Подпись `Field`; без неё — только `TimePicker` |

---

## Формат значения

| Режим       | Формат     | Пример     | Placeholder |
| ----------- | ---------- | ---------- | ----------- |
| Без секунд  | `HH:mm`    | `09:30`    | `чч:мм`     |
| С секундами | `HH:mm:ss` | `09:30:45` | `чч:мм:сс`  |
| Не выбрано  | `null`     | `null`     | пустое поле |

- `null` — время не задано.
- `''` в `value` трактуется как «нет времени» (совместимость с cron), `onChange` при очистке отдаёт `null`.
- Неполный ввод (`09:3`) не вызывает `onChange` у родителя до завершения маски или `blur` с валидным временем.
- Часы: `00`–`23`, минуты/секунды: `00`–`59`.

---

## `minuteStep`

Шаг минут для колонки и для cron («каждые N минут»).

| `minuteStep` | Минуты в колонке                   |
| ------------ | ---------------------------------- |
| `1`          | `00`…`59`                          |
| `5`          | `00`, `05`, …, `55`                |
| `10`         | `00`, `10`, `20`, `30`, `40`, `50` |
| `15`         | `00`, `15`, `30`, `45`             |

**В `TimePicker`:** колонка показывает только допустимые значения; при открытии панели текущие минуты приводятся к шагу (`snapMinuteToStep`).

**В `TimePickerField`:** дополнительно при монтировании и смене `value` вызывается `normalizeTimeToMinuteStep` — округление до ближайшего кратного:

- `09:07` + `minuteStep={10}` → `09:10`
- `09:03` + `minuteStep={10}` → `09:00`

При `minuteStep <= 1` нормализация не меняет значение.

> В отличие от Ant Design `TimePicker`, здесь есть явная синхронизация исправленного `value` обратно в родителя через `onChange`.

---

## `withSeconds`

По умолчанию выключено (cron работает с точностью до минуты).

```tsx
<TimePickerField value="14:30:00" withSeconds onChange={setTime} />
```

Секунды: колонка `00`–`59`, маска ввода `чч:мм:сс`. Секунды **не** участвуют в `minuteStep` / нормализации минут.

---

## Логика работы

```
                    ┌─────────────────────────────────────┐
  value (string) ──►│ TimePickerField (опционально)       │
                    │  normalizeTimeToMinuteStep          │
                    │  useEffect → onChange если изменилось│
                    └──────────────┬──────────────────────┘
                                   ▼
                    ┌─────────────────────────────────────┐
                    │ TimePicker                          │
                    │  innerValue (локальный ввод)        │
                    ├─────────────────────────────────────┤
                    │ Ввод с клавиатуры                   │
                    │  → timePickerInputHandle (маска)    │
                    │  → onChange при полном HH:mm[:ss]    │
                    ├─────────────────────────────────────┤
                    │ Клик по иконке / полю (не input)    │
                    │  → toggle dropdown                  │
                    ├─────────────────────────────────────┤
                    │ Колонки часов / минут / секунд      │
                    │  → combineTimeString → onChange     │
                    ├─────────────────────────────────────┤
                    │ blur                                │
                    │  → onChange если валидное время     │
                    └─────────────────────────────────────┘
```

### Controlled API

- Родитель хранит `value: string`.
- `TimePicker` дублирует его в `innerValue` для плавного ввода; при смене `value` снаружи — `useEffect` обновляет `innerValue`.

### Маска ввода (`utils.ts`)

`timePickerInputHandle` — порт логики Admiral DS:

- вставляет `:` автоматически;
- валидирует цифры по позиции (часы ≤ 23, минуты/секунды ≤ 59);
- управляет позицией курсора;
- режим `withSeconds` увеличивает целевую длину до 8 символов (`HH:mm:ss`).

### Dropdown

- Колонки без видимых заголовков (только `aria-label` для a11y).
- При открытии выбранный элемент прокручивается в центр (`scrollIntoView`).
- Клик вне — закрытие (`StyledDropdownContainer.onClickOutside`).

---

## Структура папки

```text
TimePicker/
  README.md
  index.ts               # export * TimePicker, TimePickerField
  styles.ts
  TimePicker.tsx
  TimePickerField.tsx
  timeOutline.svg
  components/
    index.ts
    types.ts             # TimeColumnProps
    TimeColumn.tsx
  utils/
    index.ts
    inputHandle.ts       # timePickerInputHandle
    time.ts              # split/combine, normalizeTimeToMinuteStep, …
    timePickerValue.ts   # parseTimeValue, isCompleteTime, …
```

Утилиты времени — `utils/time.ts` (экспорт для `@shared/components/TimePicker/utils/time`):

| Функция                                 | Назначение                                |
| --------------------------------------- | ----------------------------------------- |
| `getHourOptions`                        | `00`–`23` для колонки часов               |
| `getMinuteOptionsForStep`               | минуты с шагом                            |
| `getSecondOptions`                      | `00`–`59` для секунд                      |
| `splitTimeString` / `combineTimeString` | разбор и сборка `HH:mm[:ss]`              |
| `snapMinuteToStep`                      | минуты к шагу (в панели)                  |
| `normalizeTimeToMinuteStep`             | округление (в `TimePickerField`)          |
| `getTimeSlotsForStep`                   | все слоты за сутки (для других сценариев) |

---

## Примеры

### CronEditor — разовый запуск

```tsx
<DateTimePicker
  label={t.editor.date}
  dateValue={oneTimeDate}
  timeValue={oneTimeTime || null}
  minuteStep={options.minuteStep}
  onDateChange={(date) => onChange(setOneTimeDate(value, date))}
  onTimeChange={(time) => onChange(setOneTimeTime(value, time ?? '', minuteStep))}
/>
```

### CronEditor — «один раз в …» (без label)

```tsx
<TimePickerField
  value={onceAtTime}
  disabled={!isOnceDaily}
  minuteStep={options.minuteStep}
  onChange={(time) => onChange(setOnceAtTime(value, time, options.minuteStep))}
/>
```

### Произвольное время с секундами

```tsx
<TimePicker value={time} withSeconds onChange={setTime} />
```

---

## Зависимости

- `@admiral-ds/react-ui` — `InputBox`, `InputLine`, `Field`, `StyledDropdownContainer`, `changeInputData`
- `styled-components` — стили колонок dropdown
- `utils/time.ts` — опции колонок, split/combine, нормализация

Ant Design (`antd`) в проекте **не используется** для TimePicker — только `@ant-design/icons` в других местах.

---

## Доступность

- Колонки: `role="listbox"`, кнопки: `role="option"`, `aria-selected`
- Иконка: `aria-label="Выбрать время"`
- Колонки: `aria-label` «Часы», «Минуты», «Секунды» (без видимых заголовков)
