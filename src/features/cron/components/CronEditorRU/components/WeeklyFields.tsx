import React from 'react';
import { CheckboxField, T } from '@admiral-ds/react-ui';
import * as Styled from '../styles';
import {
  isCronFieldRequired,
  parseScheduleFromCron,
  toggleWeekDay,
  toggleWeekNumber,
  WEEK_NUMBER_KEYS,
} from '../utils';
import { useCronEditorConfig, useCronEditorValidation } from '../hooks';
import { WEEK_DAYS_LABELS, WEEK_NUMBERS_LABELS } from '../strings';
import type { CronSectionProps } from './types';

export const WeeklyFields: React.FC<CronSectionProps> = (props) => {
  const { value, options, onChange } = props;
  const { weekDayKeys } = useCronEditorConfig(options);
  const { isWeekDaysInvalid, isWeekNumbersInvalid } = useCronEditorValidation(
    value,
    options,
  );
  const { weekDays, weekNumbers } = parseScheduleFromCron(value);

  const weekDaysRequired = isCronFieldRequired(
    options.requires,
    'weeklyWeekDays',
  );
  const weekNumbersRequired = isCronFieldRequired(
    options.requires,
    'weeklyWeekNumbers',
  );

  return (
    <>
      <T
        font="Body/Body 2 Short"
        color="Neutral/Neutral 50"
        style={{ display: 'block', marginBottom: 8 }}
      >
        {weekDaysRequired ? 'Дни недели' : 'Дни недели (необязательно)'}
      </T>
      <Styled.WeekDaysGrid>
        {weekDayKeys.map((day) => (
          <CheckboxField
            key={day}
            dimension="s"
            checked={weekDays[day]}
            onChange={(event) =>
              onChange(toggleWeekDay(value, day, event.target.checked))
            }
          >
            {WEEK_DAYS_LABELS[day]}
          </CheckboxField>
        ))}
      </Styled.WeekDaysGrid>
      {isWeekDaysInvalid && (
        <Styled.FieldHint $error $inSection>
          Выберите хотя бы один день недели
        </Styled.FieldHint>
      )}
      {!weekDaysRequired && (
        <Styled.FieldHint $inSection>
          Если ничего не выбрано — каждый день недели
        </Styled.FieldHint>
      )}

      {options.weeklyWeekNumbers && (
        <>
          <T
            font="Body/Body 2 Short"
            color="Neutral/Neutral 50"
            style={{ display: 'block', marginTop: 16 }}
          >
            {weekNumbersRequired
              ? 'Недели месяца'
              : 'Недели месяца (необязательно)'}
          </T>
          <Styled.WeekDaysGrid>
            {WEEK_NUMBER_KEYS.map((week) => (
              <CheckboxField
                key={week}
                dimension="s"
                checked={weekNumbers[week]}
                onChange={(event) =>
                  onChange(toggleWeekNumber(value, week, event.target.checked))
                }
              >
                {`${WEEK_NUMBERS_LABELS[week]} неделя`}
              </CheckboxField>
            ))}
          </Styled.WeekDaysGrid>
          {isWeekNumbersInvalid && (
            <Styled.FieldHint $error $inSection>
              Выберите хотя бы одну неделю месяца
            </Styled.FieldHint>
          )}
          {!weekNumbersRequired && (
            <Styled.FieldHint $inSection>
              Если ничего не выбрано — запуск каждую неделю
            </Styled.FieldHint>
          )}
        </>
      )}
    </>
  );
};
