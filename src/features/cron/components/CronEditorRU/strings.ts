export const editorStrings = {
  scheduleTypeLegend: 'Тип расписания',
  oneTimeSection: 'Однократное выполнение',
  date: 'Дата',
  time: 'Время',
  yearNotInCronTitle: 'Год не входит в cron',
  oneTimeYearNoticeWithYear:
    'Пятичастное выражение описывает только день, месяц и время. Год {year} виден в описании, но не попадает в cron — задача будет запускаться в эту дату каждый год. Для запуска ровно один раз сохраните полную дату отдельно на бэкенде.',
  oneTimeYearNoticeWithoutYear:
    'Пятичастное выражение описывает только день, месяц и время. Cron не содержит год — задача будет запускаться в эту дату каждый год. Для запуска ровно один раз сохраните полную дату отдельно на бэкенде.',
  frequency: 'Частота',
  occurs: 'Выполняется',
  day: 'День',
  ofMonth: 'месяца',
  weekDays: 'Дни недели',
  weekDaysOptional: 'Дни недели (необязательно)',
  weekNumbers: 'Недели месяца',
  weekNumbersOptional: 'Недели месяца (необязательно)',
  weekNumberSuffix: 'неделя',
  pickWeekDay: 'Выберите хотя бы один день недели',
  pickWeekNumber: 'Выберите хотя бы одну неделю месяца',
  weekDaysEmptyHint: 'Если ничего не выбрано — каждый день недели',
  weekNumbersEmptyHint: 'Если ничего не выбрано — запуск каждую неделю',
  dailyFrequency: 'Ежедневная частота',
  onceAt: 'Выполняется один раз в',
  every: 'Выполняется каждые',
  cronLegend: 'cron',
  descriptionLegend: 'Описание',
  intervalMinutes: 'от {min} до {max} минут',
  intervalHours: 'от {min} до {max} часов',
  oneTimeDescription: 'Выполняется один раз {date} в {time}.',
  weekDaysLabels: {
    monday: 'Понедельник',
    tuesday: 'Вторник',
    wednesday: 'Среда',
    thursday: 'Четверг',
    friday: 'Пятница',
    saturday: 'Суббота',
    sunday: 'Воскресенье',
  },
  weekNumbersLabels: {
    1: '1-я',
    2: '2-я',
    3: '3-я',
    4: '4-я',
    5: '5-я',
  },
  intervalUnits: {
    hours: 'часа(ов)',
    minutes: 'минут(ы)',
  },
} as const;

export type EditorStrings = typeof editorStrings;

export const scheduleTypeLabels = {
  recurring: 'Повторяющееся',
  'one-time': 'Однократно',
} as const;

export const occursLabels = {
  daily: 'Ежедневно',
  weekly: 'Еженедельно',
  monthly: 'Ежемесячно',
} as const;

export const copyCron = 'Копировать cron-выражение';
export const copyCronShort = 'Копировать';

export const formatMessage = (
  template: string,
  values: Record<string, string | number>,
): string =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''));

export const getOneTimeYearNotice = (oneTimeDate: string): string => {
  const year = oneTimeDate.split('.')[2]?.trim();
  return year
    ? formatMessage(editorStrings.oneTimeYearNoticeWithYear, { year })
    : editorStrings.oneTimeYearNoticeWithoutYear;
};
