# cron-ui

Демо-приложение и UI-библиотека для редактирования и проверки cron-расписаний в стиле SQL Server Agent (SSMS).

**Версия приложения:** `1.0.5` (в UI — в шапке рядом с логотипом)

**Демо:** https://azarov-serge.github.io/cron-ui/

## Компоненты

| Что           | Путь                                                                                               |
| ------------- | -------------------------------------------------------------------------------------------------- |
| `Header`      | `src/shared/components/Header/` — логотип, версия, язык RU/EN, переключатель темы                  |
| `CronEditor`  | `src/features/cron/components/CronEditor/`                                                         |
| `CronChecker` | `src/features/cron/components/CronChecker/`                                                        |
| `CronPage`    | `src/features/cron/pages/CronPage.tsx`                                                             |
| `TimePicker`  | `src/shared/components/TimePicker/`                                                                |
| ТЗ            | [`src/features/cron/components/CronEditor/SRS.md`](src/features/cron/components/CronEditor/SRS.md) |

## Структура проекта

```text
src/
├── App.tsx                  # Shell + Layout (max-width 1920px, рамка)
├── features/cron/
│   ├── components/
│   │   ├── CronEditor/      # форма расписания, модели cron/schedule
│   │   └── CronChecker/     # вставка cron → расшифровка полей
│   ├── hooks/               # синхронизация CronPage с URL
│   ├── pages/CronPage.tsx   # вкладки «Конструктор» и «Проверка»
│   └── utils/               # parseCronExpression, query-параметры
└── shared/
    ├── components/
    │   ├── Header/
    │   └── TimePicker/
    ├── constants/layout.ts  # LAYOUT_MAX_WIDTH_PX = 1920
    ├── i18n/                # messages RU/EN, useTranslation
    └── providers/           # AppThemeProvider, LocaleProvider
```

Алиасы: `@features/*`, `@shared/*` (`tsconfig.app.json`, `vite.config.ts`).

## Запуск

```bash
npm install
npm run dev
```

Сборка:

```bash
npm run build
```

Локальная проверка сборки под GitHub Pages:

```bash
npm run preview
```

## Публикация

**Демо:** https://azarov-serge.github.io/cron-ui/

Сайт деплоится через GitHub Actions (`.github/workflows/deploy.yml`) при push в `main`.  
В `vite.config.ts` задан `base: '/cron-ui/'` для production-сборки и `'/'` для `npm run dev`.  
Локальная разработка: `npm run dev` → https://localhost:5173/ (самоподписанный сертификат — в браузере подтвердите исключение).

### Настройка GitHub Pages (один раз)

1. Откройте **Settings → Pages**: https://github.com/azarov-serge/cron-ui/settings/pages
2. **Build and deployment → Source** → выберите **GitHub Actions**
3. Дождитесь зелёного workflow **Deploy to GitHub Pages** в **Actions**

Проверка: в исходном коде страницы должен быть `<script ... src="/cron-ui/assets/...">`, а не `/src/main.tsx`.

## Версионирование

| Источник                   | Назначение                                                            |
| -------------------------- | --------------------------------------------------------------------- |
| `package.json` → `version` | **Единственный номер версии приложения** — UI, релизы npm/GitHub      |
| `CHANGELOG.md`             | Опционально: человекочитаемые release notes при публичных релизах     |
| Версия в SRS ниже          | Не ведётся отдельно — актуальность сверяется с кодом и `package.json` |

**Имеет ли смысл дублировать версию в документации?**  
Нет — отдельный номер вроде «SRS 1.5» быстро расходится с `package.json`. Достаточно:

1. поднимать `version` в `package.json` при релизе;
2. при необходимости — краткий `CHANGELOG.md` или GitHub Release с тем же тегом (`v1.0.5`);
3. в SRS описывать поведение без собственной нумерации.

Для внутреннего демо без внешних потребителей changelog не обязателен.

## Зависимости

- `@admiral-ds/react-ui` — UI-компоненты (`DropdownProvider`, `MenuButton`, `Toggle` в `main.tsx` / `Header`)
- `@admiral-ds/icons` — иконки темы и копирования
- `@ant-design/icons` — иконка редактирования на `CronPage`
- `@vitejs/plugin-basic-ssl` — HTTPS для `npm run dev` (`https://localhost:5173`)
- `cronstrue` — человекочитаемое описание расписания (RU/EN)
- `styled-components`

---

# SRS: CronEditor, CronChecker и CronPage

**Статус:** сверено с реализацией (версия приложения — `package.json`)  
**Компоненты:** `CronEditor`, `CronChecker`, `CronPage`, `TimePicker`

## 1. Назначение

**`CronEditor`** — форма редактирования расписания в стиле SQL Server Agent (SSMS). На входе и выходе — пятичастное cron-выражение (без секунд). Компонент не привязан к конкретному API: интеграция с бэкендом — задача вызывающего кода.

**`CronPage`** — демо и песочница с двумя вкладками:

- **Конструктор cron** — карточка расписания, настройка `CronOptions`, `CronEditor` в модалке;
- **Проверка cron** — вставка выражения и расшифровка (`CronChecker`).

Состояние синхронизируется с URL: `?cron=0+9+*+*+1`, `?tab=checker`. Сохраняется только **`cron`** (объект `Cron`).

## 2. Контракт с бэкендом

### 2.1. Что приходит с бэкенда

Расписание — **строка** `минута час день_месяца месяц день_недели` или объект в snake_case (`CronResponse` — справочный тип полей).

| Поле            | Тип              | Описание                                    |
| --------------- | ---------------- | ------------------------------------------- |
| `minute`        | `string`         | 0–59, `*`, `*/N`                            |
| `hour`          | `string`         | 0–23, `*`, `*/N`                            |
| `day_of_month`  | `string \| null` | 1–31 или `null` → `*`                       |
| `month_of_year` | `string \| null` | 1–12 или `null` → `*`                       |
| `day_of_week`   | `string \| null` | 0–6, списки, `день#неделя` или `null` → `*` |

В коде: `Cron.fromString(expression)`. Невалидная строка (не 5 частей) в редакторе заменяется на дефолт `0 9 * * *`; в `CronChecker` — ошибка разбора.

Примеры:

```text
0 9 * * 1        — по понедельникам в 09:00
0 9 * * 1#1      — пн в 1-ю неделю месяца, 09:00
0 9 15 * *       — 15-го числа в 09:00
30 14 25 3 *     — 3 июля в 14:30 (без года в cron)
*/10 * * * *     — каждые 10 минут
```

### 2.2. Рекомендуемая сущность API

```ts
type ScheduleEntity = {
  id: string;
  name: string;
  enabled: boolean;
  cron_expression: string; // cron.toExpression()
};
```

`CronPage` **не сохраняет** `name` и `enabled` — только демонстрирует редактирование `cron`. Метаданные — задача вызывающего кода.

`CronOptions` на бэкенд **не сохраняются**.

### 2.3. Что уходит на бэкенд

При submit `CronEditor` вызывает `onSubmit(cron)`. Сериализация: **`cron.toExpression()`**.

```json
{
  "cron_expression": "0 9 * * 1"
}
```

На `CronPage` после submit обновляется объект `Cron` и query-параметр `cron` в адресе.

## 3. CronEditor

### 3.1. Пропсы

| Свойство   | Тип                    | Описание                                                                |
| ---------- | ---------------------- | ----------------------------------------------------------------------- |
| `cron`     | `Cron`                 | Начальное расписание; без пропа — `0 9 * * *` (ежедневно 09:00 в форме) |
| `onSubmit` | `(cron: Cron) => void` | Успешная отправка формы                                                 |
| `options`  | `CronOptions`          | Ограничения UI и валидации                                              |

Форма: `<form id="cron-schedule-form">`. Кнопку submit можно вынести наружу: `form="cron-schedule-form"`.

При смене `cron` снаружи — сброс через `key={cron.toExpression()}`.

### 3.2. CronOptions

| Параметр            | По умолчанию                 | Поведение                                                |
| ------------------- | ---------------------------- | -------------------------------------------------------- |
| `scheduleTypes`     | `recurring`, `one-time`      | Один элемент — блок «Тип расписания» скрыт               |
| `occursFrequencies` | `daily`, `weekly`, `monthly` | Один элемент — список «Выполняется» скрыт                |
| `dailyFrequencies`  | `once`, `every`              | Один элемент — радиокнопки «Ежедневная частота» скрыты   |
| `minuteStep`        | `1`                          | Шаг минут в полях времени и в «каждые N минут»           |
| `weeklyWeekNumbers` | `false`                      | Чекбоксы недель месяца (1–5) для еженедельного режима    |
| `requires`          | `[]`                         | Обязательные поля: `weeklyWeekDays`, `weeklyWeekNumbers` |

Допустимые `minuteStep`: `1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30`.

При изменении `options` форма автоматически приводится к разрешённым значениям. При включении недель месяца без выбора — по умолчанию **1-я неделя**.

### 3.3. Секции формы

1. **Тип расписания** — повторяющееся / однократно
2. **Однократное выполнение** — дата `DD.MM.YYYY`, время
3. **Частота** — ежедневно / еженедельно / ежемесячно
   - дни недели; при `weeklyWeekNumbers` — недели месяца (1–5)
   - ежемесячно — день месяца (1–31)
4. **Ежедневная частота** — один раз в (время) / каждые N минут или часов
5. **cron** — сырое выражение; **Описание** — текст на русском

Время: `TimePickerField` из `@shared/components/TimePicker` — колонки «Часы» / «Мин.» и ввод `HH:mm`.

При типе **«Однократно»** показывается предупреждение: год есть в UI, но не входит в пятичастное cron.

### 3.4. Модель Cron

| Метод                             | Назначение                 |
| --------------------------------- | -------------------------- |
| `Cron.createEmpty()`              | Дефолт `0 9 * * *`         |
| `Cron.fromString(expr)`           | Разбор строки (5 полей)    |
| `cron.toExpression()`             | Строка для API             |
| `cron.toString({ locale: 'ru' })` | Описание через cronstrue   |
| `cron.clone(patch)`               | Копия с изменёнными полями |

`ScheduleModel` использует `clone()` для иммутабельных обновлений формы.

### 3.5. Соответствие UI → cron

| Настройка                   | Выражение      |
| --------------------------- | -------------- |
| Ежедневно, 09:00            | `0 9 * * *`    |
| Еженедельно, пн, 09:00      | `0 9 * * 1`    |
| Еженедельно, пн, 1-я неделя | `0 9 * * 1#1`  |
| Ежемесячно, 15-е, 09:00     | `0 9 15 * *`   |
| Каждые 10 минут             | `*/10 * * * *` |
| Каждые 2 часа               | `0 */2 * * *`  |
| Однократно 25.03, 14:30     | `30 14 25 3 *` |

Дни недели в cron: 0 = вс, 1 = пн, …, 6 = сб.

Еженедельно с неделями месяца: нотация `день#неделя` (напр. `1#1,3#2`). Без выбранных дней → `*`; без выбранных недель при включённой опции → обычный weekly.

### 3.6. Валидация

Submit блокируется, если:

| Условие                                   | Сообщение                             |
| ----------------------------------------- | ------------------------------------- |
| `requires: weeklyWeekDays`, нет дней      | «Выберите хотя бы один день недели»   |
| `requires: weeklyWeekNumbers`, нет недель | «Выберите хотя бы одну неделю месяца» |
| Интервал вне диапазона                    | «от N до M минут/часов»               |

`one-time` — без проверок recurring-полей. Интервал: минуты `minuteStep`…59 (кратно шагу), часы 1…23.

### 3.7. Ограничения UI

- Нельзя собрать `* * * * *`, «каждые 100 минут», составные интервалы.
- Сложные cron при загрузке могут упроститься в представлении формы.
- Год однократного расписания в UI — в дате; в cron не входит (см. предупреждение в форме).

## 4. CronChecker

Вкладка **«Проверка cron»** на `CronPage` или отдельный компонент.

1. Поле ввода — пятичастное выражение.
2. Таблица полей: минута, час, день месяца, месяц, день недели + подсказка.
3. **Описание (cronstrue)** — текст на русском.
4. **Расписание (редактор)** — интерпретация через `ScheduleModel`.
5. При однократном расписании — предупреждение про отсутствие года.
6. При ошибке — `NotificationItem` с текстом ошибки.

Разбор: `parseCronExpression()` в `src/features/cron/utils/parseCronExpression.ts`.

## 5. CronPage

### 5.1. Оболочка и шапка

- **Layout:** контейнер `1920px` по центру, рамка `1px` (`LAYOUT_MAX_WIDTH_PX`)
- **Header:** логотип `cron`, версия из `package.json`, `MenuButton` RU/EN, переключатель светлой/тёмной темы (по умолчанию — системная)
- **i18n:** `src/shared/i18n/messages.ts`, выбор языка в `localStorage` (`cron-ui-locale`)

### 5.2. Вкладки и URL

| Вкладка          | `tab` в URL      | Содержимое                                      |
| ---------------- | ---------------- | ----------------------------------------------- |
| Конструктор cron | _(по умолчанию)_ | карточка, параметры редактора, редактор         |
| Проверка cron    | `checker`        | `CronChecker`                                   |

Query-параметры:

- `cron` — выражение; при открытии подставляется в конструктор или проверку;
- `tab=checker` — открыть вкладку проверки.

Пример: `/cron-ui/?tab=checker&cron=0+9+*+*+1`

### 5.3. Состояние

| Состояние           | Назначение                                                   |
| ------------------- | ------------------------------------------------------------ |
| `cron`              | Текущее расписание (карточка + начальное значение редактора) |
| `checkerExpression` | Выражение на вкладке проверки                                |
| `editorOptions`     | `CronOptions` для `CronEditor`                               |
| `isEditorOpen`      | Открыт ли редактор (модалка на desktop, inline на mobile)    |

### 5.4. Карточка

- Описание: `cron.toString({ locale })` — RU/EN по выбранному языку
- Выражение: `cron.toExpression()` (моноширинный блок)
- Кнопка копирования cron-выражения в буфер обмена
- Кнопка «Изменить расписание» → модалка (desktop) или inline-панель (mobile)

### 5.5. Панель «Параметры редактора»

| UI                 | Поле `editorOptions` |
| ------------------ | -------------------- |
| Тип расписания     | `scheduleTypes`      |
| Частота            | `occursFrequencies`  |
| Ежедневная частота | `dailyFrequencies`   |
| Недели месяца      | `weeklyWeekNumbers`  |
| Шаг минут          | `minuteStep`         |

Минимум один пункт в каждой группе чекбоксов всегда выбран.

### 5.6. Панель «Обязательные поля»

| Чекбокс                   | `requires`                                            |
| ------------------------- | ----------------------------------------------------- |
| Дни недели обязательны    | `weeklyWeekDays`                                      |
| Недели месяца обязательны | `weeklyWeekNumbers` (disabled, если недели выключены) |

### 5.7. Редактор расписания

- Desktop: модалка с `CronEditor`
- Mobile: inline-панель под карточкой
- Только `CronEditor` (`key={cron.toExpression()}`, `cron`, `options={editorOptions}`, `onSubmit`)
- «Сохранить» → `requestSubmit()` формы `cron-schedule-form`
- Заголовок: «Редактор расписания»

При успешном submit: `setCron(nextCron)`, закрытие редактора.

### 5.8. Использование вне демо

В продукте `CronOptions` задаётся кодом, без панелей `CronPage`:

```tsx
import {
  CronEditor,
  DEFAULT_CRON_OPTIONS,
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

## 6. Сценарии приёмки

**CronEditor**

1. Загрузка `cron` корректно заполняет форму.
2. Submit отдаёт cron, совпадающий с блоком «cron» на форме.
3. Сужение `options` скрывает секции и сбрасывает недопустимые значения.
4. `weeklyWeekNumbers: true` — недели видны; при первом включении выбрана 1-я.
5. `requires` блокирует submit с сообщением.
6. `minuteStep` ограничивает время и интервал в минутах.
7. Submit снаружи через `form="cron-schedule-form"`.

**CronChecker**

8. Валидное выражение — таблица полей и два описания.
9. Невалидное — сообщение об ошибке, без расшифровки.
10. Однократное расписание — предупреждение про год.

**CronPage**

11. Вкладки переключают конструктор и проверку.
12. `?cron=` в URL восстанавливает выражение; некорректный `cron` — уведомление.
13. Панели меняют поведение `CronEditor` в редакторе без перезагрузки.
14. Карточка показывает описание и выражение; после submit они обновляются.
15. Редактор содержит только `CronEditor`, без дополнительных полей.
16. Header: версия, RU/EN, переключение темы; layout 1920px с рамкой.
