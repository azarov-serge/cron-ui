import { useMemo } from 'react';
import {
  INTERVAL_UNIT_OPTIONS,
  OCCURS_OPTIONS,
  SCHEDULE_TYPE_OPTIONS,
} from '../utils/constants';
import { useCronEditorStore } from './useCronEditorStore';
import { editorStrings, occursLabels, scheduleTypeLabels } from '../strings';
import type { WeekDayKey } from '../models/schedule/types';

export const useCronEditorConfig = () => {
  const options = useCronEditorStore((state) => state.options);

  return useMemo(() => {
    const showScheduleTypeChoice = options.scheduleTypes.length > 1;
    const scheduleTypeOptions = SCHEDULE_TYPE_OPTIONS.filter((option) =>
      options.scheduleTypes.includes(option.value),
    ).map((option) => ({
      ...option,
      label: scheduleTypeLabels[option.value],
    }));

    const showOccursChoice = options.occursFrequencies.length > 1;
    const occursOptions = OCCURS_OPTIONS.filter((option) =>
      options.occursFrequencies.includes(option.value),
    ).map((option) => ({
      ...option,
      label: occursLabels[option.value],
    }));

    const intervalUnitOptions = INTERVAL_UNIT_OPTIONS.map((option) => ({
      ...option,
      label: editorStrings.intervalUnits[option.value],
    }));

    const weekDayKeys = Object.keys(
      editorStrings.weekDaysLabels,
    ) as WeekDayKey[];
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
