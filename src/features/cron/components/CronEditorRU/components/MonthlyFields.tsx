import React from 'react';
import { NumberInputField, T } from '@admiral-ds/react-ui';
import * as Styled from '../styles';
import { getDayOfMonth, setDayOfMonth } from '../utils';
import type { CronSectionProps } from './types';

export const MonthlyFields: React.FC<CronSectionProps> = (props) => {
  const { value, onChange } = props;
  const dayOfMonth = getDayOfMonth(value);

  return (
    <Styled.InlineRow style={{ marginTop: 12 }}>
      <T font="Body/Body 2 Long" color="Neutral/Neutral 90">
        День
      </T>
      <Styled.NarrowField>
        <NumberInputField
          dimension="s"
          minValue={1}
          maxValue={31}
          precision={0}
          value={dayOfMonth}
          onChange={(event) =>
            onChange(setDayOfMonth(value, Number(event.target.value) || 1))
          }
        />
      </Styled.NarrowField>
      <T font="Body/Body 2 Long" color="Neutral/Neutral 90">
        месяца
      </T>
    </Styled.InlineRow>
  );
};
