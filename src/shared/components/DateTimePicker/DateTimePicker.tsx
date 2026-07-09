import React from 'react';
import {
  DateTimeSeparator,
  type ComponentDimension,
  type DateInputProps,
  Field,
  type InputStatus,
} from '@admiral-ds/react-ui';
import { normalizeTimeToMinuteStep } from '@shared/components/TimePicker/utils/time';
import { TimePicker } from '../TimePicker';
import { coerceEmptyToNull } from '../TimePicker/utils';
import { inputBoxJoin } from '../TimePicker/mixins';
import { INVALID_DATE_MESSAGE, isInvalidDate } from './utils/date';
import * as Styled from './styles';

export interface DateTimePickerProps {
  className?: string;
  label?: string;
  dateValue: string;
  timeValue: string | null;
  dimension?: ComponentDimension;
  minDate?: Date;
  maxDate?: Date;
  validator?: DateInputProps['validator'];
  disabled?: boolean;
  readOnly?: boolean;
  status?: InputStatus;
  minuteStep?: number;
  withSeconds?: boolean;
  displayClearIcon?: boolean;
  showNow?: boolean;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string | null) => void;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = (props) => {
  const {
    className,
    label,
    dateValue,
    timeValue,
    dimension = 's',
    minDate,
    maxDate,
    validator,
    disabled,
    readOnly,
    status,
    minuteStep = 1,
    withSeconds = false,
    displayClearIcon = false,
    showNow = false,
    onDateChange,
    onTimeChange,
  } = props;

  const dateInvalid = isInvalidDate(dateValue);
  const resolvedStatus: InputStatus | undefined = dateInvalid
    ? 'error'
    : status;

  const resolvedValidator = React.useMemo<DateInputProps['validator']>(() => {
    return {
      invalidValue: (value) => {
        if (value && Number.isNaN(value.getTime())) {
          return 'Дата не валидна';
        }

        return validator?.invalidValue?.(value) ?? null;
      },
      invalidRange: (startDate, endDate) =>
        validator?.invalidRange?.(startDate, endDate) ?? null,
      invalidYear: (year) => validator?.invalidYear?.(year) ?? null,
      invalidMonth: (month, year) =>
        validator?.invalidMonth?.(month, year) ?? null,
    };
  }, [validator]);

  const coercedTimeValue = coerceEmptyToNull(timeValue);
  const normalizedTimeValue = normalizeTimeToMinuteStep(
    coercedTimeValue,
    minuteStep,
  );

  const handleTimeChange = (nextValue: string | null) => {
    onTimeChange(normalizeTimeToMinuteStep(nextValue, minuteStep));
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
        onChange={(event) => onDateChange(event.target.value)}
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
        {dateInvalid ? (
          <Styled.ErrorText>{INVALID_DATE_MESSAGE}</Styled.ErrorText>
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
        extraText={dateInvalid ? INVALID_DATE_MESSAGE : undefined}
      >
        {picker}
      </Field>
    </Styled.Root>
  );
};
