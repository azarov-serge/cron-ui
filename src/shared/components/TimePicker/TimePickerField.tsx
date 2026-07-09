import React from 'react';
import { type ComponentDimension, Field } from '@admiral-ds/react-ui';
import { normalizeTimeToMinuteStep } from '@shared/components/TimePicker/utils/time';
import * as Styled from './styles';
import { TimePicker } from './TimePicker';
import { coerceEmptyToNull } from './utils';

export interface TimePickerFieldProps {
  className?: string;
  label?: string;
  value: string | null;
  dimension?: ComponentDimension;
  disabled?: boolean;
  minTime?: string | null;
  maxTime?: string | null;
  minuteStep?: number;
  withSeconds?: boolean;
  displayClearIcon?: boolean;
  showNow?: boolean;
  onChange: (value: string | null) => void;
}

export const TimePickerField: React.FC<TimePickerFieldProps> = (props) => {
  const {
    className,
    label,
    value,
    dimension,
    disabled,
    minTime = null,
    maxTime = null,
    minuteStep = 1,
    withSeconds = false,
    displayClearIcon = false,
    showNow = false,
    onChange,
  } = props;

  const coercedValue = coerceEmptyToNull(value);
  const normalizedValue = normalizeTimeToMinuteStep(coercedValue, minuteStep);

  React.useEffect(() => {
    if (normalizedValue !== coercedValue) {
      onChange(normalizedValue);
    }
  }, [coercedValue, normalizedValue, onChange]);

  const timePicker = (
    <TimePicker
      value={normalizedValue}
      dimension={dimension}
      disabled={disabled}
      minTime={minTime}
      maxTime={maxTime}
      minuteStep={minuteStep}
      withSeconds={withSeconds}
      displayClearIcon={displayClearIcon}
      showNow={showNow}
      onChange={onChange}
    />
  );

  if (!label) {
    return <Styled.Root className={className}>{timePicker}</Styled.Root>;
  }

  return (
    <Styled.Root className={className}>
      <Field label={label} disabled={disabled}>
        {timePicker}
      </Field>
    </Styled.Root>
  );
};
