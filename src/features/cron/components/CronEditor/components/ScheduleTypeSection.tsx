import React from 'react';
import { RadioButton } from '@admiral-ds/react-ui';
import * as Styled from '../styles';
import { Legend } from './Legend';
import { getScheduleType, setScheduleType } from '../utils';
import { useCronEditorConfig } from '../hooks';
import { useTranslation } from '@shared/i18n/useTranslation';
import type { CronSectionProps } from './types';

export const ScheduleTypeSection: React.FC<CronSectionProps> = (props) => {
  const { value, options, onChange } = props;
  const { t } = useTranslation();
  const { showScheduleTypeChoice, scheduleTypeOptions } =
    useCronEditorConfig(options);
  const scheduleType = getScheduleType(value);

  if (!showScheduleTypeChoice) {
    return null;
  }

  return (
    <Styled.Section>
      <Legend>{t.editor.scheduleTypeLegend}</Legend>
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
