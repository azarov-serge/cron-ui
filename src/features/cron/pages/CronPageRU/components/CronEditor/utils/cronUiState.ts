import { normalizeTimeToMinuteStep } from '@shared/components/TimePicker/utils/time';
import { Cron } from '../models/cron';
import type {
  ScheduleInterface,
  WeekDayKey,
  WeekNumberKey,
} from './scheduleTypes';
import { buildCronFromSchedule, parseScheduleFromCron } from './cronParsers';
import { normalizeEveryInterval } from './validation';

const updateSchedule = (
  value: Cron,
  patch: Partial<ScheduleInterface>,
): Cron => {
  const schedule = parseScheduleFromCron(value);
  return buildCronFromSchedule({ ...schedule, ...patch });
};

export const getOccurs = (value: Cron): ScheduleInterface['occurs'] =>
  parseScheduleFromCron(value).occurs;

export const setOccurs = (
  value: Cron,
  occurs: ScheduleInterface['occurs'],
): Cron => updateSchedule(value, { occurs });

export const getScheduleType = (
  value: Cron,
): ScheduleInterface['scheduleType'] =>
  parseScheduleFromCron(value).scheduleType;

export const setScheduleType = (
  value: Cron,
  scheduleType: ScheduleInterface['scheduleType'],
): Cron => updateSchedule(value, { scheduleType });

export const getDayOfMonth = (value: Cron): number =>
  parseScheduleFromCron(value).dayOfMonth;

export const setDayOfMonth = (value: Cron, dayOfMonth: number): Cron =>
  updateSchedule(value, { dayOfMonth });

export const toggleWeekDay = (
  value: Cron,
  day: WeekDayKey,
  checked: boolean,
): Cron => {
  const schedule = parseScheduleFromCron(value);
  return buildCronFromSchedule({
    ...schedule,
    weekDays: { ...schedule.weekDays, [day]: checked },
  });
};

export const toggleWeekNumber = (
  value: Cron,
  week: WeekNumberKey,
  checked: boolean,
): Cron => {
  const schedule = parseScheduleFromCron(value);
  return buildCronFromSchedule({
    ...schedule,
    weekNumbers: { ...schedule.weekNumbers, [week]: checked },
  });
};

export const getOneTimeSchedule = (
  value: Cron,
): Pick<ScheduleInterface, 'scheduleType' | 'oneTimeDate' | 'oneTimeTime'> => {
  const schedule = parseScheduleFromCron(value);
  return {
    scheduleType: schedule.scheduleType,
    oneTimeDate: schedule.oneTimeDate,
    oneTimeTime: schedule.oneTimeTime,
  };
};

export const setOneTimeDate = (value: Cron, oneTimeDate: string): Cron =>
  updateSchedule(value, { oneTimeDate });

export const setOneTimeTime = (
  value: Cron,
  oneTimeTime: string,
  minuteStep: number,
): Cron =>
  updateSchedule(value, {
    oneTimeTime: normalizeTimeToMinuteStep(oneTimeTime, minuteStep) ?? '',
  });

export const getDailyFrequencySchedule = (
  value: Cron,
): Pick<
  ScheduleInterface,
  'onceAtTime' | 'everyInterval' | 'everyUnit' | 'dailyFrequency'
> => {
  const schedule = parseScheduleFromCron(value);
  return {
    onceAtTime: schedule.onceAtTime,
    everyInterval: schedule.everyInterval,
    everyUnit: schedule.everyUnit,
    dailyFrequency: schedule.dailyFrequency,
  };
};

export const setDailyFrequency = (
  value: Cron,
  dailyFrequency: ScheduleInterface['dailyFrequency'],
): Cron => updateSchedule(value, { dailyFrequency });

export const setOnceAtTime = (
  value: Cron,
  onceAtTime: string,
  minuteStep: number,
): Cron =>
  updateSchedule(value, {
    onceAtTime: normalizeTimeToMinuteStep(onceAtTime, minuteStep) ?? '',
  });

export const setEveryInterval = (
  value: Cron,
  minuteStep: number,
  everyInterval: number,
): Cron => {
  const schedule = parseScheduleFromCron(value);
  return buildCronFromSchedule({
    ...schedule,
    everyInterval: normalizeEveryInterval(
      everyInterval,
      schedule.everyUnit,
      minuteStep,
    ),
  });
};

export const setEveryUnit = (
  value: Cron,
  minuteStep: number,
  everyUnit: ScheduleInterface['everyUnit'],
): Cron => {
  const schedule = parseScheduleFromCron(value);
  return buildCronFromSchedule({
    ...schedule,
    everyUnit,
    everyInterval: normalizeEveryInterval(
      schedule.everyInterval,
      everyUnit,
      minuteStep,
    ),
  });
};

export const getIsRecurring = (value: Cron): boolean =>
  parseScheduleFromCron(value).scheduleType === 'recurring';

export const getOutputState = (
  value: Cron,
): { schedule: ScheduleInterface; isOneTime: boolean } => {
  const schedule = parseScheduleFromCron(value);
  return { schedule, isOneTime: schedule.scheduleType === 'one-time' };
};
