import { describe, expect, it } from 'vitest';
import { applyCronOptions } from './applyCronOptions';
import { DEFAULT_CRON_OPTIONS } from './options';
import { ScheduleModel } from './models/schedule';
import { createDefaultWeekNumbers, createEmptyWeekNumbers } from './models/schedule/types';

describe('applyCronOptions', () => {
  it('выравнивает oneTimeTime по шагу минут для однократного расписания', () => {
    const schedule = new ScheduleModel({
      scheduleType: 'one-time',
      oneTimeTime: '09:07',
    });

    const result = applyCronOptions(schedule, {
      ...DEFAULT_CRON_OPTIONS,
      minuteStep: 10,
    });

    expect(result.oneTimeTime).toBe('09:10');
  });

  it('выравнивает oneTimeTime при смене scheduleType через applyCronOptions', () => {
    const schedule = new ScheduleModel({
      scheduleType: 'one-time',
      oneTimeTime: '14:23',
    });

    const result = applyCronOptions(schedule, {
      ...DEFAULT_CRON_OPTIONS,
      minuteStep: 15,
    });

    expect(result.oneTimeTime).toBe('14:15');
  });

  it('при включённых неделях месяца выбирает 1-ю неделю по умолчанию', () => {
    const schedule = new ScheduleModel({
      occurs: 'weekly',
      weekNumbers: createEmptyWeekNumbers(),
    });

    const result = applyCronOptions(schedule, {
      ...DEFAULT_CRON_OPTIONS,
      weeklyWeekNumbers: true,
    });

    expect(result.useMonthWeekNumbers).toBe(true);
    expect(result.weekNumbers).toEqual(createDefaultWeekNumbers());
  });
});
