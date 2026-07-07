import React from 'react';
import {
  NotificationItem,
  NotificationItemContent,
  NotificationItemTitle,
} from '@admiral-ds/react-ui';
import { describeScheduleHuman } from '@features/cron/utils/describeCron';
import { getOneTimeYearNotice } from '@shared/i18n/messages';
import { useTranslation } from '@shared/i18n/useTranslation';
import * as Styled from '../styles';
import { getOutputState } from '../utils';
import { CronExpressionField } from './CronExpressionField';
import { CronDescriptionField } from './CronDescriptionField';
import type { CronSectionProps } from './types';

export const CronOutputSection: React.FC<CronSectionProps> = (props) => {
  const { value, options } = props;
  const { locale, t } = useTranslation();
  const { schedule, isOneTime } = getOutputState(value);

  return (
    <>
      <CronExpressionField expression={value.toExpression()} />
      <CronDescriptionField
        description={describeScheduleHuman(schedule, locale)}
      />
      {isOneTime && options.showYearNotice && (
        <Styled.NoticeWrap>
          <NotificationItem status="warning" displayStatusIcon>
            <NotificationItemTitle>
              {t.editor.yearNotInCronTitle}
            </NotificationItemTitle>
            <NotificationItemContent>
              {getOneTimeYearNotice(schedule.oneTimeDate, t)}
            </NotificationItemContent>
          </NotificationItem>
        </Styled.NoticeWrap>
      )}
    </>
  );
};
