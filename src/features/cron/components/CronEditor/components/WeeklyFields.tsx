import { CheckboxField, T } from '@admiral-ds/react-ui';
import { WEEK_NUMBER_KEYS } from '../models/schedule/types';
import { FieldHint, WeekDaysGrid } from '../styles';
import { useCronEditorConfig } from '../hooks/useCronEditorConfig';
import { useCronEditorValidation } from '../hooks/useCronEditorValidation';
import { useCronEditorStore } from '../hooks/useCronEditorStore';
import { isCronFieldRequired } from '../utils/options';
import { useTranslation } from '@shared/i18n/useTranslation';

export const WeeklyFields = () => {
  const { t } = useTranslation();
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
        {weekDaysRequired ? t.editor.weekDays : t.editor.weekDaysOptional}
      </T>
      <WeekDaysGrid>
        {weekDayKeys.map((day) => (
          <CheckboxField
            key={day}
            dimension="s"
            checked={weekDays[day]}
            onChange={(event) => setWeekDay(day, event.target.checked)}
          >
            {t.editor.weekDaysLabels[day]}
          </CheckboxField>
        ))}
      </WeekDaysGrid>
      {isWeekDaysInvalid && (
        <FieldHint $error $inSection>
          {t.editor.pickWeekDay}
        </FieldHint>
      )}
      {!weekDaysRequired && (
        <FieldHint $inSection>{t.editor.weekDaysEmptyHint}</FieldHint>
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
          <WeekDaysGrid>
            {WEEK_NUMBER_KEYS.map((week) => (
              <CheckboxField
                key={week}
                dimension="s"
                checked={weekNumbers[week]}
                onChange={(event) => setWeekNumber(week, event.target.checked)}
              >
                {`${t.editor.weekNumbersLabels[week]} ${t.editor.weekNumberSuffix}`}
              </CheckboxField>
            ))}
          </WeekDaysGrid>
          {isWeekNumbersInvalid && (
            <FieldHint $error $inSection>
              {t.editor.pickWeekNumber}
            </FieldHint>
          )}
          {!weekNumbersRequired && (
            <FieldHint $inSection>{t.editor.weekNumbersEmptyHint}</FieldHint>
          )}
        </>
      )}
    </>
  );
};
