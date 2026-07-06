import { useMemo } from 'react';
import { WEEK_NUMBER_KEYS } from '../models/schedule/types';
import { useCronEditorStore } from './useCronEditorStore';
import { isCronFieldRequired } from '../utils/options';
import {
  getEveryIntervalLimits,
  validateSchedule,
} from '../utils/validation';
import { useTranslation } from '@shared/i18n/useTranslation';

export const useCronEditorValidation = () => {
  const { t } = useTranslation();
  const schedule = useCronEditorStore((state) => state.schedule);
  const options = useCronEditorStore((state) => state.options);

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
    schedule.useMonthWeekNumbers &&
    !WEEK_NUMBER_KEYS.some((week) => schedule.weekNumbers[week]);

  const validation = useMemo(
    () =>
      validateSchedule(
        schedule,
        options.minuteStep,
        {
          requires: options.requires,
          weeklyWeekNumbers: options.weeklyWeekNumbers,
        },
        t.editor,
      ),
    [schedule, options, t.editor],
  );

  return {
    everyIntervalLimits,
    isOnceDaily,
    isIntervalInvalid,
    isWeekDaysInvalid,
    isWeekNumbersInvalid,
    validation,
  };
};
