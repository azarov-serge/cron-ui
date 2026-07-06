import type { FC } from 'react';
import { Cron } from './models/cron';
import type { CronOptions } from './utils/options';
import { Form } from './styles';
import {
  CronOutputSection,
  OneTimeSection,
  RecurringSection,
  ScheduleTypeSection,
} from './components';
import {
  useCronEditorOnChange,
  useCronEditorSync,
} from './hooks/useCronEditorStore';

export interface CronEditorProps {
  cron?: Cron;
  onChange?: (cron: Cron) => void;
  options?: CronOptions;
}

export const CronEditor: FC<CronEditorProps> = ({ cron, onChange, options }) => {
  useCronEditorSync(cron, options);
  useCronEditorOnChange(onChange);

  return (
    <Form>
      <ScheduleTypeSection />
      <OneTimeSection />
      <RecurringSection />
      <CronOutputSection />
    </Form>
  );
};
