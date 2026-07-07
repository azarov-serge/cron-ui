import React from 'react';
import {
  INTERVAL_UNIT_OPTIONS,
  OCCURS_OPTIONS,
  SCHEDULE_TYPE_OPTIONS,
} from '../utils/constants';
import type { CronOptions, WeekDayKey } from '../utils';
import {
  INTERVAL_UNIT_LABELS,
  OCCURS_LABELS,
  SCHEDULE_TYPE_LABELS,
  WEEK_DAYS_LABELS,
} from '../strings';

export const useCronEditorConfig = (options: Required<CronOptions>) => {
  return React.useMemo(() => {
    const showScheduleTypeChoice = options.scheduleTypes.length > 1;
    const scheduleTypeOptions = SCHEDULE_TYPE_OPTIONS.filter((option) =>
      options.scheduleTypes.includes(option.value),
    ).map((option) => ({
      ...option,
      label: SCHEDULE_TYPE_LABELS[option.value],
    }));

    const showOccursChoice = options.occursFrequencies.length > 1;
    const occursOptions = OCCURS_OPTIONS.filter((option) =>
      options.occursFrequencies.includes(option.value),
    ).map((option) => ({
      ...option,
      label: OCCURS_LABELS[option.value],
    }));

    const intervalUnitOptions = INTERVAL_UNIT_OPTIONS.map((option) => ({
      ...option,
      label: INTERVAL_UNIT_LABELS[option.value],
    }));

    const weekDayKeys = Object.keys(WEEK_DAYS_LABELS) as WeekDayKey[];
    const showDailyFrequencyChoice = options.dailyFrequencies.length > 1;
    const allowOnceDaily = options.dailyFrequencies.includes('once');
    const allowEveryDaily = options.dailyFrequencies.includes('every');

    return {
      options,
      showScheduleTypeChoice,
      scheduleTypeOptions,
      showOccursChoice,
      occursOptions,
      intervalUnitOptions,
      weekDayKeys,
      showDailyFrequencyChoice,
      allowOnceDaily,
      allowEveryDaily,
    };
  }, [options]);
};
