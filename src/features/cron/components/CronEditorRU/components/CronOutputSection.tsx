import { CronDescriptionField, CronExpressionField } from './CronFields';
import { useCronEditorStore } from '../hooks/useCronEditorStore';

export const CronOutputSection = () => {
  const schedule = useCronEditorStore((state) => state.schedule);

  return (
    <>
      <CronExpressionField expression={schedule.toCron().toExpression()} />
      <CronDescriptionField description={schedule.toDescription() ?? ''} />
    </>
  );
};
