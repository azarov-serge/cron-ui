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
  { value: 'hours', label: 'hours' },
  { value: 'minutes', label: 'minutes' },
] as const;
