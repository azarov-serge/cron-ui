export type ScheduleType = 'recurring' | 'one-time';

export type OccursFrequency = 'daily' | 'weekly' | 'monthly';

export type DailyFrequencyType = 'once' | 'every';

export type IntervalUnit = 'minutes' | 'hours';

export type WeekDayKey =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export type WeekDays = Record<WeekDayKey, boolean>;

export type WeekNumberKey = 1 | 2 | 3 | 4 | 5;

export type WeekNumbers = Record<WeekNumberKey, boolean>;

export const WEEK_NUMBER_KEYS: WeekNumberKey[] = [1, 2, 3, 4, 5];

export interface ScheduleInterface {
  scheduleType: ScheduleType;
  oneTimeDate: string;
  oneTimeTime: string;
  occurs: OccursFrequency;
  weekDays: WeekDays;
  weekNumbers: WeekNumbers;
  monthWeekNumbersEnabled: boolean;
  /** Дни месяца для ежемесячного расписания (1–31), в cron через запятую */
  daysOfMonth: number[];
  dailyFrequency: DailyFrequencyType;
  /** Учитывать время запуска (weekly/monthly); false → 0 0 */
  startTimeEnabled: boolean;
  onceAtTime: string;
  everyInterval: number;
  everyUnit: IntervalUnit;
}

export const WEEK_DAY_LABELS: Record<WeekDayKey, string> = {
  monday: 'Понедельник',
  tuesday: 'Вторник',
  wednesday: 'Среда',
  thursday: 'Четверг',
  friday: 'Пятница',
  saturday: 'Суббота',
  sunday: 'Воскресенье',
};

export const formatDateRu = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

export const createEmptyWeekDays = (): WeekDays => ({
  monday: false,
  tuesday: false,
  wednesday: false,
  thursday: false,
  friday: false,
  saturday: false,
  sunday: false,
});

export const createDefaultWeekDays = (): WeekDays => ({
  ...createEmptyWeekDays(),
  monday: true,
});

export const createEmptyWeekNumbers = (): WeekNumbers => ({
  1: false,
  2: false,
  3: false,
  4: false,
  5: false,
});
