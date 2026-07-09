import { parseDate, type Period } from '@shared/components/DateTimeRange';

const MOSCOW_TIME_ZONE = 'Europe/Moscow';

const DATE_PATTERN = /^(\d{2})\.(\d{2})\.(\d{4})$/;
const TIME_PATTERN = /^(\d{2}):(\d{2})(?::(\d{2}))?$/;

const pad2 = (value: number): string => String(value).padStart(2, '0');

type ZonedDateParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

/**
 * Разбирает абсолютный момент на календарные части в IANA-зоне.
 * Нужен для перевода wall-clock Москвы в UTC ISO для бэка.
 */
const getZonedDateParts = (value: Date, timeZone: string): ZonedDateParts => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(value);

  const read = (type: Intl.DateTimeFormatPartTypes): number => {
    const part = parts.find((item) => item.type === type)?.value;
    return Number.parseInt(part ?? '0', 10);
  };

  return {
    year: read('year'),
    month: read('month'),
    day: read('day'),
    hour: read('hour'),
    minute: read('minute'),
    second: read('second'),
  };
};

export type MoscowISOPeriod = {
  start: string | null;
  end: string | null;
  timeZone: string;
};

export type MoscowWallClock = {
  date: string;
  time: string;
};

/**
 * UI `dd.mm.yyyy` + `HH:mm` трактуем как wall-clock Europe/Moscow
 * и отдаём ISO 8601 в UTC для бэкенда.
 *
 * Пример: 09.07.2026 18:20 (MSK) → 2026-07-09T15:20:00.000Z
 */
export const dateTimeToMoscowISO = (
  dateValue: string,
  timeValue: string,
  timeZone: string = MOSCOW_TIME_ZONE,
): string | null => {
  const dateMatch = DATE_PATTERN.exec(dateValue.trim());
  const timeMatch = TIME_PATTERN.exec(timeValue.trim());

  if (!dateMatch || !timeMatch) {
    return null;
  }

  const day = Number.parseInt(dateMatch[1], 10);
  const month = Number.parseInt(dateMatch[2], 10);
  const year = Number.parseInt(dateMatch[3], 10);
  const hours = Number.parseInt(timeMatch[1], 10);
  const minutes = Number.parseInt(timeMatch[2], 10);
  const seconds = Number.parseInt(timeMatch[3] ?? '0', 10);

  if (
    Number.isNaN(day) ||
    Number.isNaN(month) ||
    Number.isNaN(year) ||
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    Number.isNaN(seconds)
  ) {
    return null;
  }

  if (parseDate(dateValue) === null) {
    return null;
  }

  // Ищем UTC-момент, у которого в timeZone те же календарные компоненты
  const desiredAsUtc = Date.UTC(year, month - 1, day, hours, minutes, seconds);
  const zoned = getZonedDateParts(new Date(desiredAsUtc), timeZone);
  const zonedAsUtc = Date.UTC(
    zoned.year,
    zoned.month - 1,
    zoned.day,
    zoned.hour,
    zoned.minute,
    zoned.second,
  );
  const utcMillis = desiredAsUtc + (desiredAsUtc - zonedAsUtc);

  return new Date(utcMillis).toISOString();
};

/** Диапазон start/end → ISO UTC + timeZone для отправки на бэк */
export const periodToMoscowISO = (
  date: Period,
  time: Period,
): MoscowISOPeriod => ({
  start: dateTimeToMoscowISO(date.start, time.start),
  end: dateTimeToMoscowISO(date.end, time.end),
  timeZone: MOSCOW_TIME_ZONE,
});

/**
 * Текущий момент как строки UI в Europe/Moscow (не зависит от TZ браузера).
 * Минуты округляются вниз до minuteStep.
 */
export const getMoscowNowWallClock = (
  minuteStep = 1,
  now: Date = new Date(),
): MoscowWallClock => {
  const parts = getZonedDateParts(now, MOSCOW_TIME_ZONE);
  const step = minuteStep > 1 ? minuteStep : 1;
  const flooredMinute = Math.floor(parts.minute / step) * step;

  return {
    date: `${pad2(parts.day)}.${pad2(parts.month)}.${parts.year}`,
    time: `${pad2(parts.hour)}:${pad2(flooredMinute)}`,
  };
};

/** Абсолютный max (UTC ms) = «сейчас» по Москве, минуты вниз до step */
export const getMoscowNowUtcMillis = (
  minuteStep = 1,
  now: Date = new Date(),
): number => {
  const wall = getMoscowNowWallClock(minuteStep, now);
  const iso = dateTimeToMoscowISO(wall.date, wall.time);

  return iso ? Date.parse(iso) : now.getTime();
};

/**
 * Clamp UI date/time к «не позже сейчас по Москве».
 * Сравнение через UTC ISO — корректно при любой TZ браузера (Омск, UTC, …).
 */
export const clampToMoscowNow = (
  dateValue: string,
  timeValue: string,
  minuteStep = 1,
  now: Date = new Date(),
): { date: string; time: string; changed: boolean } => {
  const iso = dateTimeToMoscowISO(dateValue, timeValue);
  const moscowNow = getMoscowNowWallClock(minuteStep, now);

  if (!iso) {
    // Дата без времени / неполная: если день позже московского «сегодня» — сдвигаем дату
    const parsedDate = parseDate(dateValue);

    if (!parsedDate || !timeValue.trim()) {
      if (!parsedDate) {
        return { date: dateValue, time: timeValue, changed: false };
      }

      const dayIso = dateTimeToMoscowISO(dateValue, '00:00');
      const todayStartIso = dateTimeToMoscowISO(moscowNow.date, '00:00');

      if (
        dayIso &&
        todayStartIso &&
        Date.parse(dayIso) > Date.parse(todayStartIso)
      ) {
        return { date: moscowNow.date, time: timeValue, changed: true };
      }

      return { date: dateValue, time: timeValue, changed: false };
    }

    return { date: dateValue, time: timeValue, changed: false };
  }

  const maxUtc = getMoscowNowUtcMillis(minuteStep, now);

  if (Date.parse(iso) <= maxUtc) {
    return { date: dateValue, time: timeValue, changed: false };
  }

  return { date: moscowNow.date, time: moscowNow.time, changed: true };
};

/** true, если date+time (как MSK) строго позже «сейчас» по Москве */
export const isAfterMoscowNow = (
  dateValue: string,
  timeValue: string,
  minuteStep = 1,
  now: Date = new Date(),
): boolean => {
  const iso = dateTimeToMoscowISO(dateValue, timeValue);

  if (!iso) {
    return false;
  }

  return Date.parse(iso) > getMoscowNowUtcMillis(minuteStep, now);
};

/**
 * Date для Admiral maxDate: сегодняшний календарный день по Москве
 * как локальные Y/M/D (календарь сравнивает getDate/getMonth, не UTC).
 */
export const getMoscowTodayMaxDate = (now: Date = new Date()): Date => {
  const parts = getZonedDateParts(now, MOSCOW_TIME_ZONE);

  return new Date(parts.year, parts.month - 1, parts.day, 23, 59, 59, 999);
};
