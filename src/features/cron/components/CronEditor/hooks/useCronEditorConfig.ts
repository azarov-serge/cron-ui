import { useMemo } from 'react';
import {
  INTERVAL_UNIT_OPTIONS,
  OCCURS_OPTIONS,
  SCHEDULE_TYPE_OPTIONS,
} from '../utils/constants';
import { useCronEditorStore } from '../hooks/useCronEditorStore';
import { useTranslation } from '@shared/i18n/useTranslation';
import type { WeekDayKey } from '../models/schedule/types';

export const useCronEditorConfig = () => {
  const { t } = useTranslation();
  const options = useCronEditorStore((state) => state.options);

  return useMemo(() => {
    const showScheduleTypeChoice = options.scheduleTypes.length > 1;
    const scheduleTypeOptions = SCHEDULE_TYPE_OPTIONS.filter((option) =>
      options.scheduleTypes.includes(option.value),
    ).map((option) => ({
      ...option,
      label: t.scheduleTypes[option.value],
    }));

    const showOccursChoice = options.occursFrequencies.length > 1;
    const occursOptions = OCCURS_OPTIONS.filter((option) =>
      options.occursFrequencies.includes(option.value),
    ).map((option) => ({
      ...option,
      label: t.occurs[option.value],
    }));

    const intervalUnitOptions = INTERVAL_UNIT_OPTIONS.map((option) => ({
      ...option,
      label: t.editor.intervalUnits[option.value],
    }));

    const weekDayKeys = Object.keys(t.editor.weekDaysLabels) as WeekDayKey[];
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
  }, [options, t]);
};
