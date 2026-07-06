import { describe, expect, it } from 'vitest';
import { Schedule } from '../models/schedule';
import { createEmptyWeekDays } from '../models/schedule/types';
import { validateSchedule } from './validation';
import { editorStrings } from '../strings';

const editor = editorStrings;

describe('validateSchedule weekly requiredness', () => {
  const weeklySchedule = new Schedule({
    occurs: 'weekly',
    weekDays: createEmptyWeekDays(),
  });

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
    const schedule = weeklySchedule.clone({
      useMonthWeekNumbers: true,
      weekDays: { ...createEmptyWeekDays(), monday: true },
    });

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
