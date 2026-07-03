import {
  clampCronInterval,
  CRON_HOUR_INTERVAL_MAX,
  getAlignedMinuteIntervalMax,
} from './models/schedule/utils';
import { ScheduleModel } from './models/schedule';
import type { IntervalUnit } from './models/schedule/types';
import { WEEK_NUMBER_KEYS } from './models/schedule/types';
import type { CronOptions } from './options';
import { isCronFieldRequired } from './options';

export type ValidateScheduleOptions = Pick<CronOptions, 'requires' | 'weeklyWeekNumbers'>;

/** Минимум, максимум и шаг для поля «каждые N минут/часов» с учётом minuteStep */
export const getEveryIntervalLimits = (
  unit: IntervalUnit,
  minuteStep: number,
) => ({
  min: unit === 'minutes' ? Math.max(1, minuteStep) : 1,
  max:
    unit === 'minutes'
      ? getAlignedMinuteIntervalMax(minuteStep)
      : CRON_HOUR_INTERVAL_MAX,
  step: unit === 'minutes' ? minuteStep : 1,
});

/** Ограничивает и выравнивает интервал по шагу минут (для единицы «минуты») */
export const normalizeEveryInterval = (
  interval: number,
  unit: IntervalUnit,
  minuteStep: number,
): number => {
  const { min, max, step } = getEveryIntervalLimits(unit, minuteStep);
  let value = clampCronInterval(interval, unit);

  if (unit === 'minutes' && step > 1) {
    value = Math.round(value / step) * step;
    value = Math.min(max, Math.max(min, value));
  }

  return value;
};

/** Текст подсказки под полем интервала: «от N до M минут/часов» */
export const getEveryIntervalHint = (
  unit: IntervalUnit,
  minuteStep: number,
): string => {
  const { min, max } = getEveryIntervalLimits(unit, minuteStep);
  return unit === 'minutes'
    ? `от ${min} до ${max} минут`
    : `от ${min} до ${max} часов`;
};

/** Проверяет расписание перед отправкой формы */
export const validateSchedule = (
  schedule: ScheduleModel,
  minuteStep: number,
  editorOptions: ValidateScheduleOptions = {},
): { valid: boolean; message: string | null } => {
  const requireFields = editorOptions.requires ?? [];
  const weeklyWeekNumbersEnabled =
    editorOptions.weeklyWeekNumbers ?? false;

  if (schedule.scheduleType !== 'recurring') {
    return { valid: true, message: null };
  }

  if (schedule.occurs === 'weekly') {
    const hasDay = Object.values(schedule.weekDays).some(Boolean);
    if (isCronFieldRequired(requireFields, 'weeklyWeekDays') && !hasDay) {
      return {
        valid: false,
        message: 'Выберите хотя бы один день недели',
      };
    }

    if (weeklyWeekNumbersEnabled && schedule.useMonthWeekNumbers) {
      const hasWeek = WEEK_NUMBER_KEYS.some((week) => schedule.weekNumbers[week]);
      if (
        isCronFieldRequired(requireFields, 'weeklyWeekNumbers') &&
        !hasWeek
      ) {
        return {
          valid: false,
          message: 'Выберите хотя бы одну неделю месяца',
        };
      }
    }
  }

  if (schedule.dailyFrequency === 'every') {
    const { min, max } = getEveryIntervalLimits(schedule.everyUnit, minuteStep);

    if (schedule.everyInterval < min || schedule.everyInterval > max) {
      return {
        valid: false,
        message: getEveryIntervalHint(schedule.everyUnit, minuteStep),
      };
    }
  }

  return { valid: true, message: null };
};
