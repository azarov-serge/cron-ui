import { CheckboxField, T } from '@admiral-ds/react-ui';
import { WEEK_NUMBER_KEYS } from '../models/schedule/types';
import { FieldHint, WeekDaysGrid } from '../styles';
import { useCronEditorConfig } from '../hooks/useCronEditorConfig';
import { useCronEditorValidation } from '../hooks/useCronEditorValidation';
import { useCronEditorStore } from '../hooks/useCronEditorStore';
import { isCronFieldRequired } from '../utils/options';
import { editorStrings } from '../strings';

export const WeeklyFields = () => {
  const { options, weekDayKeys } = useCronEditorConfig();
  const { isWeekDaysInvalid, isWeekNumbersInvalid } = useCronEditorValidation();
  const weekDays = useCronEditorStore((state) => state.schedule.weekDays);
  const weekNumbers = useCronEditorStore((state) => state.schedule.weekNumbers);
  const setWeekDay = useCronEditorStore((state) => state.setWeekDay);
  const setWeekNumber = useCronEditorStore((state) => state.setWeekNumber);

  const weekDaysRequired = isCronFieldRequired(options.requires, 'weeklyWeekDays');
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
        {weekDaysRequired
          ? editorStrings.weekDays
          : editorStrings.weekDaysOptional}
      </T>
      <WeekDaysGrid>
        {weekDayKeys.map((day) => (
          <CheckboxField
            key={day}
            dimension="s"
            checked={weekDays[day]}
            onChange={(event) => setWeekDay(day, event.target.checked)}
          >
            {editorStrings.weekDaysLabels[day]}
          </CheckboxField>
        ))}
      </WeekDaysGrid>
      {isWeekDaysInvalid && (
        <FieldHint $error $inSection>
          {editorStrings.pickWeekDay}
        </FieldHint>
      )}
      {!weekDaysRequired && (
        <FieldHint $inSection>{editorStrings.weekDaysEmptyHint}</FieldHint>
      )}

      {options.weeklyWeekNumbers && (
        <>
          <T
            font="Body/Body 2 Short"
            color="Neutral/Neutral 50"
            style={{ display: 'block', marginTop: 16 }}
          >
            {weekNumbersRequired
              ? editorStrings.weekNumbers
              : editorStrings.weekNumbersOptional}
          </T>
          <WeekDaysGrid>
            {WEEK_NUMBER_KEYS.map((week) => (
              <CheckboxField
                key={week}
                dimension="s"
                checked={weekNumbers[week]}
                onChange={(event) => setWeekNumber(week, event.target.checked)}
              >
                {`${editorStrings.weekNumbersLabels[week]} ${editorStrings.weekNumberSuffix}`}
              </CheckboxField>
            ))}
          </WeekDaysGrid>
          {isWeekNumbersInvalid && (
            <FieldHint $error $inSection>
              {editorStrings.pickWeekNumber}
            </FieldHint>
          )}
          {!weekNumbersRequired && (
            <FieldHint $inSection>{editorStrings.weekNumbersEmptyHint}</FieldHint>
          )}
        </>
      )}
    </>
  );
};
