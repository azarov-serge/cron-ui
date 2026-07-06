import { NumberInputField, T } from '@admiral-ds/react-ui';
import { InlineRow, NarrowField } from '../styles';
import { useCronEditorStore } from '../hooks/useCronEditorStore';
import { useTranslation } from '@shared/i18n/useTranslation';

export const MonthlyFields = () => {
  const { t } = useTranslation();
  const dayOfMonth = useCronEditorStore((state) => state.schedule.dayOfMonth);
  const patchSchedule = useCronEditorStore((state) => state.patchSchedule);

  return (
    <InlineRow style={{ marginTop: 12 }}>
      <T font="Body/Body 2 Long" color="Neutral/Neutral 90">
        {t.editor.day}
      </T>
      <NarrowField>
        <NumberInputField
          dimension="s"
          minValue={1}
          maxValue={31}
          precision={0}
          value={dayOfMonth}
          onChange={(event) =>
            patchSchedule({
              dayOfMonth: Number(event.target.value) || 1,
            })
          }
        />
      </NarrowField>
      <T font="Body/Body 2 Long" color="Neutral/Neutral 90">
        {t.editor.ofMonth}
      </T>
    </InlineRow>
  );
};
