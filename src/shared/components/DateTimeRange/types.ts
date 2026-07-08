import type {
  ComponentDimension,
  DateInputProps,
} from '@admiral-ds/react-ui';

export type DateValidator = NonNullable<DateInputProps['validator']>;

export type Period = { start: string; end: string };

export type DateTimeRangeProps = {
  className?: string;
  date: Period;
  onDateChange: (date: Period) => void;
  time: Period;
  onTimeChange: (time: Period) => void;
  dimension?: ComponentDimension;
  minDate?: Date;
  maxDate?: Date;
  minuteStep?: number;
  validator?: DateValidator;
};
