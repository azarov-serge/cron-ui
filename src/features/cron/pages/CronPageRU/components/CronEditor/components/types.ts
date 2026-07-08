import { Cron } from '../models/cron';
import type { CronOptions } from '../utils';

export type CronSectionProps = {
  value: Cron;
  options: Required<CronOptions>;
  onChange: (value: Cron) => void;
};
