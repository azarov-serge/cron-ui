import React from 'react';
import { Button, T } from '@admiral-ds/react-ui';
import { normalizeTimeToMinuteStep } from '@shared/components/TimePicker/utils/time';
import { isInvalidDate } from '@shared/components/DateTimePicker/utils/date';
import {
  DateTimeRange,
  isInvalidRange,
  type DateValidator,
  type DateTimeRangeProps,
  type Period,
} from '@shared/components/DateTimeRange';
import {
  clampToMoscowNow,
  getMoscowTodayMaxDate,
  isAfterMoscowNow,
  periodToMoscowISO,
} from './dateTimeRangeFieldUtils';
import styled from 'styled-components';

export interface DateTimeRangeFieldProps {
  /** Колбэк «отправки на бэк» — ISO в UTC, wall-clock интерпретирован как Europe/Moscow */
  onSubmit?: (payload: {
    start: string;
    end: string;
    timeZone: string;
  }) => void;
}

const MINUTE_STEP = 5;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
`;

const PayloadBlock = styled.pre`
  margin: 12px 0 0;
  padding: 12px;
  overflow-x: auto;
  border-radius: 8px;
  background: ${({ theme }) => theme.color['Neutral/Neutral 05']};
  color: ${({ theme }) => theme.color['Neutral/Neutral 90']};
  font: var(--admiral-font-Body_Body2Long, inherit);
  white-space: pre-wrap;
  word-break: break-word;
`;

export const DateTimeRangeField: React.FC<DateTimeRangeFieldProps> = (
  props,
) => {
  const { onSubmit } = props;

  const [date, setDate] = React.useState<Period>({ start: '', end: '' });
  const [time, setTime] = React.useState<Period>({ start: '', end: '' });
  const [submittedPayload, setSubmittedPayload] = React.useState<{
    start: string;
    end: string;
    timeZone: string;
  } | null>(null);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  // Календарь: сегодняшний день по Москве (локальные Y/M/D для Admiral)
  const calendarMaxDate = getMoscowTodayMaxDate();

  const validator = React.useMemo<DateValidator>(
    () => ({
      invalidValue: (value) => {
        if (!value) {
          return null;
        }

        const selectedDay = new Date(
          value.getFullYear(),
          value.getMonth(),
          value.getDate(),
        ).getTime();
        const maxDay = new Date(
          calendarMaxDate.getFullYear(),
          calendarMaxDate.getMonth(),
          calendarMaxDate.getDate(),
        ).getTime();

        if (selectedDay > maxDay) {
          return 'Дата вне диапазона';
        }

        return null;
      },
      invalidRange: () => null,
      invalidYear: () => null,
      invalidMonth: () => null,
    }),
    [calendarMaxDate],
  );

  const normalizeTime = (timeValue: string): string => {
    if (!timeValue.trim()) {
      return timeValue;
    }

    return normalizeTimeToMinuteStep(timeValue, MINUTE_STEP) ?? timeValue;
  };

  const applyBoundedSideValue = (
    side: 'start' | 'end',
    nextDateValue: string,
    nextTimeValue: string,
  ) => {
    const normalizedTime = normalizeTime(nextTimeValue);
    const bounded = clampToMoscowNow(
      nextDateValue,
      normalizedTime,
      MINUTE_STEP,
    );

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

  // Страховка: если в state всё же оказалось будущее (гонка / старый value) — clamp
  React.useLayoutEffect(() => {
    const startBounded = clampToMoscowNow(date.start, time.start, MINUTE_STEP);
    const endBounded = clampToMoscowNow(date.end, time.end, MINUTE_STEP);

    if (startBounded.changed) {
      setDate((prevValue) => ({ ...prevValue, start: startBounded.date }));
      setTime((prevValue) => ({ ...prevValue, start: startBounded.time }));
    }

    if (endBounded.changed) {
      setDate((prevValue) => ({ ...prevValue, end: endBounded.date }));
      setTime((prevValue) => ({ ...prevValue, end: endBounded.time }));
    }
  }, [date.end, date.start, time.end, time.start]);

  const startDateInvalid = isInvalidDate(date.start);
  const endDateInvalid = isInvalidDate(date.end);

  const rangeInvalid = React.useMemo(
    () =>
      !startDateInvalid &&
      !endDateInvalid &&
      isInvalidRange(date.start, time.start, date.end, time.end),
    [
      date.end,
      date.start,
      endDateInvalid,
      startDateInvalid,
      time.end,
      time.start,
    ],
  );

  const startBoundError = React.useMemo(() => {
    if (startDateInvalid) {
      return null;
    }

    return isAfterMoscowNow(date.start, time.start, MINUTE_STEP) ? 'max' : null;
  }, [date.start, startDateInvalid, time.start]);

  const endBoundError = React.useMemo(() => {
    if (endDateInvalid) {
      return null;
    }

    return isAfterMoscowNow(date.end, time.end, MINUTE_STEP) ? 'max' : null;
  }, [date.end, endDateInvalid, time.end]);

  const canSubmit =
    Boolean(date.start && time.start && date.end && time.end) &&
    !startDateInvalid &&
    !endDateInvalid &&
    !rangeInvalid &&
    startBoundError === null &&
    endBoundError === null;

  const handleSubmit = () => {
    if (!canSubmit) {
      setSubmitError('Заполните корректный диапазон даты и времени.');
      setSubmittedPayload(null);
      return;
    }

    const iso = periodToMoscowISO(date, time);

    if (!iso.start || !iso.end) {
      setSubmitError('Не удалось преобразовать дату и время в ISO.');
      setSubmittedPayload(null);
      return;
    }

    const payload = {
      start: iso.start,
      end: iso.end,
      timeZone: iso.timeZone,
    };

    setSubmitError(null);
    setSubmittedPayload(payload);
    onSubmit?.(payload);
  };

  return (
    <>
      <DateTimeRange
        date={date}
        onDateChange={handleDateRangeDateChange}
        time={time}
        onTimeChange={handleDateRangeTimeChange}
        maxDate={calendarMaxDate}
        minuteStep={MINUTE_STEP}
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

      <Actions>
        <Button
          appearance="primary"
          dimension="s"
          type="button"
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          Выполнить
        </Button>
      </Actions>

      {submitError ? (
        <T font="Body/Body 2 Long" color="Error/Error 60 Main" as="p">
          {submitError}
        </T>
      ) : null}

      {submittedPayload ? (
        <PayloadBlock>{JSON.stringify(submittedPayload, null, 2)}</PayloadBlock>
      ) : null}
    </>
  );
};
