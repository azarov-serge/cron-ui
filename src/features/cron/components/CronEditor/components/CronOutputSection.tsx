import { CronDescriptionField, CronExpressionField } from './CronFields';
import { useCronEditorStore } from '../hooks/useCronEditorStore';
import { useTranslation } from '@shared/i18n/useTranslation';

export const CronOutputSection = () => {
  const { locale } = useTranslation();
  const schedule = useCronEditorStore((state) => state.schedule);

  return (
    <>
      <CronExpressionField expression={schedule.toCron().toExpression()} />
      <CronDescriptionField description={schedule.toDescription(locale) ?? ''} />
    </>
  );
};
