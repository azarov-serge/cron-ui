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
import {
  useCronEditorConfig,
  useCronEditorValidation,
} from '../hooks';
import { useTranslation } from '@shared/i18n/useTranslation';
import type { CronSectionProps } from './types';

export const WeeklyFields: React.FC<CronSectionProps> = (props) => {
  const { value, options, onChange } = props;
  const { t } = useTranslation();
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
        {weekDaysRequired ? t.editor.weekDays : t.editor.weekDaysOptional}
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
            {t.editor.weekDaysLabels[day]}
          </CheckboxField>
        ))}
      </Styled.WeekDaysGrid>
      {isWeekDaysInvalid && (
        <Styled.FieldHint $error $inSection>
          {t.editor.pickWeekDay}
        </Styled.FieldHint>
      )}
      {!weekDaysRequired && (
        <Styled.FieldHint $inSection>
          {t.editor.weekDaysEmptyHint}
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
              ? t.editor.weekNumbers
              : t.editor.weekNumbersOptional}
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
                {`${t.editor.weekNumbersLabels[week]} ${t.editor.weekNumberSuffix}`}
              </CheckboxField>
            ))}
          </Styled.WeekDaysGrid>
          {isWeekNumbersInvalid && (
            <Styled.FieldHint $error $inSection>
              {t.editor.pickWeekNumber}
            </Styled.FieldHint>
          )}
          {!weekNumbersRequired && (
            <Styled.FieldHint $inSection>
              {t.editor.weekNumbersEmptyHint}
            </Styled.FieldHint>
          )}
        </>
      )}
    </>
  );
};
