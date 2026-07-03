import { describe, expect, it } from 'vitest';
import { ScheduleModel } from './models/schedule';
import { createEmptyWeekDays } from './models/schedule/types';
import { validateSchedule } from './validation';

describe('validateSchedule weekly requiredness', () => {
  const weeklySchedule = new ScheduleModel({
    occurs: 'weekly',
    weekDays: createEmptyWeekDays(),
  });

  it('не требует дни недели по умолчанию', () => {
    expect(validateSchedule(weeklySchedule, 1, { requires: [] })).toEqual({
      valid: true,
      message: null,
    });
  });

  it('требует дни недели при requires: weeklyWeekDays', () => {
    expect(
      validateSchedule(weeklySchedule, 1, {
        requires: ['weeklyWeekDays'],
      }),
    ).toEqual({
      valid: false,
      message: 'Выберите хотя бы один день недели',
    });
  });

  it('требует недели месяца при requires: weeklyWeekNumbers', () => {
    const schedule = weeklySchedule.copyWith({
      useMonthWeekNumbers: true,
      weekDays: { ...createEmptyWeekDays(), monday: true },
    });

    expect(
      validateSchedule(schedule, 1, {
        weeklyWeekNumbers: true,
        requires: ['weeklyWeekNumbers'],
      }),
    ).toEqual({
      valid: false,
      message: 'Выберите хотя бы одну неделю месяца',
    });
  });
});
