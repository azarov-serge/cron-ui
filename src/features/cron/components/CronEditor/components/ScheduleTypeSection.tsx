import { RadioButton } from '@admiral-ds/react-ui';
import { InlineRow, Section } from '../styles';
import { Legend } from './Legend';
import { useCronEditorConfig } from '../hooks/useCronEditorConfig';
import { useCronEditorStore } from '../hooks/useCronEditorStore';
import { useTranslation } from '@shared/i18n/useTranslation';

export const ScheduleTypeSection = () => {
  const { t } = useTranslation();
  const { showScheduleTypeChoice, scheduleTypeOptions } = useCronEditorConfig();
  const scheduleType = useCronEditorStore((state) => state.schedule.scheduleType);
  const setScheduleType = useCronEditorStore((state) => state.setScheduleType);

  if (!showScheduleTypeChoice) {
    return null;
  }

  return (
    <Section>
      <Legend>{t.editor.scheduleTypeLegend}</Legend>
      <InlineRow>
        {scheduleTypeOptions.map((option) => (
          <RadioButton
            key={option.value}
            dimension="s"
            name="scheduleType"
            value={option.value}
            checked={scheduleType === option.value}
            onChange={() => setScheduleType(option.value)}
          >
            {option.label}
          </RadioButton>
        ))}
      </InlineRow>
    </Section>
  );
};
