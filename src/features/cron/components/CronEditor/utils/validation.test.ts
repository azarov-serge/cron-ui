import { describe, expect, it } from 'vitest';
import { createEmptyWeekDays } from './scheduleTypes';
import { validateSchedule } from './validation';
import { messages } from '@shared/i18n/messages';

const editor = messages.ru.editor;

describe('validateSchedule weekly requiredness', () => {
  const weeklySchedule = {
    scheduleType: 'recurring' as const,
    occurs: 'weekly' as const,
    weekDays: createEmptyWeekDays(),
    weekNumbers: { 1: false, 2: false, 3: false, 4: false, 5: false },
    monthWeekNumbersEnabled: false,
    daysOfMonth: [1],
    dailyFrequency: 'once' as const,
    startTimeEnabled: true,
    onceAtTime: '',
    oneTimeDate: '',
    oneTimeTime: '',
    everyInterval: 1,
    everyUnit: 'hours' as const,
  };

  it('не требует дни недели по умолчанию', () => {
    expect(validateSchedule(weeklySchedule, 1, { requires: [] }, editor)).toEqual({
      valid: true,
      message: null,
    });
  });

  it('требует дни недели при requires: weeklyWeekDays', () => {
    expect(
      validateSchedule(weeklySchedule, 1, {
        requires: ['weeklyWeekDays'],
      }, editor),
    ).toEqual({
      valid: false,
      message: 'Выберите хотя бы один день недели',
    });
  });

  it('требует недели месяца при requires: weeklyWeekNumbers', () => {
    const schedule = {
      ...weeklySchedule,
      monthWeekNumbersEnabled: true,
      weekDays: { ...createEmptyWeekDays(), monday: true },
    };

    expect(
      validateSchedule(schedule, 1, {
        weeklyWeekNumbers: true,
        requires: ['weeklyWeekNumbers'],
      }, editor),
    ).toEqual({
      valid: false,
      message: 'Выберите хотя бы одну неделю месяца',
    });
  });
});
