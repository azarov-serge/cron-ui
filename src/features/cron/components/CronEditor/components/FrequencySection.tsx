import { Option, SelectField, T } from '@admiral-ds/react-ui';
import type { ScheduleInterface } from '../models/schedule/types';
import { InlineRow, Section } from '../styles';
import { Legend } from './Legend';
import { MonthlyFields } from './MonthlyFields';
import { WeeklyFields } from './WeeklyFields';
import { useCronEditorConfig } from '../hooks/useCronEditorConfig';
import { useCronEditorStore } from '../hooks/useCronEditorStore';
import { useTranslation } from '@shared/i18n/useTranslation';

export const FrequencySection = () => {
  const { t } = useTranslation();
  const { showOccursChoice, occursOptions } = useCronEditorConfig();
  const occurs = useCronEditorStore((state) => state.schedule.occurs);
  const patchSchedule = useCronEditorStore((state) => state.patchSchedule);

  return (
    <Section>
      <Legend>{t.editor.frequency}</Legend>
      {showOccursChoice && (
        <InlineRow>
          <T font="Body/Body 1 Short" color="Neutral/Neutral 90" as="span">
            {t.editor.occurs}
          </T>
          <SelectField
            dimension="s"
            value={occurs}
            onChange={(event) =>
              patchSchedule({
                occurs: event.target.value as ScheduleInterface['occurs'],
              })
            }
          >
            {occursOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </SelectField>
        </InlineRow>
      )}

      {occurs === 'monthly' && <MonthlyFields />}
      {occurs === 'weekly' && <WeeklyFields />}
    </Section>
  );
};
