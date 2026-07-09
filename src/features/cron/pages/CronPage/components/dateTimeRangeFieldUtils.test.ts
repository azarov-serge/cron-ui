import { describe, expect, it } from 'vitest';
import {
  dateTimeToZonedISO,
  getDatePartsInTimeZone,
  getNowWallClockInTimeZone,
  getTodayInTimeZone,
  MOSCOW_TIME_ZONE,
  periodToZonedISO,
} from './dateTimeRangeFieldUtils';

describe('dateTimeToZonedISO', () => {
  it('интерпретирует UI-время как MSK и отдаёт UTC ISO', () => {
    // 09.07.2026 18:20 MSK = 09.07.2026 15:20 UTC
    expect(
      dateTimeToZonedISO('09.07.2026', '18:20', MOSCOW_TIME_ZONE),
    ).toBe('2026-07-09T15:20:00.000Z');
  });

  it('интерпретирует UI-время как Омск и отдаёт UTC ISO', () => {
    // 09.07.2026 21:20 Asia/Omsk (UTC+6) = 09.07.2026 15:20 UTC
    expect(
      dateTimeToZonedISO('09.07.2026', '21:20', 'Asia/Omsk'),
    ).toBe('2026-07-09T15:20:00.000Z');
  });

  it('возвращает null для неполной/невалидной даты', () => {
    expect(dateTimeToZonedISO('09.07.2026', '', MOSCOW_TIME_ZONE)).toBeNull();
    expect(
      dateTimeToZonedISO('22.22.2222', '18:20', MOSCOW_TIME_ZONE),
    ).toBeNull();
  });
});

describe('periodToZonedISO', () => {
  it('собирает payload для бэка', () => {
    expect(
      periodToZonedISO(
        { start: '09.07.2026', end: '09.07.2026' },
        { start: '18:20', end: '18:25' },
        MOSCOW_TIME_ZONE,
      ),
    ).toEqual({
      start: '2026-07-09T15:20:00.000Z',
      end: '2026-07-09T15:25:00.000Z',
      timeZone: 'Europe/Moscow',
    });
  });
});

describe('getDatePartsInTimeZone — один момент, разные зоны', () => {
  // Один абсолютный момент: 2026-07-09T15:41:00Z
  const nowUtc = new Date(Date.UTC(2026, 6, 9, 15, 41, 0));

  it('в Москве 18:41, в Омске 21:41', () => {
    expect(getDatePartsInTimeZone(nowUtc, MOSCOW_TIME_ZONE)).toMatchObject({
      year: 2026,
      month: 7,
      day: 9,
      hour: 18,
      minute: 41,
    });
    expect(getDatePartsInTimeZone(nowUtc, 'Asia/Omsk')).toMatchObject({
      year: 2026,
      month: 7,
      day: 9,
      hour: 21,
      minute: 41,
    });
  });

  it('getNowWallClockInTimeZone — строки UI + floor minuteStep', () => {
    expect(getNowWallClockInTimeZone(MOSCOW_TIME_ZONE, 5, nowUtc)).toEqual({
      date: '09.07.2026',
      time: '18:40',
    });
    expect(getNowWallClockInTimeZone('Asia/Omsk', 5, nowUtc)).toEqual({
      date: '09.07.2026',
      time: '21:40',
    });
  });

  it('getTodayInTimeZone — сегодняшний день в зоне', () => {
    const maxDate = getTodayInTimeZone(MOSCOW_TIME_ZONE, nowUtc);

    expect(maxDate.getFullYear()).toBe(2026);
    expect(maxDate.getMonth()).toBe(6);
    expect(maxDate.getDate()).toBe(9);
  });
});
