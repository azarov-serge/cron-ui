import {
  combineTimeString,
  snapMinuteToStep,
} from '@shared/components/TimePicker/utils/time';

export const isCompleteTime = (time: string, withSeconds: boolean): boolean => {
  const pattern = withSeconds ? /^\d{2}:\d{2}:\d{2}$/ : /^\d{2}:\d{2}$/;
  return pattern.test(time) && !time.includes('_');
};

export const parseTimeValue = (
  time: string | undefined,
  withSeconds: boolean,
): string => (time && isCompleteTime(time, withSeconds) ? time : '');

export const toDisplayValue = (value: string | null): string => value ?? '';

export const coerceEmptyToNull = (value: string | null): string | null =>
  value ? value : null;

export const scrollOptionIntoView = (
  listElement: HTMLUListElement | null,
  selectedValue: string,
) => {
  if (!listElement) {
    return;
  }

  const selectedButton = listElement.querySelector(
    `[data-value="${selectedValue}"]`,
  );

  if (selectedButton instanceof HTMLElement) {
    selectedButton.scrollIntoView({ block: 'center' });
  }
};

export const getCurrentTimeString = (
  minuteStep: number,
  withSeconds: boolean,
): string => {
  const now = new Date();
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = snapMinuteToStep(String(now.getMinutes()), minuteStep);

  if (withSeconds) {
    const second = String(now.getSeconds()).padStart(2, '0');
    return combineTimeString(hour, minute, second);
  }

  return combineTimeString(hour, minute);
};
