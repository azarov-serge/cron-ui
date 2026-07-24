import { Cron } from '@features/cron/components/CronEditor/models/cron';
import type {
  ScheduleInterface,
  WeekDayKey,
} from '@features/cron/components/CronEditor/utils/scheduleTypes';
import {
  buildCronFromSchedule,
  parseScheduleFromCron,
} from '@features/cron/components/CronEditor/utils/cronParsers';
import type { Locale } from '@shared/i18n/messages';
import { formatMessage, messages } from '@shared/i18n/messages';
import { toCronstrueLocale } from '@shared/i18n/cronLocale';

const capitalize = (text: string): string =>
  text.charAt(0).toUpperCase() + text.slice(1);

const describeCronWithCronstrue = (cron: Cron, locale: Locale): string => {
  const text = cron.toString({
    locale: toCronstrueLocale(locale),
    use24HourTimeFormat: true,
    throwExceptionOnParseError: false,
  });

  return capitalize(text);
};

const getSelectedWeekDays = (schedule: ScheduleInterface): string => {
  const labels = messages.hi.editor.weekDaysLabels;

  return (Object.keys(schedule.weekDays) as WeekDayKey[])
    .filter((day) => schedule.weekDays[day])
    .map((day) => labels[day])
    .join(', ');
};

/** Hindi: cronstrue не поддерживает hi — описание через модель расписания */
const describeCronInHindi = (cron: Cron): string => {
  const t = messages.hi.cronDescribe;
  const schedule = parseScheduleFromCron(cron);

  if (schedule.scheduleType === 'one-time') {
    return formatMessage(messages.hi.editor.oneTimeDescription, {
      date: schedule.oneTimeDate,
      time: schedule.oneTimeTime,
    });
  }

  if (schedule.dailyFrequency === 'every') {
    if (schedule.everyUnit === 'minutes') {
      return formatMessage(t.everyMinutes, { interval: schedule.everyInterval });
    }
    return formatMessage(t.everyHours, { interval: schedule.everyInterval });
  }

  const time = schedule.onceAtTime;

  if (schedule.occurs === 'monthly') {
    return formatMessage(t.monthlyAt, {
      day: schedule.daysOfMonth.join(', '),
      time,
    });
  }

  if (schedule.occurs === 'weekly') {
    const days = getSelectedWeekDays(schedule);
    if (days) {
      return formatMessage(t.weeklyAt, { days, time });
    }
  }

  return formatMessage(t.dailyAt, { time });
};

/** Человекочитаемое описание cron с учётом локали приложения */
export const describeCronHuman = (cron: Cron, locale: Locale): string => {
  if (locale === 'hi') {
    return describeCronInHindi(cron);
  }

  return describeCronWithCronstrue(cron, locale);
};

/** Интерпретация расписания из контролов редактора. */
export const describeScheduleHuman = (
  schedule: ScheduleInterface,
  locale: Locale,
): string => {
  if (schedule.scheduleType === 'one-time') {
    return formatMessage(messages[locale].editor.oneTimeDescription, {
      date: schedule.oneTimeDate,
      time: schedule.oneTimeTime,
    });
  }

  return describeCronHuman(buildCronFromSchedule(schedule), locale);
};
