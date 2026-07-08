import React from 'react';
import { T } from '@admiral-ds/react-ui';
import {
  clampToBounds,
  DateTimeRange,
  getBoundError,
  isInvalidRange,
  type DateValidator,
  type DateTimeRangeProps,
  type Period,
} from '@shared/components/DateTimeRange';

export interface DateTimeRangeFieldProps {
  minDate?: Date;
  maxDate?: Date;
  minuteStep?: number;
}

export const DateTimeRangeField: React.FC<DateTimeRangeFieldProps> = (
  props,
) => {
  const { minDate, maxDate, minuteStep = 5 } = props;

  const [date, setDate] = React.useState<Period>({ start: '', end: '' });
  const [time, setTime] = React.useState<Period>({ start: '', end: '' });

  const maxDateTime = maxDate ?? new Date();
  const minDateTime = minDate;

  const validator = React.useMemo<DateValidator>(
    () => ({
      invalidValue: (value) => {
        if (!value) {
          return null;
        }

        if (minDateTime && value.getTime() < minDateTime.getTime()) {
          return 'Дата вне диапазона';
        }

        if (value.getTime() > maxDateTime.getTime()) {
          return 'Дата вне диапазона';
        }

        return null;
      },
      invalidRange: () => null,
      invalidYear: () => null,
      invalidMonth: () => null,
    }),
    [maxDateTime, minDateTime],
  );

  const applyBoundedSideValue = (
    side: 'start' | 'end',
    nextDateValue: string,
    nextTimeValue: string,
  ) => {
    const bounded = clampToBounds(nextDateValue, nextTimeValue, {
      minDate: minDateTime,
      maxDate: maxDateTime,
    });

    if (side === 'start') {
      setDate((prevValue) => ({ ...prevValue, start: bounded.date }));
      setTime((prevValue) => ({ ...prevValue, start: bounded.time }));
      return;
    }

    setDate((prevValue) => ({ ...prevValue, end: bounded.date }));
    setTime((prevValue) => ({ ...prevValue, end: bounded.time }));
  };

  const handleDateRangeDateChange: DateTimeRangeProps['onDateChange'] = (
    nextDate,
  ) => {
    if (nextDate.start !== date.start) {
      applyBoundedSideValue('start', nextDate.start, time.start);
    }

    if (nextDate.end !== date.end) {
      applyBoundedSideValue('end', nextDate.end, time.end);
    }
  };

  const handleDateRangeTimeChange: DateTimeRangeProps['onTimeChange'] = (
    nextTime,
  ) => {
    if (nextTime.start !== time.start) {
      applyBoundedSideValue('start', date.start, nextTime.start);
    }

    if (nextTime.end !== time.end) {
      applyBoundedSideValue('end', date.end, nextTime.end);
    }
  };

  const rangeInvalid = React.useMemo(
    () => isInvalidRange(date.start, time.start, date.end, time.end),
    [date.end, date.start, time.end, time.start],
  );

  const startBoundError = React.useMemo(
    () =>
      getBoundError(date.start, time.start, {
        minDate: minDateTime,
        maxDate: maxDateTime,
      }),
    [date.start, maxDateTime, minDateTime, time.start],
  );

  const endBoundError = React.useMemo(
    () =>
      getBoundError(date.end, time.end, {
        minDate: minDateTime,
        maxDate: maxDateTime,
      }),
    [date.end, maxDateTime, minDateTime, time.end],
  );

  return (
    <>
      <DateTimeRange
        date={date}
        onDateChange={handleDateRangeDateChange}
        time={time}
        onTimeChange={handleDateRangeTimeChange}
        minDate={minDateTime}
        maxDate={maxDateTime}
        minuteStep={minuteStep}
        validator={validator}
      />

      {rangeInvalid ? (
        <T font="Body/Body 2 Long" color="Error/Error 60 Main" as="p">
          Некорректный диапазон: время окончания должно быть позже времени
          начала.
        </T>
      ) : null}

      {startBoundError === 'max' || endBoundError === 'max' ? (
        <T font="Body/Body 2 Long" color="Error/Error 60 Main" as="p">
          Нельзя выбрать дату и время в будущем.
        </T>
      ) : null}

      {startBoundError === 'min' || endBoundError === 'min' ? (
        <T font="Body/Body 2 Long" color="Error/Error 60 Main" as="p">
          Дата и время меньше допустимого минимального значения.
        </T>
      ) : null}
    </>
  );
};
