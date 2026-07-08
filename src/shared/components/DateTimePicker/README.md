# DateTimePicker

Компонент даты и времени на базе **Admiral DS** + локального `TimePicker`.

- Дата: `DateTimeDateInput` (календарь Admiral)
- Время: `TimePicker`
- Стык полей: `inputBoxJoin(['left'])` для единой рамки

Экспорт: `@shared/components/DateTimePicker` или `@shared/components`.

---

## Пропсы

| Проп               | Тип                               | По умолчанию | Описание                                              |
| ------------------ | --------------------------------- | ------------ | ----------------------------------------------------- |
| `dateValue`        | `string`                          | —            | Дата в формате Admiral `DateInput` (`DD.MM.YYYY`)     |
| `timeValue`        | `string \| null`                  | —            | Время `HH:mm` / `HH:mm:ss` или `null`                 |
| `onDateChange`     | `(value: string) => void`         | —            | Вызывается при изменении даты                         |
| `onTimeChange`     | `(value: string \| null) => void` | —            | Вызывается при изменении/очистке времени              |
| `label`            | `string`                          | —            | Подпись через `Field`; без него рендер без обертки    |
| `minuteStep`       | `number`                          | `1`          | Шаг минут для `TimePicker`                            |
| `withSeconds`      | `boolean`                         | `false`      | Время с секундами (`HH:mm:ss`)                        |
| `displayClearIcon` | `boolean`                         | `false`      | Иконка очистки времени                                |
| `showNow`          | `boolean`                         | `false`      | Кнопка «Сейчас» в панели времени                      |
| `disabled`         | `boolean`                         | `false`      | Блокирует дату и время                                |
| `readOnly`         | `boolean`                         | `false`      | Readonly для даты; время блокируется через `disabled` |
| `status`           | `InputStatus`                     | —            | Статус Admiral (`error` / `success`)                  |
| `className`        | `string`                          | —            | Класс внешней обертки                                 |

---

## Поведение

- `timeValue` нормализуется через `normalizeTimeToMinuteStep`.
- Если нормализованное значение отличается, компонент вызывает `onTimeChange(...)`.
- Визуально контрол компактный: `DateInput` ~168px, `Time` ~104px.

---

## Примеры

### One-time секция CronEditor

```tsx
<DateTimePicker
  label={t.editor.date}
  dateValue={oneTimeDate}
  timeValue={oneTimeTime || null}
  minuteStep={options.minuteStep}
  onDateChange={(date) => onChange(setOneTimeDate(value, date))}
  onTimeChange={(time) =>
    onChange(setOneTimeTime(value, time ?? '', minuteStep))
  }
/>
```

### Без подписи

```tsx
<DateTimePicker
  dateValue={date}
  timeValue={time}
  onDateChange={setDate}
  onTimeChange={setTime}
/>
```

---

## Структура

```text
DateTimePicker/
  DateTimePicker.tsx
  styles.ts
  index.ts
  README.md
```
