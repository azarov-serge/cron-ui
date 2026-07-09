import { describe, expect, it } from 'vitest';
import { isInvalidRange, parseDate, parseDateTime } from './utils';
import { isInvalidDate } from '@shared/components/DateTimePicker/utils/date';

describe('parseDate', () => {
  it('принимает корректную дату', () => {
    expect(parseDate('09.07.2026')?.value.getFullYear()).toBe(2026);
  });

  it('отклоняет несуществующие даты', () => {
    expect(parseDate('22.22.2222')).toBeNull();
    expect(parseDate('33.33.3333')).toBeNull();
    expect(parseDate('31.02.2026')).toBeNull();
  });
});

describe('isInvalidDate (re-export)', () => {
  it('совпадает с DateTimePicker-валидацией', () => {
    expect(isInvalidDate('22.22.2222')).toBe(true);
    expect(isInvalidDate('09.07.2026')).toBe(false);
  });
});

describe('isInvalidRange', () => {
  it('end раньше start — невалидно', () => {
    expect(isInvalidRange('09.07.2026', '09:00', '09.07.2026', '08:00')).toBe(
      true,
    );
  });

  it('одинаковые дата и время — невалидно', () => {
    expect(isInvalidRange('09.07.2026', '08:00', '09.07.2026', '08:00')).toBe(
      true,
    );
  });

  it('end позже start — валидно', () => {
    expect(isInvalidRange('09.07.2026', '08:00', '09.07.2026', '08:05')).toBe(
      false,
    );
  });

  it('неполные значения — не ошибка диапазона', () => {
    expect(isInvalidRange('09.07.2026', '08:00', '', '')).toBe(false);
    expect(isInvalidRange('09.07.2026', '', '09.07.2026', '08:00')).toBe(false);
  });
});

describe('parseDateTime', () => {
  it('собирает локальную дату-время', () => {
    const parsed = parseDateTime('09.07.2026', '08:00');
    expect(parsed).not.toBeNull();
    expect(parsed!.value.getHours()).toBe(8);
    expect(parsed!.value.getMinutes()).toBe(0);
  });
});
