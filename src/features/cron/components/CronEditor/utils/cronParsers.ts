import { Cron } from '../models/cron';
import {
  createDefaultWeekDays,
  createEmptyWeekNumbers,
  formatDateRu,
  WEEK_NUMBER_KEYS,
} from './scheduleTypes';
import type { ScheduleInterface } from './scheduleTypes';
import {
  buildWeeklyDayOfWeek,
  clampCronInterval,
  cronDaysToWeekDays,
  cronPartsToWeekNumbers,
  parseDayOfWeekField,
  parseTime,
} from './scheduleFieldUtils';

const parseCronTime = (cron: Cron): string => {
  const parsedHour = Number.parseInt(cron.hour, 10);
  const parsedMinute = Number.parseInt(cron.minute, 10);
  return `${String(parsedHour).padStart(2, '0')}:${String(parsedMinute).padStart(2, '0')}`;
};

export const parseScheduleFromCron = (cron: Cron): ScheduleInterface => {
  const defaults: ScheduleInterface = {
    scheduleType: 'recurring',
    oneTimeDate: formatDateRu(new Date()),
    oneTimeTime: '',
    occurs: 'weekly',
    weekDays: createDefaultWeekDays(),
    weekNumbers: createEmptyWeekNumbers(),
    monthWeekNumbersEnabled: false,
    dayOfMonth: 1,
    dailyFrequency: 'once',
    onceAtTime: '',
    everyInterval: 1,
    everyUnit: 'hours',
  };

  const { minute, hour, dayOfMonth, month, dayOfWeek } = cron;

  if (minute.startsWith('*/')) {
    return {
      ...defaults,
      dailyFrequency: 'every',
      everyUnit: 'minutes',
      everyInterval: clampCronInterval(
        Number.parseInt(minute.slice(2), 10) || 1,
        'minutes',
      ),
    };
  }

  if (hour.startsWith('*/')) {
    return {
      ...defaults,
      dailyFrequency: 'every',
      everyUnit: 'hours',
      everyInterval: clampCronInterval(
        Number.parseInt(hour.slice(2), 10) || 1,
        'hours',
      ),
    };
  }

  const time = parseCronTime(cron);

  if (dayOfMonth !== null && month !== null && dayOfWeek === null) {
    return {
      ...defaults,
      scheduleType: 'one-time',
      oneTimeDate: `${dayOfMonth.padStart(2, '0')}.${month.padStart(2, '0')}.${new Date().getFullYear()}`,
      oneTimeTime: time,
    };
  }

  if (dayOfWeek !== null) {
    const dayParts = parseDayOfWeekField(dayOfWeek);
    const hasMonthWeeks = dayParts.some((part) => part.weekNumber !== undefined);

    return {
      ...defaults,
      occurs: 'weekly',
      dailyFrequency: 'once',
      onceAtTime: time,
      weekDays: cronDaysToWeekDays([...new Set(dayParts.map((part) => part.day))]),
      weekNumbers: hasMonthWeeks
        ? cronPartsToWeekNumbers(dayParts, WEEK_NUMBER_KEYS)
        : createEmptyWeekNumbers(),
      monthWeekNumbersEnabled: hasMonthWeeks,
    };
  }

  if (dayOfMonth !== null) {
    return {
      ...defaults,
      occurs: 'monthly',
      dailyFrequency: 'once',
      onceAtTime: time,
      dayOfMonth: Number.parseInt(dayOfMonth, 10) || 1,
    };
  }

  return {
    ...defaults,
    occurs: 'daily',
    dailyFrequency: 'once',
    onceAtTime: time,
  };
};

export const buildCronFromSchedule = (schedule: ScheduleInterface): Cron => {
  if (schedule.scheduleType === 'one-time') {
    const { hour, minute } = parseTime(schedule.oneTimeTime);
    const [day, month] = schedule.oneTimeDate.split('.');

    return Cron.createEmpty().clone({
      minute: String(minute),
      hour: String(hour),
      dayOfMonth: String(Number.parseInt(day, 10)),
      month: String(Number.parseInt(month, 10)),
      dayOfWeek: null,
    });
  }

  if (schedule.dailyFrequency === 'every') {
    const interval = clampCronInterval(schedule.everyInterval, schedule.everyUnit);

    if (schedule.everyUnit === 'minutes') {
      return Cron.createEmpty().clone({
        minute: `*/${interval}`,
        hour: '*',
        dayOfWeek: null,
        dayOfMonth: null,
        month: null,
      });
    }

    return Cron.createEmpty().clone({
      minute: '0',
      hour: `*/${interval}`,
      dayOfWeek: null,
      dayOfMonth: null,
      month: null,
    });
  }

  const { hour, minute } = parseTime(schedule.onceAtTime);
  const timeFields = { minute: String(minute), hour: String(hour) };

  switch (schedule.occurs) {
    case 'daily':
      return Cron.createEmpty().clone({
        ...timeFields,
        dayOfWeek: null,
        dayOfMonth: null,
        month: null,
      });
    case 'weekly':
      return Cron.createEmpty().clone({
        ...timeFields,
        dayOfWeek: buildWeeklyDayOfWeek({
          weekDays: schedule.weekDays,
          weekNumbers: schedule.weekNumbers,
          monthWeekNumbersEnabled: schedule.monthWeekNumbersEnabled,
          weekNumberKeys: WEEK_NUMBER_KEYS,
        }),
        dayOfMonth: null,
        month: null,
      });
    case 'monthly':
      return Cron.createEmpty().clone({
        ...timeFields,
        dayOfMonth: String(Math.max(1, Math.min(31, schedule.dayOfMonth))),
        dayOfWeek: null,
        month: null,
      });
    default:
      return Cron.createEmpty();
  }
};
