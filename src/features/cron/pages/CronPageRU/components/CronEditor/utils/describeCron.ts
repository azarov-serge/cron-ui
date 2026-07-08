import { Cron } from '../models/cron';
import type { ScheduleInterface } from './scheduleTypes';
import { buildCronFromSchedule } from './cronParsers';
import { formatMessage } from '../../../utils/formatMessage';

const capitalize = (text: string): string =>
  text.charAt(0).toUpperCase() + text.slice(1);

const describeCronHuman = (cron: Cron): string => {
  const text = cron.toString({
    locale: 'ru',
    use24HourTimeFormat: true,
    throwExceptionOnParseError: false,
  });

  return capitalize(text);
};

/** Человекочитаемое описание расписания на русском */
export const describeScheduleHuman = (schedule: ScheduleInterface): string => {
  if (schedule.scheduleType === 'one-time') {
    return formatMessage('Выполняется один раз {date} в {time}.', {
      date: schedule.oneTimeDate,
      time: schedule.oneTimeTime,
    });
  }

  return describeCronHuman(buildCronFromSchedule(schedule));
};
