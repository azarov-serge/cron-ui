import React from 'react';
import { TextButton } from '@admiral-ds/react-ui';
import CopyOutline from '@admiral-ds/icons/build/documents/CopyOutline.svg?react';
import styled from 'styled-components';
import { useMediaQuery } from '@shared/hooks/useMediaQuery';
import * as Styled from './styles';

const CopyButton = styled(TextButton)`
  flex-shrink: 0;
`;

export interface CronExpressionFieldProps {
  expression: string;
}

export const CronExpressionField: React.FC<CronExpressionFieldProps> = (
  props,
) => {
  const { expression } = props;
  const isCompact = useMediaQuery('(max-width: 767px)');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(expression);
    } catch {
      // Clipboard API недоступен — без уведомления в UI
    }
  };

  return (
    <Styled.CronFieldSection>
      <Styled.CronFieldLegend>cron</Styled.CronFieldLegend>
      <Styled.CronExpressionRow>
        <Styled.CronCodeText>{expression}</Styled.CronCodeText>
        <CopyButton
          appearance="primary"
          dimension="s"
          type="button"
          iconStart={<CopyOutline />}
          text={isCompact ? 'Копировать' : undefined}
          onClick={handleCopy}
          aria-label="Копировать cron-выражение"
          title="Копировать cron-выражение"
        />
      </Styled.CronExpressionRow>
    </Styled.CronFieldSection>
  );
};
