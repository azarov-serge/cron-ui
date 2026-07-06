import { Cron } from '../cron';
import type { ScheduleInterface, WeekDays } from './types';
import {
  createDefaultWeekDays,
  createEmptyWeekNumbers,
  formatDateRu,
  WEEK_NUMBER_KEYS,
} from './types';
import {
  buildWeeklyDayOfWeek,
  clampCronInterval,
  cronDaysToWeekDays,
  cronPartsToWeekNumbers,
  parseDayOfWeekField,
  parseTime,
} from './utils';
import type { Locale } from '@shared/i18n/messages';
import { formatMessage, messages } from '@shared/i18n/messages';
import { describeCronHuman } from '@features/cron/utils/describeCron';

const clearDateFields = {
  dayOfWeek: null,
  dayOfMonth: null,
  month: null,
} as const;

/** Состояние формы расписания (SSMS-стиль) ↔ cron */
export class Schedule implements ScheduleInterface {
  scheduleType: ScheduleInterface['scheduleType'];
  oneTimeDate: string;
  oneTimeTime: string;
  occurs: ScheduleInterface['occurs'];
  weekDays: WeekDays;
  weekNumbers: ScheduleInterface['weekNumbers'];
  useMonthWeekNumbers: boolean;
  dayOfMonth: number;
  dailyFrequency: ScheduleInterface['dailyFrequency'];
  onceAtTime: string;
  everyInterval: number;
  everyUnit: ScheduleInterface['everyUnit'];

  constructor(fields?: Partial<ScheduleInterface>) {
    const today = formatDateRu(new Date());

    this.scheduleType = fields?.scheduleType ?? 'recurring';
    this.oneTimeDate = fields?.oneTimeDate ?? today;
    this.oneTimeTime = fields?.oneTimeTime ?? '00:00';
    this.occurs = fields?.occurs ?? 'weekly';
    this.weekDays = fields?.weekDays ?? createDefaultWeekDays();
    this.weekNumbers = fields?.weekNumbers ?? createEmptyWeekNumbers();
    this.useMonthWeekNumbers = fields?.useMonthWeekNumbers ?? false;
    this.dayOfMonth = fields?.dayOfMonth ?? 1;
    this.dailyFrequency = fields?.dailyFrequency ?? 'once';
    this.onceAtTime = fields?.onceAtTime ?? '00:00';
    this.everyInterval = fields?.everyInterval ?? 1;
    this.everyUnit = fields?.everyUnit ?? 'hours';
  }

  /** Состояние формы по умолчанию: еженедельно, понедельник, 00:00 */
  static createEmpty = (): Schedule => new Schedule();

  /** Восстанавливает состояние формы из cron-выражения */
  static fromCron = (cron: Cron): Schedule => {
    const defaults = Schedule.createEmpty();
    const { minute, hour, dayOfMonth, month, dayOfWeek } = cron;

    if (minute.startsWith('*/')) {
      return defaults.clone({
        dailyFrequency: 'every',
        everyUnit: 'minutes',
        everyInterval: clampCronInterval(
          Number.parseInt(minute.slice(2), 10) || 1,
          'minutes',
        ),
      });
    }

    if (hour.startsWith('*/')) {
      return defaults.clone({
        dailyFrequency: 'every',
        everyUnit: 'hours',
        everyInterval: clampCronInterval(
          Number.parseInt(hour.slice(2), 10) || 1,
          'hours',
        ),
      });
    }

    const parsedHour = Number.parseInt(hour, 10);
    const parsedMinute = Number.parseInt(minute, 10);
    const time = `${String(parsedHour).padStart(2, '0')}:${String(parsedMinute).padStart(2, '0')}`;

    if (
      dayOfMonth !== null &&
      month !== null &&
      dayOfWeek === null
    ) {
      return defaults.clone({
        scheduleType: 'one-time',
        oneTimeDate: `${dayOfMonth.padStart(2, '0')}.${month.padStart(2, '0')}.${new Date().getFullYear()}`,
        oneTimeTime: time,
      });
    }

    if (dayOfWeek !== null) {
      const dayParts = parseDayOfWeekField(dayOfWeek);
      const hasMonthWeeks = dayParts.some(
        (part) => part.weekNumber !== undefined,
      );

      return defaults.clone({
        occurs: 'weekly',
        dailyFrequency: 'once',
        onceAtTime: time,
        weekDays: cronDaysToWeekDays([
          ...new Set(dayParts.map((part) => part.day)),
        ]),
        weekNumbers: hasMonthWeeks
          ? cronPartsToWeekNumbers(dayParts, WEEK_NUMBER_KEYS)
          : createEmptyWeekNumbers(),
        useMonthWeekNumbers: hasMonthWeeks,
      });
    }

    if (dayOfMonth !== null) {
      return defaults.clone({
        occurs: 'monthly',
        dailyFrequency: 'once',
        onceAtTime: time,
        dayOfMonth: Number.parseInt(dayOfMonth, 10) || 1,
      });
    }

    return defaults.clone({
      occurs: 'daily',
      dailyFrequency: 'once',
      onceAtTime: time,
    });
  };

  /** Собирает cron-выражение из состояния формы */
  public toCron = (): Cron => {
    if (this.scheduleType === 'one-time') {
      const { hour, minute } = parseTime(this.oneTimeTime);
      const [day, month] = this.oneTimeDate.split('.');

      return Cron.createEmpty().clone({
        minute: String(minute),
        hour: String(hour),
        dayOfMonth: String(Number.parseInt(day, 10)),
        month: String(Number.parseInt(month, 10)),
        dayOfWeek: null,
      });
    }

    if (this.dailyFrequency === 'every') {
      const interval = clampCronInterval(this.everyInterval, this.everyUnit);

      if (this.everyUnit === 'minutes') {
        return Cron.createEmpty().clone({
          minute: `*/${interval}`,
          hour: '*',
          ...clearDateFields,
        });
      }

      return Cron.createEmpty().clone({
        minute: '0',
        hour: `*/${interval}`,
        ...clearDateFields,
      });
    }

    const { hour, minute } = parseTime(this.onceAtTime);
    const timeFields = {
      minute: String(minute),
      hour: String(hour),
    };

    switch (this.occurs) {
      case 'daily':
        return Cron.createEmpty().clone({
          ...timeFields,
          ...clearDateFields,
        });
      case 'weekly': {
        return Cron.createEmpty().clone({
          ...timeFields,
          dayOfWeek: buildWeeklyDayOfWeek({
            weekDays: this.weekDays,
            weekNumbers: this.weekNumbers,
            useMonthWeekNumbers: this.useMonthWeekNumbers,
            weekNumberKeys: WEEK_NUMBER_KEYS,
          }),
          dayOfMonth: null,
          month: null,
        });
      }
      case 'monthly':
        return Cron.createEmpty().clone({
          ...timeFields,
          dayOfMonth: String(Math.max(1, Math.min(31, this.dayOfMonth))),
          dayOfWeek: null,
          month: null,
        });
      default:
        return Cron.createEmpty();
    }
  };

  /** Краткое описание расписания */
  public toDescription = (locale: Locale = 'ru'): string => {
    const t = messages[locale];

    if (this.scheduleType === 'one-time') {
      return formatMessage(t.editor.oneTimeDescription, {
        date: this.oneTimeDate,
        time: this.oneTimeTime,
      });
    }

    return describeCronHuman(this.toCron(), locale);
  };

  /** Возвращает копию с частично заменёнными полями */
  public clone = (patch?: Partial<ScheduleInterface>): Schedule =>
    new Schedule({ ...this, ...patch });
}
