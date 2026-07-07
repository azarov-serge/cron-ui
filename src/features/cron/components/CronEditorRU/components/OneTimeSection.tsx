import React from 'react';
import { DateField } from '@admiral-ds/react-ui';
import { TimePickerField } from '@shared/components/TimePicker';
import * as Styled from '../styles';
import { getOneTimeSchedule, setOneTimeDate, setOneTimeTime } from '../utils';
import { Legend } from './Legend';
import type { CronSectionProps } from './types';

export const OneTimeSection: React.FC<CronSectionProps> = (props) => {
  const { value, options, onChange } = props;
  const { scheduleType, oneTimeDate, oneTimeTime } = getOneTimeSchedule(value);
  const minuteStep = options.minuteStep;

  if (scheduleType !== 'one-time') {
    return null;
  }

  return (
    <Styled.Section>
      <Legend>Однократное выполнение</Legend>
      <Styled.InlineRow>
        <Styled.DateFieldWrap>
          <DateField
            dimension="s"
            label="Дата"
            value={oneTimeDate}
            onChange={(event) =>
              onChange(setOneTimeDate(value, event.target.value))
            }
          />
        </Styled.DateFieldWrap>
        <Styled.TimeFieldWrap>
          <TimePickerField
            label="Время"
            value={oneTimeTime}
            minuteStep={minuteStep}
            onChange={(time) =>
              onChange(setOneTimeTime(value, time ?? '', minuteStep))
            }
          />
        </Styled.TimeFieldWrap>
      </Styled.InlineRow>
    </Styled.Section>
  );
};
