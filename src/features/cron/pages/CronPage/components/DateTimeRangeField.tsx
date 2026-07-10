import React from 'react';
import { Button, T } from '@admiral-ds/react-ui';
import {
  isCompleteDate,
  isInvalidDate,
  splitDateTimeValue,
} from '@shared/components/DateTimePicker/utils/date';
import {
  DateTimeRange,
  isInvalidRange,
  type Period,
} from '@shared/components/DateTimeRange';
import {
  getNowWallClockInTimeZone,
  getTodayInTimeZone,
  MOSCOW_TIME_ZONE,
  periodToZonedISO,
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
const TIME_ZONE = MOSCOW_TIME_ZONE;

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

  const [value, setValue] = React.useState<Period>({ start: '', end: '' });
  const [submittedPayload, setSubmittedPayload] = React.useState<{
    start: string;
    end: string;
    timeZone: string;
  } | null>(null);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const maxDate = getTodayInTimeZone(TIME_ZONE);
  const nowWallClock = getNowWallClockInTimeZone(TIME_ZONE, MINUTE_STEP);

  const startParts = splitDateTimeValue(value.start);
  const endParts = splitDateTimeValue(value.end);

  const startMaxTime =
    startParts.date === nowWallClock.date ? nowWallClock.time : null;
  const endMaxTime =
    endParts.date === nowWallClock.date ? nowWallClock.time : null;

  const startDateInvalid = isInvalidDate(startParts.date);
  const endDateInvalid = isInvalidDate(endParts.date);
  const startComplete = isCompleteDate(startParts.date);
  const endComplete = isCompleteDate(endParts.date);
  const rangeInvalid =
    startComplete &&
    endComplete &&
    !startDateInvalid &&
    !endDateInvalid &&
    isInvalidRange(value.start, value.end);

  const canSubmit =
    startComplete &&
    endComplete &&
    Boolean(startParts.time && endParts.time) &&
    !startDateInvalid &&
    !endDateInvalid &&
    !rangeInvalid;

  const handleSubmit = () => {
    if (!canSubmit) {
      setSubmitError('Заполните корректный диапазон даты и времени.');
      setSubmittedPayload(null);
      return;
    }

    const iso = periodToZonedISO(value, TIME_ZONE);

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
        value={value}
        onChange={setValue}
        maxDate={maxDate}
        startMaxTime={startMaxTime}
        endMaxTime={endMaxTime}
        minuteStep={MINUTE_STEP}
      />

      {rangeInvalid ? (
        <T font="Body/Body 2 Long" color="Error/Error 60 Main" as="p">
          Некорректный диапазон: время окончания должно быть позже времени
          начала.
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
