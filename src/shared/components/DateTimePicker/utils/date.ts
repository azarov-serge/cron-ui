const DATE_PATTERN = /^(\d{2})\.(\d{2})\.(\d{4})$/;
const TIME_ONLY_PATTERN = /^\d{2}:\d{2}(?::\d{2})?$/;
const DATE_TIME_VALUE_PATTERN =
  /^(\d{2}\.\d{2}\.\d{4})(?:\s+(\d{2}:\d{2}(?::\d{2})?))?$/;

export type DateTimeParts = {
  date: string;
  time: string | null;
};

/** Пустая маска Admiral (`__.__.____`) — без цифр; неполная с цифрами нужна для ввода с клавиатуры */
const isEmptyDateMask = (date: string): boolean => {
  const trimmed = date.trim();

  return !trimmed || !/\d/.test(trimmed);
};

/** Склеивает `dd.MM.yyyy` и `HH:mm[:ss]` в одну строку value */
export const joinDateTimeValue = (
  date: string,
  time: string | null | undefined,
): string => {
  // Пустая маска не храним; частичный ввод (`1_.__.____`) сохраняем
  const datePart = isEmptyDateMask(date) ? '' : date.trim();
  const timePart = (time ?? '').trim();

  if (!datePart && !timePart) {
    return '';
  }

  if (!timePart) {
    return datePart;
  }

  if (!datePart) {
    return timePart;
  }

  return `${datePart} ${timePart}`;
};

/**
 * Разбирает `dd.MM.yyyy[ HH:mm[:ss]]` на части для DateInput / TimePicker.
 * Неполная маска даты без времени остаётся в `date`.
 * Строка только со временем (`HH:mm`) — в `time`, не в `date`.
 */
export const splitDateTimeValue = (value: string): DateTimeParts => {
  const trimmed = value.trim();

  if (!trimmed) {
    return { date: '', time: null };
  }

  const fullMatch = DATE_TIME_VALUE_PATTERN.exec(trimmed);

  if (fullMatch) {
    return {
      date: fullMatch[1],
      time: fullMatch[2] ?? null,
    };
  }

  // join без даты отдаёт только время — не путать с датой
  if (TIME_ONLY_PATTERN.test(trimmed)) {
    return { date: '', time: trimmed };
  }

  const spaceIndex = trimmed.indexOf(' ');

  if (spaceIndex === -1) {
    return { date: trimmed, time: null };
  }

  const date = trimmed.slice(0, spaceIndex);
  const time = trimmed.slice(spaceIndex + 1).trim();

  return { date, time: time || null };
};

export const parseDateValue = (dateValue: string): Date | null => {
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

  return parsed;
};

/** Полная маска dd.mm.yyyy, но дата не существует (22.22.2222, 31.02.2026) */
export const isInvalidDate = (dateValue: string): boolean => {
  const trimmed = dateValue.trim();

  if (!trimmed || !DATE_PATTERN.test(trimmed)) {
    return false;
  }

  return parseDateValue(trimmed) === null;
};

/** Дата полностью введена и существует (не маска `__.__.____` и не 31.02) */
export const isCompleteDate = (dateValue: string): boolean =>
  parseDateValue(dateValue) !== null;

const toDayTime = (date: Date): number =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

/** Полная существующая дата вне minDate/maxDate (сравнение по календарному дню) */
export const isDateOutOfBounds = (
  dateValue: string,
  bounds: { minDate?: Date; maxDate?: Date },
): boolean => {
  const parsed = parseDateValue(dateValue);

  if (!parsed) {
    return false;
  }

  const day = toDayTime(parsed);

  if (bounds.minDate && day < toDayTime(bounds.minDate)) {
    return true;
  }

  if (bounds.maxDate && day > toDayTime(bounds.maxDate)) {
    return true;
  }

  return false;
};

export const INVALID_DATE_MESSAGE = 'Некорректная дата';
export const DATE_OUT_OF_BOUNDS_MESSAGE = 'Дата вне допустимого диапазона';

/** Текст ошибки даты или `undefined`, если ошибки нет */
export const getDateErrorMessage = (
  dateValue: string,
  bounds?: { minDate?: Date; maxDate?: Date },
): string | undefined => {
  if (isInvalidDate(dateValue)) {
    return INVALID_DATE_MESSAGE;
  }

  if (bounds && isDateOutOfBounds(dateValue, bounds)) {
    return DATE_OUT_OF_BOUNDS_MESSAGE;
  }

  return undefined;
};
