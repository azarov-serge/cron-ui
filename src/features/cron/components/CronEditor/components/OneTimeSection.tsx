import React from 'react';
import { DateField } from '@admiral-ds/react-ui';
import { TimePickerField } from '@shared/components/TimePicker';
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
      <Styled.InlineRow>
        <Styled.DateFieldWrap>
          <DateField
            dimension="s"
            label={t.editor.date}
            value={oneTimeDate}
            onChange={(event) =>
              onChange(setOneTimeDate(value, event.target.value))
            }
          />
        </Styled.DateFieldWrap>
        <Styled.TimeFieldWrap>
          <TimePickerField
            label={t.editor.time}
            value={oneTimeTime}
            minuteStep={minuteStep}
            onChange={(time) =>
              onChange(setOneTimeTime(value, time, minuteStep))
            }
          />
        </Styled.TimeFieldWrap>
      </Styled.InlineRow>
    </Styled.Section>
  );
};
