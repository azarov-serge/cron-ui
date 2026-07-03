import { getOneTimeCronYearNotice } from '@features/cron/components/CronEditor/constants';
import { Cron } from '@features/cron/components/CronEditor/models/cron';
import type { Locale } from '@shared/i18n/messages';
import { ScheduleModel } from '@features/cron/components/CronEditor/models/schedule';

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

const PART_LABELS: Record<CronPartKey, string> = {
  minute: 'Минута',
  hour: 'Час',
  dayOfMonth: 'День месяца',
  month: 'Месяц',
  dayOfWeek: 'День недели',
};

const MONTH_NAMES: Record<number, string> = {
  1: 'январь',
  2: 'февраль',
  3: 'март',
  4: 'апрель',
  5: 'май',
  6: 'июнь',
  7: 'июль',
  8: 'август',
  9: 'сентябрь',
  10: 'октябрь',
  11: 'ноябрь',
  12: 'декабрь',
};

const WEEK_DAY_NAMES: Record<number, string> = {
  0: 'воскресенье',
  1: 'понедельник',
  2: 'вторник',
  3: 'среда',
  4: 'четверг',
  5: 'пятница',
  6: 'суббота',
};

const describeWildcard = (value: string, anyLabel: string): string => {
  if (value === '*') {
    return anyLabel;
  }

  if (value.startsWith('*/')) {
    const step = value.slice(2);
    return `каждые ${step}`;
  }

  return value;
};

const describeMonth = (value: string): string => {
  if (value === '*') {
    return 'каждый месяц';
  }

  const monthNumber = Number.parseInt(value, 10);
  if (!Number.isNaN(monthNumber) && MONTH_NAMES[monthNumber]) {
    return MONTH_NAMES[monthNumber];
  }

  return value;
};

const describeDayOfWeek = (value: string): string => {
  if (value === '*') {
    return 'любой день недели';
  }

  if (value.includes('#')) {
    return value;
  }

  const dayNumber = Number.parseInt(value, 10);
  if (!Number.isNaN(dayNumber) && WEEK_DAY_NAMES[dayNumber]) {
    return WEEK_DAY_NAMES[dayNumber];
  }

  return value;
};

const describeDayOfMonth = (value: string): string => {
  if (value === '*') {
    return 'каждый день месяца';
  }

  if (value.startsWith('*/')) {
    return describeWildcard(value, 'каждый день месяца');
  }

  const dayNumber = Number.parseInt(value, 10);
  if (!Number.isNaN(dayNumber)) {
    return `${dayNumber}-е число`;
  }

  return value;
};

const buildPartHint = (key: CronPartKey, value: string): string => {
  switch (key) {
    case 'minute':
      return describeWildcard(value, 'каждую минуту');
    case 'hour':
      return describeWildcard(value, 'каждый час');
    case 'dayOfMonth':
      return describeDayOfMonth(value);
    case 'month':
      return describeMonth(value);
    case 'dayOfWeek':
      return describeDayOfWeek(value);
    default:
      return value;
  }
};

const buildParts = (parts: string[]): CronPartBreakdown[] => {
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
      label: PART_LABELS[key],
      value,
      hint: buildPartHint(key, value),
    };
  });
};

/** Проверяет cron-выражение и возвращает расшифровку полей */
export const parseCronExpression = (
  expression: string,
  locale: Locale = 'ru',
): CronParseResult => {
  const trimmed = expression.trim();

  if (!trimmed) {
    return {
      valid: false,
      expression: trimmed,
      error: 'Введите cron-выражение',
    };
  }

  const parts = trimmed.split(/\s+/).filter(Boolean);

  if (parts.length !== 5) {
    return {
      valid: false,
      expression: trimmed,
      error: `Ожидается 5 полей: минута час день_месяца месяц день_недели. Получено: ${parts.length}`,
    };
  }

  const cron = Cron.fromString(trimmed);

  // Прямой перевод выражения через cronstrue (эталон «как есть»).
  let cronDescription: string;
  try {
    cronDescription = cron.toString({
      locale,
      throwExceptionOnParseError: true,
    });
  } catch {
    return {
      valid: false,
      expression: trimmed,
      error: 'Не удалось разобрать выражение. Проверьте синтаксис полей.',
    };
  }

  if (cronDescription === trimmed) {
    return {
      valid: false,
      expression: trimmed,
      error: 'Выражение не распознано. Проверьте допустимые значения полей.',
    };
  }

  // Round-trip через модель редактора — тот же путь, что в CronEditor и на карточке.
  const schedule = ScheduleModel.fromCron(cron);
  const scheduleDescription = schedule.toDescription();
  const oneTimeNotice =
    schedule.scheduleType === 'one-time'
      ? getOneTimeCronYearNotice(schedule.oneTimeDate)
      : undefined;

  return {
    valid: true,
    expression: trimmed,
    cron,
    parts: buildParts(parts),
    cronDescription,
    scheduleDescription,
    oneTimeNotice,
  };
};
