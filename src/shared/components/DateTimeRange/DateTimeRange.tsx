import React from 'react';

import ArrowIcon from '@admiral-ds/icons/build/system/ArrowRightOutline.svg?react';

import { DateTimePicker } from '@shared/components/DateTimePicker';
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
    minuteStep = 1,
    validator,
  } = props;

  const handleStartDateChange = (value: string) => {
    onDateChange({ ...date, start: value });
  };

  const handleStartTimeChange = (value: string | null) => {
    onTimeChange({ ...time, start: value ?? '' });
  };

  const handleEndDateChange = (value: string) => {
    onDateChange({ ...date, end: value });
  };

  const handleEndTimeChange = (value: string | null) => {
    onTimeChange({ ...time, end: value ?? '' });
  };

  return (
    <Styled.Root className={className}>
      <Styled.Row>
        <Styled.Item>
          <DateTimePicker
            label="Дата и время начала"
            dateValue={date.start}
            timeValue={time.start || null}
            dimension={dimension}
            minDate={minDate}
            maxDate={maxDate}
            validator={validator}
            minuteStep={minuteStep}
            onDateChange={handleStartDateChange}
            onTimeChange={handleStartTimeChange}
          />
        </Styled.Item>

        <Styled.ArrowWrap>
          <ArrowIcon />
        </Styled.ArrowWrap>

        <Styled.Item>
          <DateTimePicker
            label="Дата и время конца"
            dateValue={date.end}
            timeValue={time.end || null}
            dimension={dimension}
            minDate={minDate}
            maxDate={maxDate}
            validator={validator}
            minuteStep={minuteStep}
            onDateChange={handleEndDateChange}
            onTimeChange={handleEndTimeChange}
          />
        </Styled.Item>
      </Styled.Row>
    </Styled.Root>
  );
};
