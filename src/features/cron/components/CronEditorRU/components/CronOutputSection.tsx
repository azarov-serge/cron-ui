import React from 'react';
import {
  NotificationItem,
  NotificationItemContent,
  NotificationItemTitle,
} from '@admiral-ds/react-ui';
import { describeScheduleHuman } from '../utils/describeCron';
import * as Styled from '../styles';
import { getOutputState } from '../utils';
import { getOneTimeYearNoticeRu } from '../strings';
import { CronExpressionField } from './CronExpressionField';
import { CronDescriptionField } from './CronDescriptionField';
import type { CronSectionProps } from './types';

export const CronOutputSection: React.FC<CronSectionProps> = (props) => {
  const { value, options } = props;
  const { schedule, isOneTime } = getOutputState(value);

  return (
    <>
      <CronExpressionField expression={value.toExpression()} />
      <CronDescriptionField description={describeScheduleHuman(schedule)} />
      {isOneTime && options.showYearNotice && (
        <Styled.NoticeWrap>
          <NotificationItem status="warning" displayStatusIcon>
            <NotificationItemTitle>Год не входит в cron</NotificationItemTitle>
            <NotificationItemContent>
              {getOneTimeYearNoticeRu(schedule.oneTimeDate)}
            </NotificationItemContent>
          </NotificationItem>
        </Styled.NoticeWrap>
      )}
    </>
  );
};
