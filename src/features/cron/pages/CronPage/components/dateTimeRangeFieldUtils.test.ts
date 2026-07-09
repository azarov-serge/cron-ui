import { describe, expect, it } from 'vitest';
import {
  clampToMoscowNow,
  dateTimeToMoscowISO,
  getMoscowNowWallClock,
  isAfterMoscowNow,
  periodToMoscowISO,
} from './dateTimeRangeFieldUtils';

describe('dateTimeToMoscowISO', () => {
  it('интерпретирует UI-время как MSK и отдаёт UTC ISO', () => {
    // 09.07.2026 18:20 MSK = 09.07.2026 15:20 UTC
    expect(dateTimeToMoscowISO('09.07.2026', '18:20')).toBe(
      '2026-07-09T15:20:00.000Z',
    );
  });

  it('возвращает null для неполной/невалидной даты', () => {
    expect(dateTimeToMoscowISO('09.07.2026', '')).toBeNull();
    expect(dateTimeToMoscowISO('22.22.2222', '18:20')).toBeNull();
  });
});

describe('periodToMoscowISO', () => {
  it('собирает payload для бэка', () => {
    expect(
      periodToMoscowISO(
        { start: '09.07.2026', end: '09.07.2026' },
        { start: '18:20', end: '18:25' },
      ),
    ).toEqual({
      start: '2026-07-09T15:20:00.000Z',
      end: '2026-07-09T15:25:00.000Z',
      timeZone: 'Europe/Moscow',
    });
  });
});

describe('clamp / future check — независимо от TZ браузера', () => {
  // 09.07.2026 18:41 MSK = 09.07.2026 15:41 UTC
  // (в Омске UTC+6 это 21:41 — сценарий бага пользователя)
  const nowUtc = new Date(Date.UTC(2026, 6, 9, 15, 41, 0));

  it('getMoscowNowWallClock отдаёт московское время', () => {
    expect(getMoscowNowWallClock(5, nowUtc)).toEqual({
      date: '09.07.2026',
      time: '18:40',
    });
  });

  it('18:55 MSK при «сейчас» 18:41 MSK — будущее → clamp к 18:40', () => {
    expect(clampToMoscowNow('09.07.2026', '18:55', 5, nowUtc)).toEqual({
      date: '09.07.2026',
      time: '18:40',
      changed: true,
    });
  });

  it('18:35 MSK при «сейчас» 18:41 MSK — прошлое, без изменений', () => {
    expect(clampToMoscowNow('09.07.2026', '18:35', 5, nowUtc)).toEqual({
      date: '09.07.2026',
      time: '18:35',
      changed: false,
    });
  });

  it('isAfterMoscowNow: 18:55 — true, 18:35 — false', () => {
    expect(isAfterMoscowNow('09.07.2026', '18:55', 5, nowUtc)).toBe(true);
    expect(isAfterMoscowNow('09.07.2026', '18:35', 5, nowUtc)).toBe(false);
  });
});
