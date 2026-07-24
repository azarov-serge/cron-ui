import React from 'react';
import { Option, SelectField, T } from '@admiral-ds/react-ui';
import * as Styled from '../styles';
import { getDaysOfMonth, setDaysOfMonth } from '../utils';
import { useCronEditorValidation } from '../hooks';
import type { CronSectionProps } from './types';

const DAY_OPTIONS = Array.from({ length: 31 }, (_, index) => String(index + 1));

export const MonthlyFields: React.FC<CronSectionProps> = (props) => {
  const { value, options, onChange } = props;
  const { isDaysOfMonthInvalid } = useCronEditorValidation(value, options);
  const daysOfMonth = getDaysOfMonth(value);
  const selectedValues = daysOfMonth.map(String);

  return (
    <>
      <Styled.InlineRow style={{ marginTop: 12, alignItems: 'flex-start' }}>
        <T font="Body/Body 2 Long" color="Neutral/Neutral 90">
          День
        </T>
        <Styled.DaysSelectWrap>
          <SelectField
            dimension="s"
            multiple
            value={selectedValues}
            status={isDaysOfMonthInvalid ? 'error' : undefined}
            onSelectedChange={(nextValue) => {
              const values = (Array.isArray(nextValue) ? nextValue : [nextValue])
                .map((item) => Number.parseInt(String(item), 10))
                .filter((day) => !Number.isNaN(day) && day >= 1 && day <= 31);
              onChange(
                setDaysOfMonth(value, values.length > 0 ? values : daysOfMonth),
              );
            }}
          >
            {DAY_OPTIONS.map((day) => (
              <Option key={day} value={day}>
                {day}
              </Option>
            ))}
          </SelectField>
        </Styled.DaysSelectWrap>
        <T font="Body/Body 2 Long" color="Neutral/Neutral 90">
          месяца
        </T>
      </Styled.InlineRow>
      {isDaysOfMonthInvalid ? (
        <Styled.FieldHint $error $inSection>
          Выберите хотя бы один день месяца
        </Styled.FieldHint>
      ) : null}
    </>
  );
};
