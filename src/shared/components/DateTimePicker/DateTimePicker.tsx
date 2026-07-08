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

  const coercedTimeValue = coerceEmptyToNull(timeValue);
  const normalizedTimeValue = normalizeTimeToMinuteStep(
    coercedTimeValue,
    minuteStep,
  );

  React.useEffect(() => {
    if (normalizedTimeValue !== coercedTimeValue) {
      onTimeChange(normalizedTimeValue);
    }
  }, [coercedTimeValue, normalizedTimeValue, onTimeChange]);

  const picker = (
    <Styled.Container disabled={disabled} readOnly={readOnly} status={status}>
      <Styled.DateInput
        dimension={dimension}
        value={dateValue}
        minDate={minDate}
        maxDate={maxDate}
        validator={validator}
        disabled={disabled}
        readOnly={readOnly}
        status={status}
        onChange={(event) => onDateChange(event.target.value)}
      />
      <DateTimeSeparator
        disabled={disabled}
        readOnly={readOnly}
        status={status}
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
          onChange={onTimeChange}
        />
      </Styled.TimeWrap>
    </Styled.Container>
  );

  if (!label) {
    return <Styled.Root className={className}>{picker}</Styled.Root>;
  }

  return (
    <Styled.Root className={className}>
      <Field label={label} disabled={disabled} status={status}>
        {picker}
      </Field>
    </Styled.Root>
  );
};
