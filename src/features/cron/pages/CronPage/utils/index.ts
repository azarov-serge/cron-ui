import type { CronRequireField } from '@features/cron/components/CronEditor';

export const MINUTE_STEP_OPTIONS = [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30] as const;

export const DAILY_FREQUENCY_VALUES = ['once', 'every'] as const;

export const REQUIRE_FIELD_VALUES = [
  'weeklyWeekDays',
  'weeklyWeekNumbers',
] as const satisfies readonly CronRequireField[];

export const toggleMultiSelect = <OptionValue extends string>(
  selectedValues: OptionValue[],
  value: OptionValue,
  checked: boolean,
): OptionValue[] => {
  if (checked) {
    if (selectedValues.includes(value)) {
      return selectedValues;
    }

    return [...selectedValues, value];
  }

  if (selectedValues.length <= 1) {
    return selectedValues;
  }

  return selectedValues.filter((item) => item !== value);
};

export const toggleRequireField = (
  selectedValues: CronRequireField[],
  value: CronRequireField,
  checked: boolean,
): CronRequireField[] => {
  if (checked) {
    if (selectedValues.includes(value)) {
      return selectedValues;
    }

    return [...selectedValues, value];
  }

  return selectedValues.filter((item) => item !== value);
};

