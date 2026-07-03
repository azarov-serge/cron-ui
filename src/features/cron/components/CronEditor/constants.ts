export const CRON_FORM_ID = 'cron-schedule-form';

export const SCHEDULE_TYPE_OPTIONS = [
  { value: 'recurring', label: 'Повторяющееся' },
  { value: 'one-time', label: 'Однократно' },
] as const;

export const OCCURS_OPTIONS = [
  { value: 'daily', label: 'Ежедневно' },
  { value: 'weekly', label: 'Еженедельно' },
  { value: 'monthly', label: 'Ежемесячно' },
] as const;

export const INTERVAL_UNIT_OPTIONS = [
  { value: 'hours', label: 'часа(ов)' },
  { value: 'minutes', label: 'минут(ы)' },
] as const;

/** Пояснение об отсутствии года в пятичастном cron для однократного расписания */
export const getOneTimeCronYearNotice = (oneTimeDate: string): string => {
  const year = oneTimeDate.split('.')[2]?.trim();
  const yearClause = year
    ? ` Год ${year} виден в описании, но не попадает в cron —`
    : ' Cron не содержит год —';

  return `Пятичастное выражение описывает только день, месяц и время.${yearClause} задача будет запускаться в эту дату каждый год. Для запуска ровно один раз сохраните полную дату отдельно на бэкенде.`;
};
