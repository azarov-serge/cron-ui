import type { CronRequireField } from '../components/CronEditor';

export const MINUTE_STEP_OPTIONS = [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30] as const;

export const DAILY_FREQUENCY_VALUES = ['once', 'every'] as const;

export const REQUIRE_FIELD_VALUES = [
  'weeklyWeekDays',
  'weeklyWeekNumbers',
] as const satisfies readonly CronRequireField[];

