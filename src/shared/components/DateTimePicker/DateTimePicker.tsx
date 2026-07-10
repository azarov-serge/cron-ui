import React from 'react';
import {
  DateTimeSeparator,
  type ComponentDimension,
  type DateInputProps,
  Field,
  type InputStatus,
} from '@admiral-ds/react-ui';
import { normalizeTimeToMinuteStep } from '../TimePicker/utils/time';
import { TimePicker } from '../TimePicker';
import { coerceEmptyToNull } from '../TimePicker/utils';
import { inputBoxJoin } from '../TimePicker/mixins';
import {
  DATE_OUT_OF_BOUNDS_MESSAGE,
  INVALID_DATE_MESSAGE,
  isDateOutOfBounds,
  isInvalidDate,
  joinDateTimeValue,
  splitDateTimeValue,
} from './utils/date';
import * as Styled from './styles';

export interface DateTimePickerProps {
  className?: string;
  label?: string;
  /** `dd.MM.yyyy[ HH:mm[:ss]]` */
  value: string;
  dimension?: ComponentDimension;
  minDate?: Date;
  maxDate?: Date;
  /** Нижняя граница времени `HH:mm[:ss]` для TimePicker */
  minTime?: string | null;
  /** Верхняя граница времени `HH:mm[:ss]` для TimePicker */
  maxTime?: string | null;
  validator?: DateInputProps['validator'];
  disabled?: boolean;
  readOnly?: boolean;
  status?: InputStatus;
  minuteStep?: number;
  withSeconds?: boolean;
  displayClearIcon?: boolean;
  showNow?: boolean;
  onChange: (value: string) => void;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = (props) => {
  const {
    className,
    label,
    value,
    dimension = 's',
    minDate,
    maxDate,
    minTime = null,
    maxTime = null,
    validator,
    disabled,
    readOnly,
    status,
    minuteStep = 1,
    withSeconds = false,
    displayClearIcon = false,
    showNow = false,
    onChange,
  } = props;

  const { date: dateValue, time: timeValue } = splitDateTimeValue(value);
  const dateInvalid = isInvalidDate(dateValue);
  const dateOutOfBounds = isDateOutOfBounds(dateValue, { minDate, maxDate });
  const dateHasError = dateInvalid || dateOutOfBounds;
  const dateErrorMessage = dateInvalid
    ? INVALID_DATE_MESSAGE
    : dateOutOfBounds
      ? DATE_OUT_OF_BOUNDS_MESSAGE
      : undefined;
  const resolvedStatus: InputStatus | undefined = dateHasError
    ? 'error'
    : status;

  const resolvedValidator = React.useMemo<
    DateInputProps['validator'] | undefined
  >(() => {
    if (!validator) {
      // Без кастомного validator Admiral сам применит default по minDate/maxDate
      return undefined;
    }

    return {
      invalidValue: (nextValue) => {
        if (nextValue && Number.isNaN(nextValue.getTime())) {
          return 'Дата не валидна';
        }

        return validator.invalidValue?.(nextValue) ?? null;
      },
      invalidRange: (startDate, endDate) =>
        validator.invalidRange?.(startDate, endDate) ?? null,
      invalidYear: (year) => validator.invalidYear?.(year) ?? null,
      invalidMonth: (month, year) =>
        validator.invalidMonth?.(month, year) ?? null,
    };
  }, [validator]);

  const coercedTimeValue = coerceEmptyToNull(timeValue);
  const normalizedTimeValue = normalizeTimeToMinuteStep(
    coercedTimeValue,
    minuteStep,
  );

  const emitChange = (nextDate: string, nextTime: string | null) => {
    onChange(joinDateTimeValue(nextDate, nextTime));
  };

  const handleDateChange = (nextDate: string) => {
    emitChange(nextDate, normalizedTimeValue);
  };

  const handleTimeChange = (nextValue: string | null) => {
    emitChange(dateValue, normalizeTimeToMinuteStep(nextValue, minuteStep));
  };

  const picker = (
    <Styled.Container
      disabled={disabled}
      readOnly={readOnly}
      status={resolvedStatus}
    >
      <Styled.DateInput
        dimension={dimension}
        value={dateValue}
        minDate={minDate}
        maxDate={maxDate}
        validator={resolvedValidator}
        disabled={disabled}
        readOnly={readOnly}
        status={resolvedStatus}
        onChange={(event) => handleDateChange(event.target.value)}
      />
      <DateTimeSeparator
        disabled={disabled}
        readOnly={readOnly}
        status={resolvedStatus}
      />
      <Styled.TimeWrap>
        <TimePicker
          value={normalizedTimeValue}
          dimension={dimension}
          disabled={disabled || readOnly}
          minTime={minTime}
          maxTime={maxTime}
          minuteStep={minuteStep}
          withSeconds={withSeconds}
          displayClearIcon={displayClearIcon}
          showNow={showNow}
          inputBoxCss={inputBoxJoin(['left'])}
          onChange={handleTimeChange}
        />
      </Styled.TimeWrap>
    </Styled.Container>
  );

  if (!label) {
    return (
      <Styled.Root className={className}>
        {picker}
        {dateErrorMessage ? (
          <Styled.ErrorText>{dateErrorMessage}</Styled.ErrorText>
        ) : null}
      </Styled.Root>
    );
  }

  return (
    <Styled.Root className={className}>
      <Field
        label={label}
        disabled={disabled}
        status={resolvedStatus}
        extraText={dateErrorMessage}
      >
        {picker}
      </Field>
    </Styled.Root>
  );
};
