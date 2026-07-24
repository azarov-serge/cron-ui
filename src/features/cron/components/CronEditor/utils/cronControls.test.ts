import { describe, expect, it } from 'vitest';
import { Cron } from '../models/cron';
import { parseScheduleFromCron } from './cronParsers';
import {
  setDailyFrequency,
  setDaysOfMonth,
  setEveryInterval,
  setEveryUnit,
  setOccurs,
  setOnceAtTime,
  setScheduleType,
  setStartTimeEnabled,
  toggleWeekDay,
  toggleWeekNumber,
} from './cronUiState';

/**
 * Сценарии «клик по контролу → cron».
 * UI вызывает те же хелперы из cronUiState.
 */
describe('клики контролов формируют правильный cron', () => {
  describe('тип расписания', () => {
    it('переключает recurring → one-time', () => {
      const cron = setScheduleType(Cron.fromString('0 9 * * *'), 'one-time');
      const schedule = parseScheduleFromCron(cron);

      expect(schedule.scheduleType).toBe('one-time');
      expect(cron.dayOfMonth).not.toBeNull();
      expect(cron.month).not.toBeNull();
      expect(cron.dayOfWeek).toBeNull();
    });

    it('переключает one-time → recurring (ежедневно)', () => {
      const oneTime = setScheduleType(Cron.fromString('0 9 * * *'), 'one-time');
      const recurring = setScheduleType(oneTime, 'recurring');

      expect(parseScheduleFromCron(recurring).scheduleType).toBe('recurring');
      expect(recurring.toExpression()).toMatch(/^\d+ \d+ /);
    });
  });

  describe('Выполняется: daily / weekly / monthly', () => {
    it('ежедневно → 0 9 * * *', () => {
      const cron = setOccurs(Cron.fromString('0 9 * * 1'), 'daily');

      expect(cron.toExpression()).toBe('0 9 * * *');
      expect(parseScheduleFromCron(cron).occurs).toBe('daily');
    });

    it('еженедельно → 0 9 * * 1 (понедельник по умолчанию)', () => {
      const cron = setOccurs(Cron.fromString('0 9 * * *'), 'weekly');

      expect(cron.toExpression()).toBe('0 9 * * 1');
      expect(parseScheduleFromCron(cron).occurs).toBe('weekly');
    });

    it('ежемесячно → 0 9 1 * *', () => {
      const cron = setOccurs(Cron.fromString('0 9 * * *'), 'monthly');

      expect(cron.toExpression()).toBe('0 9 1 * *');
      expect(parseScheduleFromCron(cron).occurs).toBe('monthly');
    });

    it('после недель месяца daily/monthly сбрасывают #week', () => {
      let cron = Cron.fromString('0 9 * * 1');
      cron = toggleWeekNumber(cron, 2, true);
      expect(cron.toExpression()).toBe('0 9 * * 1#2');

      expect(setOccurs(cron, 'daily').toExpression()).toBe('0 9 * * *');
      expect(setOccurs(cron, 'monthly').toExpression()).toBe('0 9 1 * *');
    });
  });

  describe('дни недели', () => {
    it('добавляет вторник к понедельнику', () => {
      const cron = toggleWeekDay(Cron.fromString('0 9 * * 1'), 'tuesday', true);

      expect(cron.toExpression()).toBe('0 9 * * 1,2');
    });

    it('снимает понедельник → dayOfWeek = * (null)', () => {
      const cron = toggleWeekDay(Cron.fromString('0 9 * * 1'), 'monday', false);

      expect(cron.toExpression()).toBe('0 9 * * *');
      expect(cron.dayOfWeek).toBeNull();
    });
  });

  describe('недели месяца', () => {
    it('включает 2-ю неделю → day#week', () => {
      const cron = toggleWeekNumber(Cron.fromString('0 9 * * 1'), 2, true);

      expect(cron.toExpression()).toBe('0 9 * * 1#2');
      expect(parseScheduleFromCron(cron).weekNumbers[2]).toBe(true);
    });

    it('несколько недель и дней', () => {
      let cron = Cron.fromString('0 9 * * 1');
      cron = toggleWeekDay(cron, 'wednesday', true);
      cron = toggleWeekNumber(cron, 1, true);
      cron = toggleWeekNumber(cron, 3, true);

      expect(cron.toExpression()).toBe('0 9 * * 1#1,1#3,3#1,3#3');
    });
  });

  describe('дни месяца', () => {
    it('меняет день при ежемесячном расписании', () => {
      const monthly = setOccurs(Cron.fromString('0 9 * * *'), 'monthly');
      const cron = setDaysOfMonth(monthly, [15]);

      expect(cron.toExpression()).toBe('0 9 15 * *');
      expect(parseScheduleFromCron(cron).daysOfMonth).toEqual([15]);
    });

    it('несколько дней → 0 9 1,5,10 * *', () => {
      const monthly = setOccurs(Cron.fromString('0 9 * * *'), 'monthly');
      const cron = setDaysOfMonth(monthly, [10, 1, 5]);

      expect(cron.toExpression()).toBe('0 9 1,5,10 * *');
      expect(parseScheduleFromCron(cron).daysOfMonth).toEqual([1, 5, 10]);
    });

    it('парсит список дней из cron', () => {
      const schedule = parseScheduleFromCron(Cron.fromString('0 9 1,5,10 * *'));

      expect(schedule.occurs).toBe('monthly');
      expect(schedule.daysOfMonth).toEqual([1, 5, 10]);
      expect(schedule.startTimeEnabled).toBe(true);
    });
  });

  describe('время запуска (weekly/monthly)', () => {
    it('выключает время → 0 0', () => {
      const monthly = setOccurs(Cron.fromString('0 9 1 * *'), 'monthly');
      const cron = setStartTimeEnabled(monthly, false);

      expect(cron.toExpression()).toBe('0 0 1 * *');
      expect(parseScheduleFromCron(cron).startTimeEnabled).toBe(false);
    });

    it('включает время с полуночи → 09:00', () => {
      const cron = setStartTimeEnabled(Cron.fromString('0 0 1 * *'), true);

      expect(cron.toExpression()).toBe('0 9 1 * *');
      expect(parseScheduleFromCron(cron).startTimeEnabled).toBe(true);
    });

    it('weekly без времени → 0 0 * * 1', () => {
      const weekly = setOccurs(Cron.fromString('0 9 * * *'), 'weekly');
      const cron = setStartTimeEnabled(weekly, false);

      expect(cron.toExpression()).toBe('0 0 * * 1');
      expect(parseScheduleFromCron(cron).startTimeEnabled).toBe(false);
    });
  });

  describe('ежедневная частота', () => {
    it('один раз в HH:mm', () => {
      let cron = Cron.fromString('0 9 * * *');
      cron = setOnceAtTime(cron, '14:30', 1);

      expect(cron.toExpression()).toBe('30 14 * * *');
    });

    it('каждые N минут', () => {
      let cron = Cron.fromString('0 9 * * *');
      cron = setDailyFrequency(cron, 'every');
      cron = setEveryUnit(cron, 1, 'minutes');
      cron = setEveryInterval(cron, 1, 5);

      expect(cron.toExpression()).toBe('*/5 * * * *');
      expect(parseScheduleFromCron(cron).dailyFrequency).toBe('every');
    });

    it('каждые N часов', () => {
      let cron = Cron.fromString('0 9 * * *');
      cron = setDailyFrequency(cron, 'every');
      cron = setEveryUnit(cron, 1, 'hours');
      cron = setEveryInterval(cron, 1, 2);

      expect(cron.toExpression()).toBe('0 */2 * * *');
    });
  });

  describe('сквозной сценарий как в UI', () => {
    it('еженедельно + день + неделя месяца + время', () => {
      let cron = Cron.createEmpty();

      cron = setOccurs(cron, 'weekly');
      cron = toggleWeekDay(cron, 'friday', true);
      cron = toggleWeekNumber(cron, 1, true);
      cron = setOnceAtTime(cron, '08:00', 1);

      expect(cron.toExpression()).toBe('0 8 * * 1#1,5#1');
      expect(parseScheduleFromCron(cron)).toMatchObject({
        occurs: 'weekly',
        monthWeekNumbersEnabled: true,
        weekDays: expect.objectContaining({
          monday: true,
          friday: true,
        }),
        weekNumbers: expect.objectContaining({ 1: true }),
      });
    });
  });
});
