import React from 'react';

import ArrowIcon from '@admiral-ds/icons/build/system/ArrowRightOutline.svg?react';

import { DateTimePicker } from '@shared/components/DateTimePicker';
import {
  getDateErrorMessage,
  splitDateTimeValue,
} from '@shared/components/DateTimePicker/utils/date';
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
    labels,
  } = props;

  const resolvedStartMinTime = startMinTime ?? minTime;
  const resolvedStartMaxTime = startMaxTime ?? maxTime;
  const resolvedEndMinTime = endMinTime ?? minTime;
  const resolvedEndMaxTime = endMaxTime ?? maxTime;

  const hasLabels = Boolean(labels?.start || labels?.end);
  const dateBounds = { minDate, maxDate };
  const startError = getDateErrorMessage(
    splitDateTimeValue(value.start).date,
    dateBounds,
  );
  const endError = getDateErrorMessage(
    splitDateTimeValue(value.end).date,
    dateBounds,
  );

  return (
    <Styled.Root className={className}>
      <Styled.StartItem>
        <DateTimePicker
          label={labels?.start}
          value={value.start}
          dimension={dimension}
          minDate={minDate}
          maxDate={maxDate}
          minTime={resolvedStartMinTime}
          maxTime={resolvedStartMaxTime}
          validator={validator}
          minuteStep={minuteStep}
          hideExtraText
          onChange={(start) => onChange({ ...value, start })}
        />
      </Styled.StartItem>

      {startError ? (
        <Styled.StartError font="Body/Body 2 Long" as="p">
          {startError}
        </Styled.StartError>
      ) : null}

      <Styled.ArrowWrap $hasLabels={hasLabels}>
        <ArrowIcon />
      </Styled.ArrowWrap>

      <Styled.EndItem>
        <DateTimePicker
          label={labels?.end}
          value={value.end}
          dimension={dimension}
          minDate={minDate}
          maxDate={maxDate}
          minTime={resolvedEndMinTime}
          maxTime={resolvedEndMaxTime}
          validator={validator}
          minuteStep={minuteStep}
          hideExtraText
          onChange={(end) => onChange({ ...value, end })}
        />
      </Styled.EndItem>

      {endError ? (
        <Styled.EndError font="Body/Body 2 Long" as="p">
          {endError}
        </Styled.EndError>
      ) : null}
    </Styled.Root>
  );
};
