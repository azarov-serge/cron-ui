import React from 'react';

import ArrowIcon from '@admiral-ds/icons/build/system/ArrowRightOutline.svg?react';

import { DateTimePicker } from '@shared/components/DateTimePicker';
import {
  joinDateTimeValue,
  splitDateTimeValue,
} from '@shared/components/DateTimePicker/utils/date';
import type { DateTimeRangeProps } from './types';
import * as Styled from './styles';

export const DateTimeRange: React.FC<DateTimeRangeProps> = (props) => {
  const {
    className,
    date,
    onDateChange,
    time,
    onTimeChange,
    dimension,
    minDate,
    maxDate,
    minTime = null,
    maxTime = null,
    startMinTime,
    startMaxTime,
    endMinTime,
    endMaxTime,
    minuteStep = 1,
    validator,
  } = props;

  const resolvedStartMinTime = startMinTime ?? minTime;
  const resolvedStartMaxTime = startMaxTime ?? maxTime;
  const resolvedEndMinTime = endMinTime ?? minTime;
  const resolvedEndMaxTime = endMaxTime ?? maxTime;

  const handleStartChange = (nextValue: string) => {
    const { date: nextDate, time: nextTime } = splitDateTimeValue(nextValue);

    if (nextDate !== date.start) {
      onDateChange({ ...date, start: nextDate });
    }

    const nextTimeValue = nextTime ?? '';

    if (nextTimeValue !== time.start) {
      onTimeChange({ ...time, start: nextTimeValue });
    }
  };

  const handleEndChange = (nextValue: string) => {
    const { date: nextDate, time: nextTime } = splitDateTimeValue(nextValue);

    if (nextDate !== date.end) {
      onDateChange({ ...date, end: nextDate });
    }

    const nextTimeValue = nextTime ?? '';

    if (nextTimeValue !== time.end) {
      onTimeChange({ ...time, end: nextTimeValue });
    }
  };

  return (
    <Styled.Root className={className}>
      <Styled.Row>
        <Styled.Item>
          <DateTimePicker
            label="Дата и время начала"
            value={joinDateTimeValue(date.start, time.start)}
            dimension={dimension}
            minDate={minDate}
            maxDate={maxDate}
            minTime={resolvedStartMinTime}
            maxTime={resolvedStartMaxTime}
            validator={validator}
            minuteStep={minuteStep}
            onChange={handleStartChange}
          />
        </Styled.Item>

        <Styled.ArrowWrap>
          <ArrowIcon />
        </Styled.ArrowWrap>

        <Styled.Item>
          <DateTimePicker
            label="Дата и время конца"
            value={joinDateTimeValue(date.end, time.end)}
            dimension={dimension}
            minDate={minDate}
            maxDate={maxDate}
            minTime={resolvedEndMinTime}
            maxTime={resolvedEndMaxTime}
            validator={validator}
            minuteStep={minuteStep}
            onChange={handleEndChange}
          />
        </Styled.Item>
      </Styled.Row>
    </Styled.Root>
  );
};
