/** Округляет минуты времени до ближайшего кратного minuteStep */
export const normalizeTimeToMinuteStep = (
  time: string,
  minuteStep: number,
): string => {
  if (!time) {
    return '';
  }

  if (minuteStep <= 1) {
    return time;
  }

  const [hourPart, minutePart] = time.split(':');
  const hour = Number.parseInt(hourPart || '0', 10);
  const minute = Number.parseInt(minutePart || '0', 10);
  const snapped = Math.min(59, Math.round(minute / minuteStep) * minuteStep);

  return `${String(hour).padStart(2, '0')}:${String(snapped).padStart(2, '0')}`;
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

/** Разбивает HH:mm на части; при невалидном значении — 00:00 */
export const splitTimeString = (
  time: string,
): { hour: string; minute: string } => {
  if (!/^\d{2}:\d{2}$/.test(time)) {
    return { hour: '00', minute: '00' };
  }

  const [hour, minute] = time.split(':');
  return { hour, minute };
};

/** Собирает HH:mm из часов и минут */
export const combineTimeString = (hour: string, minute: string): string =>
  `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;

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
