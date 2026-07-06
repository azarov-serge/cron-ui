import React from 'react';
import { TextButton } from '@admiral-ds/react-ui';
import CopyOutline from '@admiral-ds/icons/build/documents/CopyOutline.svg?react';
import styled from 'styled-components';
import { useMediaQuery } from '@shared/hooks/useMediaQuery';
import { copyCron, copyCronShort, editorStrings } from '../../strings';
import {
  CronCodeText,
  CronExpressionRow,
  CronFieldLegend,
  CronFieldSection,
} from './styles';

const CopyButton = styled(TextButton)`
  flex-shrink: 0;
`;

export interface CronExpressionFieldProps {
  expression: string;
}

export const CronExpressionField: React.FC<CronExpressionFieldProps> = ({
  expression,
}) => {
  const isCompact = useMediaQuery('(max-width: 767px)');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(expression);
    } catch {
      // Clipboard API недоступен — без уведомления в UI
    }
  };

  return (
    <CronFieldSection>
      <CronFieldLegend>{editorStrings.cronLegend}</CronFieldLegend>
      <CronExpressionRow>
        <CronCodeText>{expression}</CronCodeText>
        <CopyButton
          appearance="primary"
          dimension="s"
          type="button"
          iconStart={<CopyOutline />}
          text={isCompact ? copyCronShort : undefined}
          onClick={handleCopy}
          aria-label={copyCron}
          title={copyCron}
        />
      </CronExpressionRow>
    </CronFieldSection>
  );
};
