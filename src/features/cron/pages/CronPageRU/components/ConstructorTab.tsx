import React from 'react';
import {
  NotificationItemContent,
  NotificationItemTitle,
} from '@admiral-ds/react-ui';
import * as Styled from '../styles';
import type { CronPageRUStrings } from '../strings';

export interface ConstructorTabProps {
  t: CronPageRUStrings;
  children: React.ReactNode;
}

export const ConstructorTab: React.FC<ConstructorTabProps> = (props) => {
  const { t, children } = props;

  return (
    <Styled.TabContent>
      <Styled.HelpNotice status="info" displayStatusIcon>
        <NotificationItemTitle>{t.help.title}</NotificationItemTitle>
        <NotificationItemContent>
          <ol style={{ margin: '8px 0 0', paddingLeft: 20 }}>
            <li>{t.help.step1}</li>
            <li>{t.help.step2}</li>
            <li>{t.help.step3}</li>
            <li>{t.help.step4}</li>
          </ol>
        </NotificationItemContent>
      </Styled.HelpNotice>

      <Styled.ConstructorEditor>{children}</Styled.ConstructorEditor>
    </Styled.TabContent>
  );
};
