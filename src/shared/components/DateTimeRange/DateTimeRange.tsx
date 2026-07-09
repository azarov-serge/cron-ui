import React from 'react';

import ArrowIcon from '@admiral-ds/icons/build/system/ArrowRightOutline.svg?react';

import { DateTimePicker } from '@shared/components/DateTimePicker';
import type { DateTimeRangeProps } from './types';
import * as Styled from './styles';

export const DateTimeRange: React.FC<DateTimeRangeProps> = (props) => {
  const {
    className,
    value,
    onChange,
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

  return (
    <Styled.Root className={className}>
      <Styled.Row>
        <Styled.Item>
          <DateTimePicker
            label="Дата и время начала"
            value={value.start}
            dimension={dimension}
            minDate={minDate}
            maxDate={maxDate}
            minTime={resolvedStartMinTime}
            maxTime={resolvedStartMaxTime}
            validator={validator}
            minuteStep={minuteStep}
            onChange={(start) => onChange({ ...value, start })}
          />
        </Styled.Item>

        <Styled.ArrowWrap>
          <ArrowIcon />
        </Styled.ArrowWrap>

        <Styled.Item>
          <DateTimePicker
            label="Дата и время конца"
            value={value.end}
            dimension={dimension}
            minDate={minDate}
            maxDate={maxDate}
            minTime={resolvedEndMinTime}
            maxTime={resolvedEndMaxTime}
            validator={validator}
            minuteStep={minuteStep}
            onChange={(end) => onChange({ ...value, end })}
          />
        </Styled.Item>
      </Styled.Row>
    </Styled.Root>
  );
};
