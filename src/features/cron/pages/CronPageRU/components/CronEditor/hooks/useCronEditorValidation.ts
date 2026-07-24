import React from 'react';
import { Cron } from '../models/cron';
import {
  getEveryIntervalLimits,
  isCronFieldRequired,
  parseScheduleFromCron,
  validateSchedule,
  WEEK_NUMBER_KEYS,
} from '../utils';
import type { CronOptions } from '../utils';
import { EDITOR_STRINGS } from '../strings';

export const useCronEditorValidation = (
  value: Cron,
  options: Required<CronOptions>,
) => {
  const schedule = parseScheduleFromCron(value);

  const everyIntervalLimits = getEveryIntervalLimits(
    schedule.everyUnit,
    options.minuteStep,
  );

  const isOnceDaily = schedule.dailyFrequency === 'once';
  const isIntervalInvalid =
    schedule.dailyFrequency === 'every' &&
    (schedule.everyInterval < everyIntervalLimits.min ||
      schedule.everyInterval > everyIntervalLimits.max);

  const isWeekDaysInvalid =
    isCronFieldRequired(options.requires, 'weeklyWeekDays') &&
    schedule.occurs === 'weekly' &&
    !Object.values(schedule.weekDays).some(Boolean);

  const isWeekNumbersInvalid =
    isCronFieldRequired(options.requires, 'weeklyWeekNumbers') &&
    options.weeklyWeekNumbers &&
    schedule.occurs === 'weekly' &&
    schedule.monthWeekNumbersEnabled &&
    !WEEK_NUMBER_KEYS.some((week) => schedule.weekNumbers[week]);

  const isDaysOfMonthInvalid =
    schedule.occurs === 'monthly' && schedule.daysOfMonth.length === 0;

  const validation = React.useMemo(
    () =>
      validateSchedule(
        schedule,
        options.minuteStep,
        {
          requires: options.requires,
          weeklyWeekNumbers: options.weeklyWeekNumbers,
        },
        EDITOR_STRINGS,
      ),
    [schedule, options],
  );

  return {
    everyIntervalLimits,
    isOnceDaily,
    isIntervalInvalid,
    isWeekDaysInvalid,
    isWeekNumbersInvalid,
    isDaysOfMonthInvalid,
    validation,
  };
};
