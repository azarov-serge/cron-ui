import React from 'react';
import { RadioButton } from '@admiral-ds/react-ui';
import * as Styled from '../styles';
import { getScheduleType, setScheduleType } from '../utils';
import { useCronEditorConfig } from '../hooks';
import { Legend } from './Legend';
import type { CronSectionProps } from './types';

export const ScheduleTypeSection: React.FC<CronSectionProps> = (props) => {
  const { value, options, onChange } = props;
  const { showScheduleTypeChoice, scheduleTypeOptions } =
    useCronEditorConfig(options);
  const scheduleType = getScheduleType(value);

  if (!showScheduleTypeChoice) {
    return null;
  }

  return (
    <Styled.Section>
      <Legend>Тип расписания</Legend>
      <Styled.InlineRow>
        {scheduleTypeOptions.map((option) => (
          <RadioButton
            key={option.value}
            dimension="s"
            name="scheduleType"
            value={option.value}
            checked={scheduleType === option.value}
            onChange={() => onChange(setScheduleType(value, option.value))}
          >
            {option.label}
          </RadioButton>
        ))}
      </Styled.InlineRow>
    </Styled.Section>
  );
};
