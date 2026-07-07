/** Округляет минуты времени до ближайшего кратного minuteStep */
export const normalizeTimeToMinuteStep = (
  time: string | null,
  minuteStep: number,
): string | null => {
  if (!time) {
    return null;
  }

  const hasSeconds = /^\d{2}:\d{2}:\d{2}$/.test(time);
  const { hour, minute, second } = splitTimeString(time, hasSeconds);

  if (minuteStep <= 1) {
    return hasSeconds
      ? combineTimeString(hour, minute, second)
      : combineTimeString(hour, minute);
  }

  const hourValue = Number.parseInt(hour, 10);
  const minuteValue = Number.parseInt(minute, 10);
  const snapped = Math.min(59, Math.round(minuteValue / minuteStep) * minuteStep);
  const snappedMinute = String(snapped).padStart(2, '0');
  const snappedHour = String(hourValue).padStart(2, '0');

  return hasSeconds
    ? combineTimeString(snappedHour, snappedMinute, second)
    : combineTimeString(snappedHour, snappedMinute);
};

/** Список часов 00–23 для колонки TimePicker */
export const getHourOptions = (): string[] =>
  Array.from({ length: 24 }, (_, hour) => String(hour).padStart(2, '0'));

/** Список минут с учётом шага для колонки TimePicker */
export const getMinuteOptionsForStep = (minuteStep: number): string[] => {
  const step = minuteStep <= 1 ? 1 : minuteStep;
  const minutes: string[] = [];

  for (let minute = 0; minute < 60; minute += step) {
    minutes.push(String(minute).padStart(2, '0'));
  }

  return minutes;
};

export type TimeParts = {
  hour: string;
  minute: string;
  second?: string;
};

/** Разбивает HH:mm или HH:mm:ss на части; при невалидном значении — 00:00[:00] */
export const splitTimeString = (
  time: string,
  withSeconds = false,
): TimeParts => {
  if (withSeconds) {
    if (!/^\d{2}:\d{2}:\d{2}$/.test(time)) {
      return { hour: '00', minute: '00', second: '00' };
    }

    const [hour, minute, second] = time.split(':');
    return { hour, minute, second };
  }

  if (!/^\d{2}:\d{2}$/.test(time)) {
    return { hour: '00', minute: '00' };
  }

  const [hour, minute] = time.split(':');
  return { hour, minute };
};

/** Собирает HH:mm или HH:mm:ss из частей */
export const combineTimeString = (
  hour: string,
  minute: string,
  second?: string,
): string => {
  const base = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;

  return second !== undefined ? `${base}:${second.padStart(2, '0')}` : base;
};

/** Список секунд 00–59 для колонки TimePicker */
export const getSecondOptions = (): string[] =>
  Array.from({ length: 60 }, (_, second) => String(second).padStart(2, '0'));

/** Приводит минуты к ближайшему допустимому значению для шага */
export const snapMinuteToStep = (
  minute: string,
  minuteStep: number,
): string => {
  if (minuteStep <= 1) {
    return minute.padStart(2, '0');
  }

  const minuteValue = Number.parseInt(minute, 10) || 0;
  const snapped = Math.min(59, Math.round(minuteValue / minuteStep) * minuteStep);

  return String(snapped).padStart(2, '0');
};

/** Слоты выпадающего списка TimeField с учётом шага минут */
export const getTimeSlotsForStep = (
  minuteStep: number,
): Array<{ value: string }> => {
  const step = minuteStep <= 1 ? 1 : minuteStep;
  const timeSlots: Array<{ value: string }> = [];

  for (const hour of getHourOptions()) {
    for (const minute of getMinuteOptionsForStep(step)) {
      timeSlots.push({ value: combineTimeString(hour, minute) });
    }
  }

  return timeSlots;
};
