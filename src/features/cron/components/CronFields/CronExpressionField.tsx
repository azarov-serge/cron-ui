import React from 'react';
import { TextButton } from '@admiral-ds/react-ui';
import CopyOutline from '@admiral-ds/icons/build/documents/CopyOutline.svg?react';
import styled from 'styled-components';
import { useTranslation } from '@shared/i18n/useTranslation';
import { useMediaQuery } from '@shared/hooks/useMediaQuery';
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
  const { t } = useTranslation();
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
      <CronFieldLegend>{t.editor.cronLegend}</CronFieldLegend>
      <CronExpressionRow>
        <CronCodeText>{expression}</CronCodeText>
        <CopyButton
          appearance="primary"
          dimension={isCompact ? 's' : 'm'}
          type="button"
          iconStart={<CopyOutline />}
          text={isCompact ? t.copyCronShort : undefined}
          onClick={handleCopy}
          aria-label={t.copyCron}
          title={t.copyCron}
        />
      </CronExpressionRow>
    </CronFieldSection>
  );
};
