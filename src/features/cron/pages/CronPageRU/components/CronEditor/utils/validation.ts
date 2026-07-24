import {
  clampCronInterval,
  CRON_HOUR_INTERVAL_MAX,
  getAlignedMinuteIntervalMax,
} from './scheduleFieldUtils';
import type { IntervalUnit, ScheduleInterface } from './scheduleTypes';
import { WEEK_NUMBER_KEYS } from './scheduleTypes';
import type { CronOptions } from './options';
import { isCronFieldRequired } from './options';
import { formatMessage } from '../../../utils/formatMessage';
import type { EditorStrings } from '../strings';

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

/** Текст подсказки под полем интервала */
export const getEveryIntervalHint = (
  unit: IntervalUnit,
  minuteStep: number,
  editor: EditorStrings,
): string => {
  const { min, max } = getEveryIntervalLimits(unit, minuteStep);
  return unit === 'minutes'
    ? formatMessage(editor.intervalMinutes, { min, max })
    : formatMessage(editor.intervalHours, { min, max });
};

/** Проверяет расписание перед отправкой формы */
export const validateSchedule = (
  schedule: ScheduleInterface,
  minuteStep: number,
  editorOptions: ValidateScheduleOptions = {},
  editor: EditorStrings,
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
        message: editor.pickWeekDay,
      };
    }

    if (weeklyWeekNumbersEnabled && schedule.monthWeekNumbersEnabled) {
      const hasWeek = WEEK_NUMBER_KEYS.some((week) => schedule.weekNumbers[week]);
      if (
        isCronFieldRequired(requireFields, 'weeklyWeekNumbers') &&
        !hasWeek
      ) {
        return {
          valid: false,
          message: editor.pickWeekNumber,
        };
      }
    }
  }

  if (schedule.occurs === 'monthly' && schedule.daysOfMonth.length === 0) {
    return {
      valid: false,
      message: editor.pickMonthDay,
    };
  }

  if (schedule.dailyFrequency === 'every') {
    const { min, max } = getEveryIntervalLimits(schedule.everyUnit, minuteStep);

    if (schedule.everyInterval < min || schedule.everyInterval > max) {
      return {
        valid: false,
        message: getEveryIntervalHint(schedule.everyUnit, minuteStep, editor),
      };
    }
  }

  return { valid: true, message: null };
};
