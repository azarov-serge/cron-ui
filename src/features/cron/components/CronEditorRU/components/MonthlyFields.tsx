import { NumberInputField, T } from '@admiral-ds/react-ui';
import { InlineRow, NarrowField } from '../styles';
import { useCronEditorStore } from '../hooks/useCronEditorStore';
import { editorStrings } from '../strings';

export const MonthlyFields = () => {
  const dayOfMonth = useCronEditorStore((state) => state.schedule.dayOfMonth);
  const patchSchedule = useCronEditorStore((state) => state.patchSchedule);

  return (
    <InlineRow style={{ marginTop: 12 }}>
      <T font="Body/Body 2 Long" color="Neutral/Neutral 90">
        {editorStrings.day}
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
        {editorStrings.ofMonth}
      </T>
    </InlineRow>
  );
};
