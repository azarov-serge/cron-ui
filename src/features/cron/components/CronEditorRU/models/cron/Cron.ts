import cronstrueI18n from 'cronstrue/i18n';
import type { CronInterface, CronToStringOptions } from './types';
import { fromWildcard, toWildcard } from './utils';

/** Пятичастное cron-выражение: минута, час, день месяца, месяц, день недели */
export class Cron implements CronInterface {
  minute: string;
  hour: string;
  month: string | null;
  dayOfWeek: string | null;
  dayOfMonth: string | null;

  constructor(fields?: Partial<CronInterface>) {
    this.minute = fields?.minute ?? '0';
    this.hour = fields?.hour ?? '0';
    this.dayOfWeek = fields?.dayOfWeek ?? null;
    this.dayOfMonth = fields?.dayOfMonth ?? null;
    this.month = fields?.month ?? null;
  }

  /** Расписание по умолчанию: ежедневно в 09:00 */
  static createEmpty = (): Cron => {
    return new Cron({ minute: '0', hour: '9' });
  };

  /** Разбирает пятичастное cron-выражение; при ошибке — createEmpty() */
  static fromString = (expression: string): Cron => {
    const parts = expression.trim().split(/\s+/);

    if (parts.length !== 5) {
      return Cron.createEmpty();
    }

    const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

    return new Cron({
      minute,
      hour,
      dayOfMonth: fromWildcard(dayOfMonth),
      month: fromWildcard(month),
      dayOfWeek: fromWildcard(dayOfWeek),
    });
  };

  /** Собирает cron-выражение из полей */
  public toExpression = (): string => {
    return [
      this.minute,
      this.hour,
      toWildcard(this.dayOfMonth),
      toWildcard(this.month),
      toWildcard(this.dayOfWeek),
    ].join(' ');
  };

  /** Человекочитаемое описание через cronstrue; без locale — toExpression() */
  public toString = (options?: CronToStringOptions): string => {
    if (!options?.locale) {
      return this.toExpression();
    }

    return cronstrueI18n.toString(this.toExpression(), {
      locale: options.locale,
      throwExceptionOnParseError: options.throwExceptionOnParseError ?? false,
      use24HourTimeFormat: options.use24HourTimeFormat ?? true,
    });
  };

  /** Возвращает копию с частично заменёнными полями */
  public clone = (cron?: Partial<CronInterface>): Cron => {
    return new Cron({
      ...this,
      ...cron,
    });
  };
}
