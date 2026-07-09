import type {
  ComponentDimension,
  DateInputProps,
} from '@admiral-ds/react-ui';

export type DateValidator = NonNullable<DateInputProps['validator']>;

export type Period = { start: string; end: string };

/** Диапазон в ISO 8601 (UTC), `null` — если дата или время не заполнены */
export type ISOPeriod = { start: string | null; end: string | null };

export type DateTimeRangeProps = {
  className?: string;
  date: Period;
  onDateChange: (date: Period) => void;
  time: Period;
  onTimeChange: (time: Period) => void;
  dimension?: ComponentDimension;
  minDate?: Date;
  maxDate?: Date;
  /** Нижняя граница времени для обеих сторон */
  minTime?: string | null;
  /** Верхняя граница времени для обеих сторон */
  maxTime?: string | null;
  /** Границы времени отдельно для start / end (приоритетнее minTime/maxTime) */
  startMinTime?: string | null;
  startMaxTime?: string | null;
  endMinTime?: string | null;
  endMaxTime?: string | null;
  minuteStep?: number;
  validator?: DateValidator;
};
