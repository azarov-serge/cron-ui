import React from 'react';
import { Cron } from './models/cron';
import * as Styled from './styles';
import { resolveCronOptions, type CronOptions } from './utils';
import {
  CronOutputSection,
  OneTimeSection,
  RecurringSection,
  ScheduleTypeSection,
} from './components';

export interface CronEditorRUProps {
  value?: Cron;
  onChange?: (value: Cron) => void;
  options?: CronOptions;
}

export const CronEditor: React.FC<CronEditorRUProps> = (props) => {
  const { value, onChange } = props;
  const currentValue = value ?? Cron.createEmpty();
  const options = resolveCronOptions(props.options);

  const handleChange = (nextValue: Cron) => {
    onChange?.(nextValue);
  };

  return (
    <Styled.Form>
      <ScheduleTypeSection
        value={currentValue}
        options={options}
        onChange={handleChange}
      />
      <OneTimeSection
        value={currentValue}
        options={options}
        onChange={handleChange}
      />
      <RecurringSection
        value={currentValue}
        options={options}
        onChange={handleChange}
      />
      <CronOutputSection
        value={currentValue}
        options={options}
        onChange={handleChange}
      />
    </Styled.Form>
  );
};
