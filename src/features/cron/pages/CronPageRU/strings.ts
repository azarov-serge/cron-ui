export const CRON_PAGE_RU_STRINGS = {
  pageTitle: 'Расписание заданий',
  pageDescription:
    'Генератор и конструктор расписания crontab — визуальный редактор пятичастных cron-выражений.',
  tabs: {
    constructor: 'Конструктор cron',
    checker: 'Проверка cron',
    editorParams: 'Параметры редактора',
  },
  urlError: {
    title: 'Некорректный cron в адресе',
    defaultUsed: 'Используется расписание по умолчанию',
  },
  help: {
    title: 'Как пользоваться',
    step1:
      'Редактор cron ниже показывает текущее расписание. Изменения применяются сразу при редактировании полей.',
    step2:
      'На вкладке «Параметры редактора» настройте, какие поля будут в форме.',
    step3:
      'Cron сразу попадает в адрес страницы, а описание обновляется в редакторе.',
    step4:
      'Чтобы разобрать готовое выражение, перейдите на вкладку «Проверка cron».',
  },
  editCron: 'Редактор cron',
  editorParams: 'Параметры редактора',
  editorParamsHint:
    'Настройки применяются к форме на вкладке «Конструктор cron».',
  scheduleType: 'Тип расписания',
  occursFrequency: 'Частота (выполняется)',
  dailyFrequency: 'Ежедневная частота',
  weeklySection: 'Еженедельно',
  showMonthWeeks: 'Показывать недели месяца (1–5)',
  oneTimeSection: 'Однократно',
  showYearNotice: 'Предупреждение «Год не входит в cron»',
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
} as const;

export type CronPageRUStrings = typeof CRON_PAGE_RU_STRINGS;

