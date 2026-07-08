export type CronInterface = {
  minute: string;
  hour: string;
  dayOfWeek: string | null;
  month: string | null;
  dayOfMonth: string | null;
};

/** Формат cron с бэкенда */
export type CronResponse = {
  minute: string;
  hour: string;
  day_of_week: string | null;
  day_of_month: string | null;
  month_of_year: string | null;
};

export type CronToStringOptions = {
  locale?: string;
  throwExceptionOnParseError?: boolean;
  use24HourTimeFormat?: boolean;
};

/** Параметры cronstrue для русского описания расписания */
export const CRON_RU_TO_STRING_OPTIONS: CronToStringOptions = {
  locale: 'ru',
  throwExceptionOnParseError: false,
  use24HourTimeFormat: true,
};
