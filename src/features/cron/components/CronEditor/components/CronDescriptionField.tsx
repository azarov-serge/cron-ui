import React from 'react';
import { useTranslation } from '@shared/i18n/useTranslation';
import * as Styled from './styles';

export interface CronDescriptionFieldProps {
  description: string;
}

export const CronDescriptionField: React.FC<CronDescriptionFieldProps> = (
  props,
) => {
  const { description } = props;
  const { t } = useTranslation();

  return (
    <Styled.CronFieldSection>
      <Styled.CronFieldLegend>{t.editor.descriptionLegend}</Styled.CronFieldLegend>
      <Styled.DescriptionText>{description}</Styled.DescriptionText>
    </Styled.CronFieldSection>
  );
};
