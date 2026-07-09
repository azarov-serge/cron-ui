/** Округляет минуты времени до ближайшего кратного minuteStep */
export const normalizeTimeToMinuteStep = (
  time: string | null,
  minuteStep: number,
): string | null => {
  if (!time) {
    return null;
  }

  const hasSeconds = /^\d{2}:\d{2}:\d{2}$/.test(time);
  const { hour, minute, second } = splitTimeString(time, hasSeconds);

  if (minuteStep <= 1) {
    return hasSeconds
      ? combineTimeString(hour, minute, second)
      : combineTimeString(hour, minute);
  }

  const hourValue = Number.parseInt(hour, 10);
  const minuteValue = Number.parseInt(minute, 10);
  const snapped = Math.min(59, Math.round(minuteValue / minuteStep) * minuteStep);
  const snappedMinute = String(snapped).padStart(2, '0');
  const snappedHour = String(hourValue).padStart(2, '0');

  return hasSeconds
    ? combineTimeString(snappedHour, snappedMinute, second)
    : combineTimeString(snappedHour, snappedMinute);
};

/** Список часов 00–23 для колонки TimePicker */
export const getHourOptions = (): string[] =>
  Array.from({ length: 24 }, (_, hour) => String(hour).padStart(2, '0'));

/** Список минут с учётом шага для колонки TimePicker */
export const getMinuteOptionsForStep = (minuteStep: number): string[] => {
  const step = minuteStep <= 1 ? 1 : minuteStep;
  const minutes: string[] = [];

  for (let minute = 0; minute < 60; minute += step) {
    minutes.push(String(minute).padStart(2, '0'));
  }

  return minutes;
};

export type TimeParts = {
  hour: string;
  minute: string;
  second?: string;
};

/** Разбивает HH:mm или HH:mm:ss на части; при невалидном значении — 00:00[:00] */
export const splitTimeString = (
  time: string,
  withSeconds = false,
): TimeParts => {
  if (withSeconds) {
    if (!/^\d{2}:\d{2}:\d{2}$/.test(time)) {
      return { hour: '00', minute: '00', second: '00' };
    }

    const [hour, minute, second] = time.split(':');
    return { hour, minute, second };
  }

  if (!/^\d{2}:\d{2}$/.test(time)) {
    return { hour: '00', minute: '00' };
  }

  const [hour, minute] = time.split(':');
  return { hour, minute };
};

/** Собирает HH:mm или HH:mm:ss из частей */
export const combineTimeString = (
  hour: string,
  minute: string,
  second?: string,
): string => {
  const base = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;

  return second !== undefined ? `${base}:${second.padStart(2, '0')}` : base;
};

/** Список секунд 00–59 для колонки TimePicker */
export const getSecondOptions = (): string[] =>
  Array.from({ length: 60 }, (_, second) => String(second).padStart(2, '0'));

/** Приводит минуты к ближайшему допустимому значению для шага */
export const snapMinuteToStep = (
  minute: string,
  minuteStep: number,
): string => {
  if (minuteStep <= 1) {
    return minute.padStart(2, '0');
  }

  const minuteValue = Number.parseInt(minute, 10) || 0;
  const snapped = Math.min(59, Math.round(minuteValue / minuteStep) * minuteStep);

  return String(snapped).padStart(2, '0');
};

/** Слоты выпадающего списка TimeField с учётом шага минут */
export const getTimeSlotsForStep = (
  minuteStep: number,
): Array<{ value: string }> => {
  const step = minuteStep <= 1 ? 1 : minuteStep;
  const timeSlots: Array<{ value: string }> = [];

  for (const hour of getHourOptions()) {
    for (const minute of getMinuteOptionsForStep(step)) {
      timeSlots.push({ value: combineTimeString(hour, minute) });
    }
  }

  return timeSlots;
};

/** HH:mm[:ss] → секунды от полуночи; невалидное — null */
export const timeToSeconds = (time: string | null | undefined): number | null => {
  if (!time) {
    return null;
  }

  const trimmed = time.trim();
  const withSeconds = /^\d{2}:\d{2}:\d{2}$/.test(trimmed);
  const withoutSeconds = /^\d{2}:\d{2}$/.test(trimmed);

  if (!withSeconds && !withoutSeconds) {
    return null;
  }

  const { hour, minute, second } = splitTimeString(trimmed, withSeconds);
  const hours = Number.parseInt(hour, 10);
  const minutes = Number.parseInt(minute, 10);
  const seconds = Number.parseInt(second ?? '0', 10);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    Number.isNaN(seconds) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59 ||
    seconds < 0 ||
    seconds > 59
  ) {
    return null;
  }

  return hours * 3600 + minutes * 60 + seconds;
};

export type TimeBounds = {
  minTime?: string | null;
  maxTime?: string | null;
};

const isWithinBounds = (
  seconds: number,
  bounds: TimeBounds,
): boolean => {
  const minSeconds = timeToSeconds(bounds.minTime);
  const maxSeconds = timeToSeconds(bounds.maxTime);

  if (minSeconds !== null && seconds < minSeconds) {
    return false;
  }

  if (maxSeconds !== null && seconds > maxSeconds) {
    return false;
  }

  return true;
};

/** Час недоступен, если ни одна минута/секунда в нём не попадает в [minTime, maxTime] */
export const isHourOutOfBounds = (
  hour: string,
  bounds: TimeBounds,
): boolean => {
  const hourValue = Number.parseInt(hour, 10);

  if (Number.isNaN(hourValue)) {
    return true;
  }

  const dayStart = hourValue * 3600;
  const dayEnd = dayStart + 3599;

  const minSeconds = timeToSeconds(bounds.minTime) ?? 0;
  const maxSeconds = timeToSeconds(bounds.maxTime) ?? 23 * 3600 + 59 * 60 + 59;

  return dayEnd < minSeconds || dayStart > maxSeconds;
};

/** Минута недоступна при выбранном часе */
export const isMinuteOutOfBounds = (
  hour: string,
  minute: string,
  bounds: TimeBounds,
): boolean => {
  const hourValue = Number.parseInt(hour, 10);
  const minuteValue = Number.parseInt(minute, 10);

  if (Number.isNaN(hourValue) || Number.isNaN(minuteValue)) {
    return true;
  }

  const minuteStart = hourValue * 3600 + minuteValue * 60;
  const minuteEnd = minuteStart + 59;

  const minSeconds = timeToSeconds(bounds.minTime) ?? 0;
  const maxSeconds = timeToSeconds(bounds.maxTime) ?? 23 * 3600 + 59 * 60 + 59;

  return minuteEnd < minSeconds || minuteStart > maxSeconds;
};

/** Секунда недоступна при выбранных часе и минуте */
export const isSecondOutOfBounds = (
  hour: string,
  minute: string,
  second: string,
  bounds: TimeBounds,
): boolean => {
  const seconds = timeToSeconds(
    combineTimeString(hour, minute, second),
  );

  if (seconds === null) {
    return true;
  }

  return !isWithinBounds(seconds, bounds);
};

/** Clamp полного времени к [minTime, maxTime]; null — без изменений */
export const clampTimeToBounds = (
  time: string | null,
  bounds: TimeBounds,
  withSeconds = false,
): string | null => {
  if (!time) {
    return time;
  }

  const seconds = timeToSeconds(time);

  if (seconds === null) {
    return time;
  }

  const minSeconds = timeToSeconds(bounds.minTime);
  const maxSeconds = timeToSeconds(bounds.maxTime);
  let next = seconds;

  if (minSeconds !== null && next < minSeconds) {
    next = minSeconds;
  }

  if (maxSeconds !== null && next > maxSeconds) {
    next = maxSeconds;
  }

  if (next === seconds) {
    return time;
  }

  const hours = Math.floor(next / 3600);
  const minutes = Math.floor((next % 3600) / 60);
  const secs = next % 60;

  return withSeconds
    ? combineTimeString(
        String(hours),
        String(minutes),
        String(secs),
      )
    : combineTimeString(String(hours), String(minutes));
};
