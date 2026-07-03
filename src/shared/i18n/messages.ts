export type Locale = 'ru' | 'en';

export const messages = {
  ru: {
    pageTitle: 'Расписание заданий',
    tabs: {
      constructor: 'Конструктор cron',
      checker: 'Проверка cron',
    },
    urlError: {
      title: 'Некорректный cron в адресе',
      defaultUsed: 'Используется расписание по умолчанию',
    },
    help: {
      title: 'Как пользоваться',
      step1:
        'Карточка ниже показывает текущее расписание. Сама по себе она не меняется.',
      step2:
        'Чекбоксы «Параметры редактора» настраивают форму — какие поля будут в редакторе.',
      step3:
        'Нажмите «Изменить расписание», заполните форму и сохраните — карточка обновится.',
      step4:
        'Чтобы разобрать готовое выражение, перейдите на вкладку «Проверка cron».',
    },
    editSchedule: 'Изменить расписание',
    editorOpenBelow: 'Редактор открыт ниже',
    editorTitle: 'Редактор расписания',
    saveSchedule: 'Сохранить расписание',
    cancel: 'Отмена',
    copyCron: 'Копировать cron-выражение',
    editorParams: 'Параметры редактора',
    editorParamsHint:
      'Влияют только на форму редактора. Чтобы применить расписание, откройте «Изменить расписание» и нажмите «Сохранить».',
    scheduleType: 'Тип расписания',
    occursFrequency: 'Частота (выполняется)',
    dailyFrequency: 'Ежедневная частота',
    weeklySection: 'Еженедельно',
    showMonthWeeks: 'Показывать недели месяца (1–5)',
    minuteStep: 'Шаг минут',
    minuteStepHint: 'Делители 60: TimePicker и интервал «каждые N минут»',
    requiredFields: 'Обязательные поля',
    requiredFieldsHint:
      'Пустой список — все поля необязательны при сохранении расписания',
    scheduleTypes: {
      recurring: 'Повторяющееся',
      'one-time': 'Однократно',
    },
    occurs: {
      daily: 'Ежедневно',
      weekly: 'Еженедельно',
      monthly: 'Ежемесячно',
    },
    dailyFrequencies: {
      once: 'Один раз в день',
      every: 'Каждые N минут/часов',
    },
    requireFields: {
      weeklyWeekDays: 'Дни недели обязательны',
      weeklyWeekNumbers: 'Недели месяца обязательны',
    },
    theme: {
      light: 'Светлая тема',
      dark: 'Тёмная тема',
    },
    language: {
      ru: 'Русский',
      en: 'English',
    },
    checker: {
      hint: 'Вставьте пятичастное выражение: минута час день_месяца месяц день_недели',
      placeholderExample: 'Например: 0 9 * * 1 — по понедельникам в 09:00',
      parseError: 'Ошибка разбора',
      field: 'Поле',
      value: 'Значение',
      meaning: 'Расшифровка',
    },
  },
  en: {
    pageTitle: 'Job schedule',
    tabs: {
      constructor: 'Cron builder',
      checker: 'Cron checker',
    },
    urlError: {
      title: 'Invalid cron in URL',
      defaultUsed: 'Using default schedule',
    },
    help: {
      title: 'How to use',
      step1:
        'The card below shows the current schedule. It does not change on its own.',
      step2:
        'Editor parameters checkboxes configure which fields appear in the editor form.',
      step3:
        'Click «Change schedule», fill in the form and save — the card will update.',
      step4: 'To parse an expression, open the «Cron checker» tab.',
    },
    editSchedule: 'Change schedule',
    editorOpenBelow: 'Editor open below',
    editorTitle: 'Schedule editor',
    saveSchedule: 'Save schedule',
    cancel: 'Cancel',
    copyCron: 'Copy cron expression',
    editorParams: 'Editor parameters',
    editorParamsHint:
      'Affect only the editor form. To apply a schedule, open «Change schedule» and click «Save».',
    scheduleType: 'Schedule type',
    occursFrequency: 'Frequency (occurs)',
    dailyFrequency: 'Daily frequency',
    weeklySection: 'Weekly',
    showMonthWeeks: 'Show weeks of month (1–5)',
    minuteStep: 'Minute step',
    minuteStepHint: 'Divisors of 60: TimePicker and «every N minutes» interval',
    requiredFields: 'Required fields',
    requiredFieldsHint: 'Empty list — all fields are optional when saving',
    scheduleTypes: {
      recurring: 'Recurring',
      'one-time': 'One-time',
    },
    occurs: {
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly',
    },
    dailyFrequencies: {
      once: 'Once a day',
      every: 'Every N minutes/hours',
    },
    requireFields: {
      weeklyWeekDays: 'Week days required',
      weeklyWeekNumbers: 'Weeks of month required',
    },
    theme: {
      light: 'Light theme',
      dark: 'Dark theme',
    },
    language: {
      ru: 'Russian',
      en: 'English',
    },
    checker: {
      hint: 'Paste a five-part expression: minute hour day_of_month month day_of_week',
      placeholderExample: 'Example: 0 9 * * 1 — Mondays at 09:00',
      parseError: 'Parse error',
      field: 'Field',
      value: 'Value',
      meaning: 'Meaning',
    },
  },
} as const;

export type Messages = (typeof messages)[Locale];
