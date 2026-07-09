import { describe, expect, it } from 'vitest';
import { Cron } from '../models/cron';
import {
  createDefaultWeekDays,
  createEmptyWeekNumbers,
} from './scheduleTypes';
import { parseScheduleFromCron } from './cronParsers';
import { setOccurs, toggleWeekNumber } from './cronUiState';

describe('toggleWeekNumber', () => {
  it('добавляет неделю месяца в cron (синтаксис day#week)', () => {
    const cron = Cron.fromString('0 9 * * 1');

    const next = toggleWeekNumber(cron, 2, true);
    const schedule = parseScheduleFromCron(next);

    expect(next.toExpression()).toBe('0 9 * * 1#2');
    expect(schedule.monthWeekNumbersEnabled).toBe(true);
    expect(schedule.weekNumbers[2]).toBe(true);
  });

  it('снимает синтаксис недель месяца, когда все недели отключены', () => {
    const cron = Cron.fromString('0 9 * * 1#2');

    const next = toggleWeekNumber(cron, 2, false);
    const schedule = parseScheduleFromCron(next);

    expect(next.toExpression()).toBe('0 9 * * 1');
    expect(schedule.monthWeekNumbersEnabled).toBe(false);
    expect(schedule.weekNumbers[2]).toBe(false);
  });

  it('сохраняет выбранные недели при нескольких чекбоксах', () => {
    let cron = Cron.fromString('0 9 * * 1');
    cron = toggleWeekNumber(cron, 1, true);
    cron = toggleWeekNumber(cron, 3, true);

    expect(cron.toExpression()).toBe('0 9 * * 1#1,1#3');
    expect(parseScheduleFromCron(cron).weekNumbers).toEqual({
      ...createEmptyWeekNumbers(),
      1: true,
      3: true,
    });
  });

  it('комбинирует несколько дней недели с неделями месяца', () => {
    const cron = Cron.fromString('0 9 * * 1,3');
    const next = toggleWeekNumber(cron, 2, true);

    expect(next.toExpression()).toBe('0 9 * * 1#2,3#2');
    expect(parseScheduleFromCron(next).weekDays).toEqual({
      ...createDefaultWeekDays(),
      monday: true,
      wednesday: true,
    });
  });
});

describe('setOccurs', () => {
  it('переключает еженедельно с неделями месяца на ежедневно', () => {
    let cron = Cron.fromString('0 9 * * 1');
    cron = toggleWeekNumber(cron, 2, true);

    const daily = setOccurs(cron, 'daily');

    expect(daily.toExpression()).toBe('0 9 * * *');
    expect(parseScheduleFromCron(daily).occurs).toBe('daily');
  });

  it('переключает еженедельно с неделями месяца на ежемесячно', () => {
    let cron = Cron.fromString('0 9 * * 1');
    cron = toggleWeekNumber(cron, 2, true);

    const monthly = setOccurs(cron, 'monthly');

    expect(monthly.toExpression()).toBe('0 9 1 * *');
    expect(parseScheduleFromCron(monthly).occurs).toBe('monthly');
  });

  it('переключает ежемесячно обратно на еженедельно', () => {
    const monthly = Cron.fromString('0 9 15 * *');
    const weekly = setOccurs(monthly, 'weekly');

    expect(weekly.toExpression()).toBe('0 9 * * 1');
    expect(parseScheduleFromCron(weekly).occurs).toBe('weekly');
  });

  it('циклически переключает daily → weekly → monthly', () => {
    let cron = Cron.fromString('0 9 * * *');

    cron = setOccurs(cron, 'weekly');
    expect(cron.toExpression()).toBe('0 9 * * 1');
    expect(parseScheduleFromCron(cron).occurs).toBe('weekly');

    cron = setOccurs(cron, 'monthly');
    expect(cron.toExpression()).toBe('0 9 1 * *');
    expect(parseScheduleFromCron(cron).occurs).toBe('monthly');

    cron = setOccurs(cron, 'daily');
    expect(cron.toExpression()).toBe('0 9 * * *');
    expect(parseScheduleFromCron(cron).occurs).toBe('daily');
  });
});
