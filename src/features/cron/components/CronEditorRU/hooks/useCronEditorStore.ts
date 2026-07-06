import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { create } from 'zustand';
import { Cron } from '../models/cron';
import { Schedule } from '../models/schedule';
import type {
  ScheduleInterface,
  WeekDayKey,
  WeekNumberKey,
} from '../models/schedule/types';
import { createEmptyWeekNumbers } from '../models/schedule/types';
import type { CronOptions } from '../utils/options';
import { resolveCronOptions } from '../utils/options';
import { normalizeTimeToMinuteStep } from '@shared/utils/time';
import { normalizeEveryInterval } from '../utils/validation';

export type CronEditorStoreState = {
  schedule: Schedule;
  options: Required<CronOptions>;
};

export type CronEditorStoreActions = {
  patchSchedule: (
    updater:
      | Partial<ScheduleInterface>
      | ((schedule: Schedule) => Schedule),
  ) => void;
  setScheduleType: (scheduleType: ScheduleInterface['scheduleType']) => void;
  setWeekDay: (day: WeekDayKey, checked: boolean) => void;
  setWeekNumber: (week: WeekNumberKey, checked: boolean) => void;
  patchTime: (field: 'oneTimeTime' | 'onceAtTime', timeValue: string) => void;
  syncOptions: (options: Required<CronOptions>) => void;
  initFromCron: (cron: Cron) => void;
  toSubmitCron: () => Cron;
};

export type CronEditorStore = CronEditorStoreState & CronEditorStoreActions;

const defaultOptions = resolveCronOptions();

const cloneScheduleForMinuteStep = (
  schedule: Schedule,
  minuteStep: number,
): Schedule => {
  let next = schedule.clone({
    oneTimeTime: normalizeTimeToMinuteStep(schedule.oneTimeTime, minuteStep),
    onceAtTime: normalizeTimeToMinuteStep(schedule.onceAtTime, minuteStep),
  });

  if (next.everyUnit === 'minutes') {
    next = next.clone({
      everyInterval: normalizeEveryInterval(
        next.everyInterval,
        'minutes',
        minuteStep,
      ),
    });
  } else if (next.dailyFrequency === 'every') {
    next = next.clone({
      everyInterval: normalizeEveryInterval(
        next.everyInterval,
        'hours',
        minuteStep,
      ),
    });
  }

  return next;
};

export const useCronEditorStore = create<CronEditorStore>((set, get) => ({
  schedule: Schedule.fromCron(Cron.createEmpty()),
  options: defaultOptions,

  patchSchedule: (updater) => {
    set((state) => ({
      schedule:
        typeof updater === 'function'
          ? updater(state.schedule)
          : state.schedule.clone(updater),
    }));
  },

  setScheduleType: (scheduleType) => {
    set((state) => ({
      schedule: state.schedule.clone({ scheduleType }),
    }));
  },

  setWeekDay: (day, checked) => {
    set((state) => ({
      schedule: state.schedule.clone({
        weekDays: { ...state.schedule.weekDays, [day]: checked },
      }),
    }));
  },

  setWeekNumber: (week, checked) => {
    set((state) => ({
      schedule: state.schedule.clone({
        weekNumbers: { ...state.schedule.weekNumbers, [week]: checked },
      }),
    }));
  },

  patchTime: (field, timeValue) => {
    set((state) => ({
      schedule: state.schedule.clone({
        [field]: normalizeTimeToMinuteStep(
          timeValue,
          state.options.minuteStep,
        ),
      }),
    }));
  },

  syncOptions: (nextOptions) => {
    set((state) => {
      let schedule = state.schedule;

      if (nextOptions.weeklyWeekNumbers !== state.options.weeklyWeekNumbers) {
        schedule = schedule.clone({
          useMonthWeekNumbers: nextOptions.weeklyWeekNumbers,
          ...(nextOptions.weeklyWeekNumbers
            ? {}
            : { weekNumbers: createEmptyWeekNumbers() }),
        });
      }

      if (nextOptions.minuteStep !== state.options.minuteStep) {
        schedule = cloneScheduleForMinuteStep(schedule, nextOptions.minuteStep);
      }

      return { options: nextOptions, schedule };
    });
  },

  initFromCron: (nextCron) => {
    set({ schedule: Schedule.fromCron(nextCron) });
  },

  toSubmitCron: () => get().schedule.toCron(),
}));

export const patchEveryInterval = (
  schedule: Schedule,
  minuteStep: number,
  everyInterval: number,
): Schedule =>
  schedule.clone({
    everyInterval: normalizeEveryInterval(
      everyInterval,
      schedule.everyUnit,
      minuteStep,
    ),
  });

export const patchEveryUnit = (
  schedule: Schedule,
  minuteStep: number,
  everyUnit: ScheduleInterface['everyUnit'],
): Schedule => {
  const everyInterval = normalizeEveryInterval(
    schedule.everyInterval,
    everyUnit,
    minuteStep,
  );

  return schedule.clone({ everyUnit, everyInterval });
};

/** Синхронизирует store с props CronEditor (cron, options). */
export const useCronEditorSync = (cron?: Cron, options?: CronOptions): void => {
  const resolvedOptions = useMemo(
    () => resolveCronOptions(options),
    [options],
  );
  const cronExpression = (cron ?? Cron.createEmpty()).toExpression();
  const lastCronExpressionRef = useRef(cronExpression);

  useLayoutEffect(() => {
    const { syncOptions, initFromCron } = useCronEditorStore.getState();
    syncOptions(resolvedOptions);

    if (lastCronExpressionRef.current !== cronExpression) {
      lastCronExpressionRef.current = cronExpression;
      initFromCron(Cron.fromString(cronExpression));
    }
  }, [resolvedOptions, cronExpression]);
};

/** Вызывает onChange при каждом изменении расписания в store. */
export const useCronEditorOnChange = (
  onChange?: (cron: Cron) => void,
): void => {
  const schedule = useCronEditorStore((state) => state.schedule);
  const options = useCronEditorStore((state) => state.options);
  const toSubmitCron = useCronEditorStore((state) => state.toSubmitCron);

  useEffect(() => {
    onChange?.(toSubmitCron());
  }, [schedule, options, onChange, toSubmitCron]);
};
