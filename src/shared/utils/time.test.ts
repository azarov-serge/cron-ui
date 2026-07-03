import { describe, expect, it } from 'vitest';
import {
  combineTimeString,
  getHourOptions,
  getMinuteOptionsForStep,
  getTimeSlotsForStep,
  normalizeTimeToMinuteStep,
  snapMinuteToStep,
  splitTimeString,
} from './time';

describe('normalizeTimeToMinuteStep', () => {
  it('округляет минуты до ближайшего кратного шагу', () => {
    expect(normalizeTimeToMinuteStep('09:07', 10)).toBe('09:10');
    expect(normalizeTimeToMinuteStep('09:03', 10)).toBe('09:00');
  });
});

describe('getHourOptions', () => {
  it('возвращает 24 часа от 00 до 23', () => {
    expect(getHourOptions()).toEqual([
      '00',
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
      '07',
      '08',
      '09',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '19',
      '20',
      '21',
      '22',
      '23',
    ]);
  });
});

describe('getMinuteOptionsForStep', () => {
  it('генерирует минуты с шагом 10', () => {
    expect(getMinuteOptionsForStep(10)).toEqual([
      '00',
      '10',
      '20',
      '30',
      '40',
      '50',
    ]);
  });
});

describe('splitTimeString / combineTimeString / snapMinuteToStep', () => {
  it('разбирает и собирает время', () => {
    expect(splitTimeString('09:30')).toEqual({ hour: '09', minute: '30' });
    expect(combineTimeString('9', '5')).toBe('09:05');
  });

  it('приводит минуты к шагу', () => {
    expect(snapMinuteToStep('07', 10)).toBe('10');
    expect(snapMinuteToStep('03', 10)).toBe('00');
  });
});

describe('getTimeSlotsForStep', () => {
  it('генерирует слоты с шагом 10 минут', () => {
    const slots = getTimeSlotsForStep(10);
    expect(slots[0]).toEqual({ value: '00:00' });
    expect(slots[1]).toEqual({ value: '00:10' });
    expect(slots).toHaveLength(24 * 6);
  });

  it('генерирует слоты для каждой минуты при шаге 1', () => {
    expect(getTimeSlotsForStep(1)).toHaveLength(24 * 60);
  });
});
