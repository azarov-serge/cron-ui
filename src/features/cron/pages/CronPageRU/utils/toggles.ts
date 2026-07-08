import type { CronRequireField } from '../components/CronEditor';

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

