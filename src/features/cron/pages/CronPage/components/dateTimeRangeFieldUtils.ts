import { parseDate, type Period } from '@shared/components/DateTimeRange';

export const MOSCOW_TIME_ZONE = 'Europe/Moscow';

const DATE_PATTERN = /^(\d{2})\.(\d{2})\.(\d{4})$/;
const TIME_PATTERN = /^(\d{2}):(\d{2})(?::(\d{2}))?$/;

const pad2 = (value: number): string => String(value).padStart(2, '0');

export type DatePartsInTimeZone = {
  year: number;
  month: number; // 1–12
  day: number;
  hour: number;
  minute: number;
  second: number;
};

export type ZonedWallClock = {
  date: string; // dd.MM.yyyy
  time: string; // HH:mm
};

export type ZonedISOPeriod = {
  start: string | null;
  end: string | null;
  timeZone: string;
};

/**
 * Базовый шаг алгоритма «сейчас в нужной зоне»:
 *
 * 1) Берём абсолютный момент (`now` / `new Date()`).
 *    У Date нет «своей» бизнес-зоны — это просто точка на шкале UTC.
 * 2) Спрашиваем Intl: какие год/месяц/день/час/минута у этого момента в `timeZone`.
 * 3) Дальше из этих чисел собираем строки UI или Date для календаря.
 *
 * TZ браузера здесь не сравниваем и не используем — нужен только `timeZone`.
 *
 * Пример: now = 2026-07-09T15:41:00Z
 *   Europe/Moscow → 09.07.2026 18:41
 *   Asia/Omsk     → 09.07.2026 21:41
 */
export const getDatePartsInTimeZone = (
  now: Date,
  timeZone: string,
): DatePartsInTimeZone => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);

  const read = (type: Intl.DateTimeFormatPartTypes): number =>
    Number.parseInt(parts.find((part) => part.type === type)?.value ?? '0', 10);

  return {
    year: read('year'),
    month: read('month'),
    day: read('day'),
    hour: read('hour'),
    minute: read('minute'),
    second: read('second'),
  };
};

/** «Сейчас» как строки UI в зоне. Минуты вниз до minuteStep. */
export const getNowWallClockInTimeZone = (
  timeZone: string,
  minuteStep = 1,
  now: Date = new Date(),
): ZonedWallClock => {
  const { year, month, day, hour, minute } = getDatePartsInTimeZone(
    now,
    timeZone,
  );
  const step = minuteStep > 1 ? minuteStep : 1;
  const flooredMinute = Math.floor(minute / step) * step;

  return {
    date: `${pad2(day)}.${pad2(month)}.${year}`,
    time: `${pad2(hour)}:${pad2(flooredMinute)}`,
  };
};

/**
 * Сегодняшний календарный день в зоне → Date (локальные Y/M/D).
 * Обычно передают в Admiral как maxDate; время 23:59:59 — конец этого дня.
 */
export const getTodayInTimeZone = (
  timeZone: string,
  now: Date = new Date(),
): Date => {
  const { year, month, day } = getDatePartsInTimeZone(now, timeZone);

  return new Date(year, month - 1, day, 23, 59, 59, 999);
};

/**
 * Обратный путь: строки UI → UTC ISO для бэка.
 *
 * UI показывает wall-clock зоны (например 18:20 по Москве).
 * Бэку нужен абсолютный момент в UTC.
 *
 * Алгоритм:
 * 1) Парсим dd.MM.yyyy и HH:mm как числа.
 * 2) Подбираем UTC-момент, у которого в `timeZone` те же числа на часах.
 * 3) Отдаём toISOString().
 *
 * Пример: 09.07.2026 18:20 + Europe/Moscow → 2026-07-09T15:20:00.000Z
 */
export const dateTimeToZonedISO = (
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
    [day, month, year, hours, minutes, seconds].some((value) =>
      Number.isNaN(value),
    )
  ) {
    return null;
  }

  if (parseDate(dateValue) === null) {
    return null;
  }

  // Черновик: «как будто эти цифры уже в UTC»
  const asIfUtc = Date.UTC(year, month - 1, day, hours, minutes, seconds);

  // Какие цифры у этого черновика реально показывает нужная зона?
  const shownInZone = getDatePartsInTimeZone(new Date(asIfUtc), timeZone);
  const shownAsUtc = Date.UTC(
    shownInZone.year,
    shownInZone.month - 1,
    shownInZone.day,
    shownInZone.hour,
    shownInZone.minute,
    shownInZone.second,
  );

  // Сдвиг = разница между желаемыми цифрами и тем, что зона показала на черновике
  const utcMillis = asIfUtc + (asIfUtc - shownAsUtc);

  return new Date(utcMillis).toISOString();
};

/** Диапазон start/end → ISO UTC + timeZone */
export const periodToZonedISO = (
  date: Period,
  time: Period,
  timeZone: string = MOSCOW_TIME_ZONE,
): ZonedISOPeriod => ({
  start: dateTimeToZonedISO(date.start, time.start, timeZone),
  end: dateTimeToZonedISO(date.end, time.end, timeZone),
  timeZone,
});
