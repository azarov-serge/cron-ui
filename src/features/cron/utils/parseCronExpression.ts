import { Cron } from '@features/cron/components/CronEditor/models/cron';
import type { Locale, Messages } from '@shared/i18n/messages';
import { formatMessage, getOneTimeYearNotice, messages } from '@shared/i18n/messages';
import { describeCronHuman } from '@features/cron/utils/describeCron';
import { Schedule } from '@features/cron/components/CronEditor/models/schedule';

export type CronPartKey =
  | 'minute'
  | 'hour'
  | 'dayOfMonth'
  | 'month'
  | 'dayOfWeek';

export type CronPartBreakdown = {
  key: CronPartKey;
  label: string;
  value: string;
  hint: string;
};

export type CronParseSuccess = {
  valid: true;
  expression: string;
  cron: Cron;
  parts: CronPartBreakdown[];
  cronDescription: string;
  scheduleDescription: string;
  oneTimeNotice?: string;
};

export type CronParseFailure = {
  valid: false;
  expression: string;
  error: string;
};

export type CronParseResult = CronParseSuccess | CronParseFailure;

const describeWildcard = (
  value: string,
  anyLabel: string,
  everyNTemplate: string,
): string => {
  if (value === '*') {
    return anyLabel;
  }

  if (value.startsWith('*/')) {
    const step = value.slice(2);
    return formatMessage(everyNTemplate, { step });
  }

  return value;
};

const describeMonth = (
  value: string,
  parse: Messages['checkerParse'],
): string => {
  if (value === '*') {
    return parse.hints.everyMonth;
  }

  const monthNumber = Number.parseInt(value, 10);
  const monthName = parse.months[monthNumber as keyof typeof parse.months];
  if (!Number.isNaN(monthNumber) && monthName) {
    return monthName;
  }

  return value;
};

const describeDayOfWeek = (
  value: string,
  parse: Messages['checkerParse'],
): string => {
  if (value === '*') {
    return parse.hints.anyDayOfWeek;
  }

  if (value.includes('#')) {
    return value;
  }

  const dayNumber = Number.parseInt(value, 10);
  const dayName = parse.weekDays[dayNumber as keyof typeof parse.weekDays];
  if (!Number.isNaN(dayNumber) && dayName) {
    return dayName;
  }

  return value;
};

const describeDayOfMonth = (
  value: string,
  parse: Messages['checkerParse'],
): string => {
  if (value === '*') {
    return parse.hints.everyDayOfMonth;
  }

  if (value.startsWith('*/')) {
    return describeWildcard(
      value,
      parse.hints.everyDayOfMonth,
      parse.hints.everyN,
    );
  }

  const dayNumber = Number.parseInt(value, 10);
  if (!Number.isNaN(dayNumber)) {
    return formatMessage(parse.hints.dayOfMonthNth, { day: dayNumber });
  }

  return value;
};

const buildPartHint = (
  key: CronPartKey,
  value: string,
  parse: Messages['checkerParse'],
): string => {
  switch (key) {
    case 'minute':
      return describeWildcard(value, parse.hints.everyMinute, parse.hints.everyN);
    case 'hour':
      return describeWildcard(value, parse.hints.everyHour, parse.hints.everyN);
    case 'dayOfMonth':
      return describeDayOfMonth(value, parse);
    case 'month':
      return describeMonth(value, parse);
    case 'dayOfWeek':
      return describeDayOfWeek(value, parse);
    default:
      return value;
  }
};

const buildParts = (
  parts: string[],
  parse: Messages['checkerParse'],
): CronPartBreakdown[] => {
  const keys: CronPartKey[] = [
    'minute',
    'hour',
    'dayOfMonth',
    'month',
    'dayOfWeek',
  ];

  return keys.map((key, index) => {
    const value = parts[index] ?? '';

    return {
      key,
      label: parse.partLabels[key],
      value,
      hint: buildPartHint(key, value, parse),
    };
  });
};

/** Проверяет cron-выражение и возвращает расшифровку полей */
export const parseCronExpression = (
  expression: string,
  locale: Locale = 'ru',
): CronParseResult => {
  const t = messages[locale];
  const parse = t.checkerParse;
  const trimmed = expression.trim();

  if (!trimmed) {
    return {
      valid: false,
      expression: trimmed,
      error: parse.emptyExpression,
    };
  }

  const parts = trimmed.split(/\s+/).filter(Boolean);

  if (parts.length !== 5) {
    return {
      valid: false,
      expression: trimmed,
      error: formatMessage(parse.wrongFieldCount, { count: parts.length }),
    };
  }

  const cron = Cron.fromString(trimmed);

  let cronDescription: string;
  try {
    cronDescription = describeCronHuman(cron, locale);
  } catch {
    return {
      valid: false,
      expression: trimmed,
      error: parse.parseFailed,
    };
  }

  if (cronDescription === trimmed) {
    return {
      valid: false,
      expression: trimmed,
      error: parse.notRecognized,
    };
  }

  const schedule = Schedule.fromCron(cron);
  const scheduleDescription = schedule.toDescription(locale);
  const oneTimeNotice =
    schedule.scheduleType === 'one-time'
      ? getOneTimeYearNotice(schedule.oneTimeDate, t)
      : undefined;

  return {
    valid: true,
    expression: trimmed,
    cron,
    parts: buildParts(parts, parse),
    cronDescription,
    scheduleDescription,
    oneTimeNotice,
  };
};
