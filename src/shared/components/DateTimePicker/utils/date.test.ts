import { describe, expect, it } from 'vitest';
import {
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
});

describe('joinDateTimeValue / splitDateTimeValue', () => {
  it('склеивает дату и время', () => {
    expect(joinDateTimeValue('09.07.2026', '18:20')).toBe('09.07.2026 18:20');
    expect(joinDateTimeValue('09.07.2026', '18:20:30')).toBe(
      '09.07.2026 18:20:30',
    );
    expect(joinDateTimeValue('09.07.2026', null)).toBe('09.07.2026');
    expect(joinDateTimeValue('', '18:20')).toBe('18:20');
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
});
