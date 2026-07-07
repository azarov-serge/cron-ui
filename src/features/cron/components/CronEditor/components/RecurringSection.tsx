import React from 'react';
import { getIsRecurring } from '../utils';
import { DailyFrequencySection } from './DailyFrequencySection';
import { FrequencySection } from './FrequencySection';
import type { CronSectionProps } from './types';

export const RecurringSection: React.FC<CronSectionProps> = (props) => {
  const { value, options, onChange } = props;

  if (!getIsRecurring(value)) {
    return null;
  }

  return (
    <>
      <FrequencySection value={value} options={options} onChange={onChange} />
      <DailyFrequencySection
        value={value}
        options={options}
        onChange={onChange}
      />
    </>
  );
};
