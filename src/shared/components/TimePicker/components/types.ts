import type React from 'react';

export type TimeColumnProps = {
  ariaLabel: string;
  options: string[];
  selected: string;
  listRef: React.Ref<HTMLUListElement>;
  onSelect: (value: string) => void;
};

export type TimePickerFooterProps = {
  onNow: () => void;
};
