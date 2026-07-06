import { describe, expect, it } from 'vitest';
import { Cron } from '../cron';
import { Schedule } from './Schedule';
import {
  createDefaultWeekDays,
  createDefaultWeekNumbers,
  createEmptyWeekDays,
  createEmptyWeekNumbers,
} from './types';

describe('Schedule weekly month weeks', () => {
  it('собирает cron с нотацией день#неделя', () => {
    const schedule = new Schedule({
      occurs: 'weekly',
      dailyFrequency: 'once',
      onceAtTime: '09:00',
      weekDays: createDefaultWeekDays(),
      weekNumbers: { ...createEmptyWeekNumbers(), 1: true, 3: true },
      useMonthWeekNumbers: true,
    });

    expect(schedule.toCron().toExpression()).toBe('0 9 * * 1#1,1#3');
  });

  it('восстанавливает недели месяца из cron', () => {
    const schedule = Schedule.fromCron(Cron.fromString('0 9 * * 1#1,1#3'));

    expect(schedule.useMonthWeekNumbers).toBe(true);
    expect(schedule.weekNumbers).toEqual({
      1: true,
      2: false,
      3: true,
      4: false,
      5: false,
    });
    expect(schedule.weekDays.monday).toBe(true);
  });

  it('без выбранных дней — каждый день недели (*)', () => {
    const schedule = new Schedule({
      occurs: 'weekly',
      dailyFrequency: 'once',
      onceAtTime: '09:00',
      weekDays: createEmptyWeekDays(),
      weekNumbers: createEmptyWeekNumbers(),
      useMonthWeekNumbers: false,
    });

    expect(schedule.toCron().toExpression()).toBe('0 9 * * *');
  });

  it('без выбранных недель после снятия всех — обычное еженедельное выражение', () => {
    const schedule = new Schedule({
      occurs: 'weekly',
      dailyFrequency: 'once',
      onceAtTime: '09:00',
      weekDays: createDefaultWeekDays(),
      weekNumbers: createEmptyWeekNumbers(),
      useMonthWeekNumbers: true,
    });

    expect(schedule.toCron().toExpression()).toBe('0 9 * * 1');
  });

  it('с 1-й неделей по умолчанию собирает cron с нотацией день#неделя', () => {
    const schedule = new Schedule({
      occurs: 'weekly',
      dailyFrequency: 'once',
      onceAtTime: '09:00',
      weekDays: createDefaultWeekDays(),
      weekNumbers: createDefaultWeekNumbers(),
      useMonthWeekNumbers: true,
    });

    expect(schedule.toCron().toExpression()).toBe('0 9 * * 1#1');
  });

  it('без useMonthWeekNumbers оставляет классическое еженедельное выражение', () => {
    const schedule = new Schedule({
      occurs: 'weekly',
      dailyFrequency: 'once',
      onceAtTime: '09:00',
      weekDays: createDefaultWeekDays(),
      weekNumbers: createEmptyWeekNumbers(),
      useMonthWeekNumbers: false,
    });

    expect(schedule.toCron().toExpression()).toBe('0 9 * * 1');
  });
});
