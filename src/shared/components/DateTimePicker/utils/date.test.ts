import { describe, expect, it } from 'vitest';
import { isInvalidDate, parseDateValue } from './date';

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
