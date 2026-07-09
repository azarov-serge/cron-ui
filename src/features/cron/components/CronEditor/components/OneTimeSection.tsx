import React from 'react';
import { DateTimePicker } from '@shared/components/DateTimePicker';
import {
  joinDateTimeValue,
  splitDateTimeValue,
} from '@shared/components/DateTimePicker/utils/date';
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
        value={joinDateTimeValue(oneTimeDate, oneTimeTime)}
        minuteStep={minuteStep}
        onChange={(nextValue) => {
          const { date, time } = splitDateTimeValue(nextValue);

          onChange(
            setOneTimeTime(
              setOneTimeDate(value, date),
              time ?? '',
              minuteStep,
            ),
          );
        }}
      />
    </Styled.Section>
  );
};
