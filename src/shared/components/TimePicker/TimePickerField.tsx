import { Field } from '@admiral-ds/react-ui';
import { useEffect, type FC } from 'react';
import { TimePicker } from './TimePicker';
import { normalizeTimeToMinuteStep } from '@shared/utils/time';

export interface TimePickerFieldProps {
  label?: string;
  value: string;
  disabled?: boolean;
  minuteStep?: number;
  onChange: (value: string) => void;
}

export const TimePickerField: FC<TimePickerFieldProps> = (props) => {
  const {
    label,
    value,
    disabled,
    minuteStep = 1,
    onChange,
  } = props;

  const normalizedValue = normalizeTimeToMinuteStep(value, minuteStep);

  useEffect(() => {
    if (normalizedValue !== value) {
      onChange(normalizedValue);
    }
  }, [normalizedValue, onChange, value]);

  const timePicker = (
    <TimePicker
      value={normalizedValue}
      disabled={disabled}
      minuteStep={minuteStep}
      onChange={onChange}
    />
  );

  if (!label) {
    return timePicker;
  }

  return (
    <Field label={label} disabled={disabled}>
      {timePicker}
    </Field>
  );
};
