export type ParsedDateTime = {
  value: Date;
};

export type ParsedDate = {
  value: Date;
};

const DATE_PATTERN = /^(\d{2})\.(\d{2})\.(\d{4})$/;
const TIME_PATTERN = /^(\d{2}):(\d{2})(?::(\d{2}))?$/;

const pad2 = (value: number): string => String(value).padStart(2, '0');

export const formatDate = (value: Date): string => {
  const day = pad2(value.getDate());
  const month = pad2(value.getMonth() + 1);
  const year = value.getFullYear();

  return `${day}.${month}.${year}`;
};

export const formatTime = (value: Date): string => {
  const hours = pad2(value.getHours());
  const minutes = pad2(value.getMinutes());

  return `${hours}:${minutes}`;
};

export const parseDateTime = (
  dateValue: string,
  timeValue: string,
): ParsedDateTime | null => {
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

  if (
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31 ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59 ||
    seconds < 0 ||
    seconds > 59
  ) {
    return null;
  }

  const parsed = new Date(year, month - 1, day, hours, minutes, seconds, 0);

  // Защита от несуществующих дат (например, 31.02.2026)
  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }

  return { value: parsed };
};

export const parseDate = (dateValue: string): ParsedDate | null => {
  const dateMatch = DATE_PATTERN.exec(dateValue.trim());

  if (!dateMatch) {
    return null;
  }

  const day = Number.parseInt(dateMatch[1], 10);
  const month = Number.parseInt(dateMatch[2], 10);
  const year = Number.parseInt(dateMatch[3], 10);

  if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year)) {
    return null;
  }

  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }

  const parsed = new Date(year, month - 1, day, 0, 0, 0, 0);

  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }

  return { value: parsed };
};

export const clampToNow = (
  dateValue: string,
  timeValue: string,
  now: Date,
): { date: string; time: string; changed: boolean } => {
  const parsed = parseDateTime(dateValue, timeValue);
  const parsedDate = parseDate(dateValue);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (!parsed) {
    if (parsedDate && parsedDate.value.getTime() > today.getTime()) {
      return { date: formatDate(now), time: timeValue, changed: true };
    }

    return { date: dateValue, time: timeValue, changed: false };
  }

  if (parsed.value.getTime() <= now.getTime()) {
    return { date: dateValue, time: timeValue, changed: false };
  }

  return {
    date: formatDate(now),
    time: formatTime(now),
    changed: true,
  };
};

export const clampToBounds = (
  dateValue: string,
  timeValue: string,
  bounds: {
    minDate?: Date;
    maxDate?: Date;
  },
): { date: string; time: string; changed: boolean } => {
  const { minDate, maxDate } = bounds;
  const parsed = parseDateTime(dateValue, timeValue);
  const parsedDate = parseDate(dateValue);

  const minDay = minDate
    ? new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())
    : undefined;
  const maxDay = maxDate
    ? new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate())
    : undefined;

  if (!parsed) {
    if (parsedDate && minDay && parsedDate.value.getTime() < minDay.getTime()) {
      return { date: formatDate(minDay), time: timeValue, changed: true };
    }

    if (parsedDate && maxDay && parsedDate.value.getTime() > maxDay.getTime()) {
      return { date: formatDate(maxDay), time: timeValue, changed: true };
    }

    return { date: dateValue, time: timeValue, changed: false };
  }

  if (minDate && parsed.value.getTime() < minDate.getTime()) {
    return {
      date: formatDate(minDate),
      time: formatTime(minDate),
      changed: true,
    };
  }

  if (maxDate && parsed.value.getTime() > maxDate.getTime()) {
    return {
      date: formatDate(maxDate),
      time: formatTime(maxDate),
      changed: true,
    };
  }

  return { date: dateValue, time: timeValue, changed: false };
};

export const isInvalidRange = (
  startDate: string,
  startTime: string,
  endDate: string,
  endTime: string,
): boolean => {
  const start = parseDateTime(startDate, startTime);
  const end = parseDateTime(endDate, endTime);

  if (!start || !end) {
    return false;
  }

  return end.value.getTime() < start.value.getTime();
};

export const getBoundError = (
  dateValue: string,
  timeValue: string,
  bounds: {
    minDate?: Date;
    maxDate?: Date;
  },
): 'min' | 'max' | null => {
  const parsed = parseDateTime(dateValue, timeValue);

  if (!parsed) {
    return null;
  }

  if (bounds.minDate && parsed.value.getTime() < bounds.minDate.getTime()) {
    return 'min';
  }

  if (bounds.maxDate && parsed.value.getTime() > bounds.maxDate.getTime()) {
    return 'max';
  }

  return null;
};

