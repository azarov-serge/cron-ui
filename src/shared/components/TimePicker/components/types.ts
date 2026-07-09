import type React from 'react';

export type TimeColumnProps = {
  ariaLabel: string;
  options: string[];
  selected: string;
  listRef: React.Ref<HTMLUListElement>;
  /** option → true, если недоступна (minTime/maxTime) */
  isOptionDisabled?: (option: string) => boolean;
  onSelect: (value: string) => void;
};

export type TimePickerFooterProps = {
  onNow: () => void;
};
