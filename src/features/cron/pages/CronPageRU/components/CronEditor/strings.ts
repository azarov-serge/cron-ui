import type { WeekDayKey } from './utils';
import { formatMessage } from '../../utils/formatMessage';

export const EDITOR_STRINGS = {
  intervalMinutes: 'от {min} до {max} минут',
  intervalHours: 'от {min} до {max} часов',
  pickWeekDay: 'Выберите хотя бы один день недели',
  pickWeekNumber: 'Выберите хотя бы одну неделю месяца',
} as const;

export type EditorStrings = typeof EDITOR_STRINGS;

export const SCHEDULE_TYPE_LABELS = {
  recurring: 'Повторяющееся',
  'one-time': 'Однократно',
} as const;

export const OCCURS_LABELS = {
  daily: 'Ежедневно',
  weekly: 'Еженедельно',
  monthly: 'Ежемесячно',
} as const;

export const WEEK_DAYS_LABELS: Record<WeekDayKey, string> = {
  monday: 'Понедельник',
  tuesday: 'Вторник',
  wednesday: 'Среда',
  thursday: 'Четверг',
  friday: 'Пятница',
  saturday: 'Суббота',
  sunday: 'Воскресенье',
};

export const WEEK_NUMBERS_LABELS = {
  1: '1-я',
  2: '2-я',
  3: '3-я',
  4: '4-я',
  5: '5-я',
} as const;

export const INTERVAL_UNIT_LABELS = {
  hours: 'часа(ов)',
  minutes: 'минут(ы)',
} as const;

export const getOneTimeYearNoticeRu = (oneTimeDate: string): string => {
  const year = oneTimeDate.split('.')[2]?.trim();

  if (year) {
    return formatMessage(
      'Пятичастное выражение описывает только день, месяц и время. Год {year} виден в описании, но не попадает в cron — задача будет запускаться в эту дату каждый год. Для запуска ровно один раз сохраните полную дату отдельно на бэкенде.',
      { year },
    );
  }

  return 'Пятичастное выражение описывает только день, месяц и время. Cron не содержит год — задача будет запускаться в эту дату каждый год. Для запуска ровно один раз сохраните полную дату отдельно на бэкенде.';
};
