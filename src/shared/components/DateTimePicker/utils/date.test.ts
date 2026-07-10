import { describe, expect, it } from 'vitest';
import {
  isCompleteDate,
  isDateOutOfBounds,
  isInvalidDate,
  joinDateTimeValue,
  parseDateValue,
  splitDateTimeValue,
} from './date';

describe('DateTimePicker date validation', () => {
  it('принимает корректную дату', () => {
    expect(parseDateValue('09.07.2026')?.getFullYear()).toBe(2026);
    expect(isInvalidDate('09.07.2026')).toBe(false);
  });

  it('отклоняет 22.22.2222 и 33.33.3333', () => {
    expect(isInvalidDate('22.22.2222')).toBe(true);
    expect(isInvalidDate('33.33.3333')).toBe(true);
  });

  it('отклоняет 31.02.2026', () => {
    expect(isInvalidDate('31.02.2026')).toBe(true);
  });

  it('пустая и неполная маска не ошибка', () => {
    expect(isInvalidDate('')).toBe(false);
    expect(isInvalidDate('09.07.____')).toBe(false);
  });

  it('isCompleteDate — только реальная дата', () => {
    expect(isCompleteDate('10.07.2026')).toBe(true);
    expect(isCompleteDate('')).toBe(false);
    expect(isCompleteDate('__.__.____')).toBe(false);
    expect(isCompleteDate('09.07.____')).toBe(false);
    expect(isCompleteDate('31.02.2026')).toBe(false);
  });

  it('isDateOutOfBounds — дата после maxDate', () => {
    const maxDate = new Date(2026, 6, 10, 23, 59, 59, 999);

    expect(isDateOutOfBounds('10.07.2026', { maxDate })).toBe(false);
    expect(isDateOutOfBounds('11.07.2026', { maxDate })).toBe(true);
    expect(isDateOutOfBounds('09.07.____', { maxDate })).toBe(false);
  });

  it('isDateOutOfBounds — дата до minDate', () => {
    const minDate = new Date(2026, 6, 10);

    expect(isDateOutOfBounds('10.07.2026', { minDate })).toBe(false);
    expect(isDateOutOfBounds('09.07.2026', { minDate })).toBe(true);
  });
});

describe('joinDateTimeValue / splitDateTimeValue', () => {
  it('склеивает дату и время', () => {
    expect(joinDateTimeValue('09.07.2026', '18:20')).toBe('09.07.2026 18:20');
    expect(joinDateTimeValue('09.07.2026', '18:20:30')).toBe(
      '09.07.2026 18:20:30',
    );
    expect(joinDateTimeValue('09.07.2026', null)).toBe('09.07.2026');
    expect(joinDateTimeValue('', '18:20')).toBe('18:20');
    expect(joinDateTimeValue('__.__.____', '09:45')).toBe('09:45');
    expect(joinDateTimeValue('1_.__.____', '09:45')).toBe('1_.__.____ 09:45');
    expect(joinDateTimeValue('10.07.____', null)).toBe('10.07.____');
  });

  it('разбирает value с временем и без', () => {
    expect(splitDateTimeValue('09.07.2026 18:20')).toEqual({
      date: '09.07.2026',
      time: '18:20',
    });
    expect(splitDateTimeValue('09.07.2026 18:20:30')).toEqual({
      date: '09.07.2026',
      time: '18:20:30',
    });
    expect(splitDateTimeValue('09.07.2026')).toEqual({
      date: '09.07.2026',
      time: null,
    });
    expect(splitDateTimeValue('')).toEqual({ date: '', time: null });
  });

  it('строка только со временем не попадает в date', () => {
    expect(splitDateTimeValue('00:35')).toEqual({
      date: '',
      time: '00:35',
    });
    expect(splitDateTimeValue('09:37')).toEqual({
      date: '',
      time: '09:37',
    });
  });
});
