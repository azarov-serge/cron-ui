import type {
  DailyFrequencyType,
  OccursFrequency,
  ScheduleType,
} from '../models/schedule/types';

/** Поля формы, которые можно сделать обязательными */
export type CronRequireField = 'weeklyWeekDays' | 'weeklyWeekNumbers';

const ALLOWED_REQUIRE_FIELDS: CronRequireField[] = [
  'weeklyWeekDays',
  'weeklyWeekNumbers',
];

export interface CronOptions {
  /** Конфигурация редактора: UI через useCronEditorConfig; поля модели — через schedule.clone() в store */
  /** Доступные типы расписания. Один элемент — блок выбора скрыт */
  scheduleTypes?: ScheduleType[];
  /** Доступные значения «Частота» (Выполняется). Один элемент — выбор скрыт */
  occursFrequencies?: OccursFrequency[];
  /** Доступные значения «Ежедневная частота». Один элемент — выбор скрыт */
  dailyFrequencies?: DailyFrequencyType[];
  /** Шаг минут в TimePicker и мин. интервал «каждые N минут». По умолчанию 1 */
  minuteStep?: number;
  /** Показывать выбор недель месяца (1–5) для еженедельного расписания; без выбора — каждую неделю */
  weeklyWeekNumbers?: boolean;
  /** Обязательные поля (пустой массив — всё необязательно) */
  requires?: CronRequireField[];
}

export const DEFAULT_CRON_OPTIONS: Required<CronOptions> = {
  scheduleTypes: ['recurring', 'one-time'],
  occursFrequencies: ['daily', 'weekly', 'monthly'],
  dailyFrequencies: ['once', 'every'],
  minuteStep: 1,
  weeklyWeekNumbers: false,
  requires: [],
};

/** Проверяет, помечено ли поле как обязательное */
export const isCronFieldRequired = (
  requires: readonly CronRequireField[],
  field: CronRequireField,
): boolean => requires.includes(field);

const normalizeRequires = (
  requires?: CronRequireField[],
): CronRequireField[] => {
  if (!requires?.length) {
    return [];
  }

  const uniqueFields = new Set<CronRequireField>();
  requires.forEach((field) => {
    if (ALLOWED_REQUIRE_FIELDS.includes(field)) {
      uniqueFields.add(field);
    }
  });

  return ALLOWED_REQUIRE_FIELDS.filter((field) => uniqueFields.has(field));
};

/** Шаг минут делит 60 без остатка (допустимы 1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30) */
const isValidMinuteStep = (step: number): boolean =>
  Number.isInteger(step) && step >= 1 && step <= 59 && 60 % step === 0;

/** Нормализует частичные CronOptions: подставляет значения по умолчанию и отбрасывает невалидные */
export const resolveCronOptions = (
  options?: CronOptions,
): Required<CronOptions> => {
  const minuteStep = options?.minuteStep ?? DEFAULT_CRON_OPTIONS.minuteStep;
  const scheduleTypes =
    options?.scheduleTypes ?? DEFAULT_CRON_OPTIONS.scheduleTypes;

  const occursFrequencies =
    options?.occursFrequencies ?? DEFAULT_CRON_OPTIONS.occursFrequencies;

  const dailyFrequencies =
    options?.dailyFrequencies ?? DEFAULT_CRON_OPTIONS.dailyFrequencies;

  const weeklyWeekNumbers =
    options?.weeklyWeekNumbers ?? DEFAULT_CRON_OPTIONS.weeklyWeekNumbers;

  let requires = normalizeRequires(options?.requires);

  if (!weeklyWeekNumbers) {
    requires = requires.filter((field) => field !== 'weeklyWeekNumbers');
  }

  return {
    scheduleTypes:
      scheduleTypes.length > 0
        ? scheduleTypes
        : DEFAULT_CRON_OPTIONS.scheduleTypes,
    occursFrequencies:
      occursFrequencies.length > 0
        ? occursFrequencies
        : DEFAULT_CRON_OPTIONS.occursFrequencies,
    dailyFrequencies:
      dailyFrequencies.length > 0
        ? dailyFrequencies
        : DEFAULT_CRON_OPTIONS.dailyFrequencies,
    minuteStep: isValidMinuteStep(minuteStep)
      ? minuteStep
      : DEFAULT_CRON_OPTIONS.minuteStep,
    weeklyWeekNumbers,
    requires,
  };
};
