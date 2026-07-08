import React from 'react';
import { EditOutlined } from '@ant-design/icons';
import { CronChecker } from '@features/cron/components/CronChecker';
import * as Styled from '../styles';

export interface CheckerTabProps {
  expression: string;
  canEditFromChecker: boolean;
  editCronLabel: string;
  onExpressionChange: (value: string) => void;
  onEditCron: () => void;
}

export const CheckerTab: React.FC<CheckerTabProps> = (props) => {
  const {
    expression,
    canEditFromChecker,
    editCronLabel,
    onExpressionChange,
    onEditCron,
  } = props;

  const editCronButton = (
    <Styled.EditCronButton
      appearance="primary"
      dimension="s"
      type="button"
      disabled={!canEditFromChecker}
      onClick={onEditCron}
    >
      <Styled.ButtonContent>
        <EditOutlined />
        {editCronLabel}
      </Styled.ButtonContent>
    </Styled.EditCronButton>
  );

  return (
    <Styled.TabContent>
      <Styled.CheckerActions>{editCronButton}</Styled.CheckerActions>
      <CronChecker
        expression={expression}
        onExpressionChange={onExpressionChange}
      />
      <Styled.CheckerActions>{editCronButton}</Styled.CheckerActions>
    </Styled.TabContent>
  );
};
