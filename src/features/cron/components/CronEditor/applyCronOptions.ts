import { ScheduleModel } from './models/schedule';
import type { DailyFrequencyType, ScheduleType } from './models/schedule/types';
import {
  createDefaultWeekNumbers,
  createEmptyWeekNumbers,
  WEEK_NUMBER_KEYS,
} from './models/schedule/types';
import { normalizeTimeToMinuteStep } from '@shared/utils/time';
import { normalizeEveryInterval } from './validation';
import type { CronOptions } from './options';

/** Возвращает допустимое значение: единственное из списка, текущее (если разрешено) или первое по умолчанию */
const resolveAllowedOption = <T>(current: T, allowed: readonly T[]): T => {
  if (allowed.length === 1) {
    return allowed[0];
  }

  if (allowed.includes(current)) {
    return current;
  }

  return allowed[0];
};

/** Приводит время и интервалы расписания к заданному шагу минут */
const applyMinuteStep = (
  schedule: ScheduleModel,
  minuteStep: number,
): ScheduleModel => {
  let next = schedule.copyWith({
    oneTimeTime: normalizeTimeToMinuteStep(schedule.oneTimeTime, minuteStep),
    onceAtTime: normalizeTimeToMinuteStep(schedule.onceAtTime, minuteStep),
  });

  if (next.everyUnit === 'minutes') {
    return next.copyWith({
      everyInterval: normalizeEveryInterval(
        next.everyInterval,
        'minutes',
        minuteStep,
      ),
    });
  }

  if (next.dailyFrequency === 'every') {
    return next.copyWith({
      everyInterval: normalizeEveryInterval(
        next.everyInterval,
        'hours',
        minuteStep,
      ),
    });
  }

  return next;
};

/** Применяет ограничения CronOptions к состоянию формы */
export const applyCronOptions = (
  schedule: ScheduleModel,
  options: Required<CronOptions>,
): ScheduleModel => {
  const scheduleType = resolveAllowedOption<ScheduleType>(
    schedule.scheduleType,
    options.scheduleTypes,
  );
  const occurs = resolveAllowedOption(
    schedule.occurs,
    options.occursFrequencies,
  );
  const dailyFrequency = resolveAllowedOption<DailyFrequencyType>(
    schedule.dailyFrequency,
    options.dailyFrequencies,
  );

  let next = schedule.copyWith({
    scheduleType,
    occurs,
    dailyFrequency,
    useMonthWeekNumbers: options.weeklyWeekNumbers,
  });

  if (!options.weeklyWeekNumbers) {
    next = next.copyWith({
      useMonthWeekNumbers: false,
      weekNumbers: createEmptyWeekNumbers(),
    });
  } else if (!WEEK_NUMBER_KEYS.some((week) => next.weekNumbers[week])) {
    next = next.copyWith({ weekNumbers: createDefaultWeekNumbers() });
  }

  if (options.minuteStep > 1) {
    next = applyMinuteStep(next, options.minuteStep);
  }

  return next;
};
