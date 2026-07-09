import { describe, expect, it } from 'vitest';
import {
  DEFAULT_CRON_OPTIONS,
  resolveCronOptions,
  type CronOptions,
} from './options';

/** Правила видимости контролов — как в useCronEditorConfig / секциях формы */
const getControlVisibility = (options?: CronOptions) => {
  const resolved = resolveCronOptions(options);

  return {
    showScheduleTypeChoice: resolved.scheduleTypes.length > 1,
    showOccursChoice: resolved.occursFrequencies.length > 1,
    showDailyFrequencyChoice: resolved.dailyFrequencies.length > 1,
    showWeekNumbers: resolved.weeklyWeekNumbers,
    showYearNotice: resolved.showYearNotice,
    scheduleTypes: resolved.scheduleTypes,
    occursFrequencies: resolved.occursFrequencies,
    dailyFrequencies: resolved.dailyFrequencies,
  };
};

describe('отображение контролов по CronOptions', () => {
  it('по умолчанию показывает все основные переключатели', () => {
    expect(getControlVisibility()).toEqual({
      showScheduleTypeChoice: true,
      showOccursChoice: true,
      showDailyFrequencyChoice: true,
      showWeekNumbers: false,
      showYearNotice: false,
      scheduleTypes: DEFAULT_CRON_OPTIONS.scheduleTypes,
      occursFrequencies: DEFAULT_CRON_OPTIONS.occursFrequencies,
      dailyFrequencies: DEFAULT_CRON_OPTIONS.dailyFrequencies,
    });
  });

  it('скрывает выбор типа расписания, если доступен один тип', () => {
    expect(
      getControlVisibility({ scheduleTypes: ['recurring'] }).showScheduleTypeChoice,
    ).toBe(false);
  });

  it('скрывает «Выполняется», если доступна одна частота', () => {
    expect(
      getControlVisibility({ occursFrequencies: ['weekly'] }).showOccursChoice,
    ).toBe(false);
  });

  it('скрывает выбор ежедневной частоты, если доступен один режим', () => {
    expect(
      getControlVisibility({ dailyFrequencies: ['once'] })
        .showDailyFrequencyChoice,
    ).toBe(false);
  });

  it('показывает недели месяца только при weeklyWeekNumbers: true', () => {
    expect(getControlVisibility({ weeklyWeekNumbers: false }).showWeekNumbers).toBe(
      false,
    );
    expect(getControlVisibility({ weeklyWeekNumbers: true }).showWeekNumbers).toBe(
      true,
    );
  });

  it('показывает предупреждение о годе только при showYearNotice: true', () => {
    expect(getControlVisibility({ showYearNotice: true }).showYearNotice).toBe(
      true,
    );
  });

  it('убирает weeklyWeekNumbers из requires, если недели месяца скрыты', () => {
    const resolved = resolveCronOptions({
      weeklyWeekNumbers: false,
      requires: ['weeklyWeekDays', 'weeklyWeekNumbers'],
    });

    expect(resolved.requires).toEqual(['weeklyWeekDays']);
  });

  it('оставляет weeklyWeekNumbers в requires, если недели месяца включены', () => {
    const resolved = resolveCronOptions({
      weeklyWeekNumbers: true,
      requires: ['weeklyWeekNumbers'],
    });

    expect(resolved.requires).toEqual(['weeklyWeekNumbers']);
  });

  it('подставляет defaults при пустых массивах опций', () => {
    const resolved = resolveCronOptions({
      scheduleTypes: [],
      occursFrequencies: [],
      dailyFrequencies: [],
    });

    expect(resolved.scheduleTypes).toEqual(DEFAULT_CRON_OPTIONS.scheduleTypes);
    expect(resolved.occursFrequencies).toEqual(
      DEFAULT_CRON_OPTIONS.occursFrequencies,
    );
    expect(resolved.dailyFrequencies).toEqual(
      DEFAULT_CRON_OPTIONS.dailyFrequencies,
    );
  });
});
