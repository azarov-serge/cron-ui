import React from 'react';
import { DateTimePicker } from '@shared/components/DateTimePicker';
import { useTranslation } from '@shared/i18n/useTranslation';
import * as Styled from '../styles';
import { Legend } from './Legend';
import { getOneTimeSchedule, setOneTimeDate, setOneTimeTime } from '../utils';
import type { CronSectionProps } from './types';

export const OneTimeSection: React.FC<CronSectionProps> = (props) => {
  const { value, options, onChange } = props;
  const { t } = useTranslation();
  const { scheduleType, oneTimeDate, oneTimeTime } = getOneTimeSchedule(value);
  const minuteStep = options.minuteStep;

  if (scheduleType !== 'one-time') {
    return null;
  }

  return (
    <Styled.Section>
      <Legend>{t.editor.oneTimeSection}</Legend>
      <DateTimePicker
        label={t.editor.date}
        dateValue={oneTimeDate}
        timeValue={oneTimeTime || null}
        minuteStep={minuteStep}
        onDateChange={(date) => onChange(setOneTimeDate(value, date))}
        onTimeChange={(time) =>
          onChange(setOneTimeTime(value, time ?? '', minuteStep))
        }
      />
    </Styled.Section>
  );
};
