import { Cron } from '../cron';
import { CRON_RU_TO_STRING_OPTIONS } from '../cron/types';
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

const clearDateFields = {
  dayOfWeek: null,
  dayOfMonth: null,
  month: null,
} as const;

/** Состояние формы расписания (SSMS-стиль) ↔ cron */
export class ScheduleModel implements ScheduleInterface {
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
  static createEmpty = (): ScheduleModel => new ScheduleModel();

  /** Восстанавливает состояние формы из cron-выражения */
  static fromCron = (cron: Cron): ScheduleModel => {
    const defaults = ScheduleModel.createEmpty();
    const { minute, hour, dayOfMonth, month, dayOfWeek } = cron;

    if (minute.startsWith('*/')) {
      return defaults.copyWith({
        dailyFrequency: 'every',
        everyUnit: 'minutes',
        everyInterval: clampCronInterval(
          Number.parseInt(minute.slice(2), 10) || 1,
          'minutes',
        ),
      });
    }

    if (hour.startsWith('*/')) {
      return defaults.copyWith({
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
      return defaults.copyWith({
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

      return defaults.copyWith({
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
      return defaults.copyWith({
        occurs: 'monthly',
        dailyFrequency: 'once',
        onceAtTime: time,
        dayOfMonth: Number.parseInt(dayOfMonth, 10) || 1,
      });
    }

    return defaults.copyWith({
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

      return Cron.createEmpty().copyWith({
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
        return Cron.createEmpty().copyWith({
          minute: `*/${interval}`,
          hour: '*',
          ...clearDateFields,
        });
      }

      return Cron.createEmpty().copyWith({
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
        return Cron.createEmpty().copyWith({
          ...timeFields,
          ...clearDateFields,
        });
      case 'weekly': {
        return Cron.createEmpty().copyWith({
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
        return Cron.createEmpty().copyWith({
          ...timeFields,
          dayOfMonth: String(Math.max(1, Math.min(31, this.dayOfMonth))),
          dayOfWeek: null,
          month: null,
        });
      default:
        return Cron.createEmpty();
    }
  };

  /** Краткое описание расписания на русском */
  public toDescription = (): string => {
    if (this.scheduleType === 'one-time') {
      return `Выполняется один раз ${this.oneTimeDate} в ${this.oneTimeTime}.`;
    }

    const text = this.toCron().toString(CRON_RU_TO_STRING_OPTIONS);
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  /** Возвращает копию с частично заменёнными полями */
  public copyWith = (patch?: Partial<ScheduleInterface>): ScheduleModel =>
    new ScheduleModel({ ...this, ...patch });
}
