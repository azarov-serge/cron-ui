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

/** Номер недели внутри месяца (1–5) */
export type WeekNumberKey = 1 | 2 | 3 | 4 | 5;

export type WeekNumbers = Record<WeekNumberKey, boolean>;

export const WEEK_NUMBER_KEYS: WeekNumberKey[] = [1, 2, 3, 4, 5];

export const WEEK_NUMBER_LABELS: Record<WeekNumberKey, string> = {
  1: '1-я',
  2: '2-я',
  3: '3-я',
  4: '4-я',
  5: '5-я',
};

export interface ScheduleInterface {
  scheduleType: ScheduleType;
  oneTimeDate: string;
  oneTimeTime: string;
  occurs: OccursFrequency;
  weekDays: WeekDays;
  /** Недели месяца для еженедельного расписания (см. useMonthWeekNumbers) */
  weekNumbers: WeekNumbers;
  /** Учитывать weekNumbers при сборке cron (включается опцией weeklyWeekNumbers) */
  useMonthWeekNumbers: boolean;
  dayOfMonth: number;
  dailyFrequency: DailyFrequencyType;
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

/** Форматирует дату в DD.MM.YYYY */
export const formatDateRu = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

/** Все дни недели сняты */
export const createEmptyWeekDays = (): WeekDays => ({
  monday: false,
  tuesday: false,
  wednesday: false,
  thursday: false,
  friday: false,
  saturday: false,
  sunday: false,
});

/** По умолчанию выбран только понедельник */
export const createDefaultWeekDays = (): WeekDays => ({
  ...createEmptyWeekDays(),
  monday: true,
});

/** Все недели месяца сняты */
export const createEmptyWeekNumbers = (): WeekNumbers => ({
  1: false,
  2: false,
  3: false,
  4: false,
  5: false,
});

/** По умолчанию — только 1-я неделя месяца */
export const createDefaultWeekNumbers = (): WeekNumbers => ({
  ...createEmptyWeekNumbers(),
  1: true,
});
