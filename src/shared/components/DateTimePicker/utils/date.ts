const DATE_PATTERN = /^(\d{2})\.(\d{2})\.(\d{4})$/;

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

export const INVALID_DATE_MESSAGE = 'Некорректная дата';
