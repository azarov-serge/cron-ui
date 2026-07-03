import type {
  IntervalUnit,
  WeekDayKey,
  WeekDays,
  WeekNumberKey,
  WeekNumbers,
} from './types';
import { createEmptyWeekDays } from './types';

export const CRON_MINUTE_INTERVAL_MAX = 59;
export const CRON_HOUR_INTERVAL_MAX = 23;

export const WEEK_DAY_TO_CRON: Record<WeekDayKey, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

/** Максимальный интервал «каждые N минут», кратный minuteStep и не превышающий 59 */
export const getAlignedMinuteIntervalMax = (minuteStep: number): number => {
  if (minuteStep <= 1) {
    return CRON_MINUTE_INTERVAL_MAX;
  }

  return Math.floor(CRON_MINUTE_INTERVAL_MAX / minuteStep) * minuteStep;
};

/** Ограничивает интервал допустимым диапазоном cron: 1–59 мин или 1–23 ч */
export const clampCronInterval = (
  interval: number,
  unit: IntervalUnit,
): number => {
  const max =
    unit === 'minutes' ? CRON_MINUTE_INTERVAL_MAX : CRON_HOUR_INTERVAL_MAX;
  return Math.min(max, Math.max(1, interval));
};

/** Разбирает строку HH:mm на числовые час и минуту */
export const parseTime = (time: string): { hour: number; minute: number } => {
  const [hourPart, minutePart] = time.split(':');
  return {
    hour: Number.parseInt(hourPart || '0', 10),
    minute: Number.parseInt(minutePart || '0', 10),
  };
};

/** Раскрывает поле day-of-week cron: «1,3», «1-5» → список номеров дней */
export const expandDayOfWeek = (dow: string): number[] =>
  dow.split(',').flatMap((part) => {
    if (part.includes('#')) {
      const [dayPart] = part.split('#');
      return [Number.parseInt(dayPart, 10)];
    }

    if (part.includes('-')) {
      const [start, end] = part
        .split('-')
        .map((value) => Number.parseInt(value, 10));
      const days: number[] = [];
      for (let day = start; day <= end; day += 1) {
        days.push(day);
      }
      return days;
    }

    return [Number.parseInt(part, 10)];
  });

export interface DayOfWeekCronPart {
  day: number;
  weekNumber?: WeekNumberKey;
}

/** Разбирает day-of-week: «1,3» и «1#1,1#3» */
export const parseDayOfWeekField = (dow: string): DayOfWeekCronPart[] =>
  dow.split(',').flatMap((part) => {
    const trimmed = part.trim();
    if (!trimmed) {
      return [];
    }

    if (trimmed.includes('#')) {
      const [dayPart, weekPart] = trimmed.split('#');
      const day = Number.parseInt(dayPart, 10);
      const weekNumber = Number.parseInt(weekPart, 10) as WeekNumberKey;
      if (Number.isNaN(day) || Number.isNaN(weekNumber)) {
        return [];
      }
      return [{ day, weekNumber }];
    }

    if (trimmed.includes('-')) {
      return expandDayOfWeek(trimmed).map((day) => ({ day }));
    }

    const day = Number.parseInt(trimmed, 10);
    if (Number.isNaN(day)) {
      return [];
    }

    return [{ day }];
  });

/** Собирает поле day-of-week для еженедельного расписания */
export const buildWeeklyDayOfWeek = ({
  weekDays,
  weekNumbers,
  useMonthWeekNumbers,
  weekNumberKeys,
}: {
  weekDays: WeekDays;
  weekNumbers: WeekNumbers;
  useMonthWeekNumbers: boolean;
  weekNumberKeys: WeekNumberKey[];
}): string | null => {
  const selectedDays = (Object.keys(weekDays) as WeekDayKey[])
    .filter((day) => weekDays[day])
    .map((day) => WEEK_DAY_TO_CRON[day]);

  if (selectedDays.length === 0) {
    return null;
  }

  const selectedWeeks = weekNumberKeys.filter((week) => weekNumbers[week]);

  if (useMonthWeekNumbers && selectedWeeks.length > 0) {
    return selectedDays
      .flatMap((day) => selectedWeeks.map((week) => `${day}#${week}`))
      .join(',');
  }

  return selectedDays.join(',');
};

/** Восстанавливает чекбоксы недель месяца из частей cron */
export const cronPartsToWeekNumbers = (
  parts: DayOfWeekCronPart[],
  weekNumberKeys: WeekNumberKey[],
): WeekNumbers => {
  const weekNumbers = Object.fromEntries(
    weekNumberKeys.map((week) => [week, false]),
  ) as WeekNumbers;

  parts.forEach((part) => {
    if (part.weekNumber !== undefined) {
      weekNumbers[part.weekNumber] = true;
    }
  });

  return weekNumbers;
};

/** Преобразует номера дней cron (0 = вс, 1 = пн, …) в чекбоксы формы */
export const cronDaysToWeekDays = (cronDays: number[]): WeekDays => {
  const weekDays = createEmptyWeekDays();
  const cronToKey = Object.entries(WEEK_DAY_TO_CRON) as [WeekDayKey, number][];

  cronDays.forEach((cronDay) => {
    const match = cronToKey.find(([, value]) => value === cronDay);
    if (match) {
      weekDays[match[0]] = true;
    }
  });

  return weekDays;
};
