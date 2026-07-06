import { FrequencySection } from './FrequencySection';
import { DailyFrequencySection } from './DailyFrequencySection';
import { useCronEditorStore } from '../hooks/useCronEditorStore';

export const RecurringSection = () => {
  const scheduleType = useCronEditorStore((state) => state.schedule.scheduleType);

  if (scheduleType !== 'recurring') {
    return null;
  }

  return (
    <>
      <FrequencySection />
      <DailyFrequencySection />
    </>
  );
};
