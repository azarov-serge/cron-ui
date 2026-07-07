import React from 'react';
import { Option, SelectField, T } from '@admiral-ds/react-ui';
import * as Styled from '../styles';
import { Legend } from './Legend';
import { MonthlyFields } from './MonthlyFields';
import { WeeklyFields } from './WeeklyFields';
import { getOccurs, setOccurs, type ScheduleInterface } from '../utils';
import { useCronEditorConfig } from '../hooks';
import { useTranslation } from '@shared/i18n/useTranslation';
import type { CronSectionProps } from './types';

export const FrequencySection: React.FC<CronSectionProps> = (props) => {
  const { value, options, onChange } = props;
  const { t } = useTranslation();
  const { showOccursChoice, occursOptions } = useCronEditorConfig(options);
  const occurs = getOccurs(value);

  return (
    <Styled.Section>
      <Legend>{t.editor.frequency}</Legend>
      {showOccursChoice && (
        <Styled.InlineRow>
          <T font="Body/Body 1 Short" color="Neutral/Neutral 90" as="span">
            {t.editor.occurs}
          </T>
          <SelectField
            dimension="s"
            value={occurs}
            onChange={(event) =>
              onChange(
                setOccurs(
                  value,
                  event.target.value as ScheduleInterface['occurs'],
                ),
              )
            }
          >
            {occursOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </SelectField>
        </Styled.InlineRow>
      )}

      {occurs === 'monthly' && (
        <MonthlyFields value={value} options={options} onChange={onChange} />
      )}
      {occurs === 'weekly' && (
        <WeeklyFields value={value} options={options} onChange={onChange} />
      )}
    </Styled.Section>
  );
};
