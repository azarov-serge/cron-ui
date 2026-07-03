import React from 'react';
import { useTranslation } from '@shared/i18n/useTranslation';
import {
  CronFieldLegend,
  CronFieldSection,
  DescriptionText,
} from './styles';

export interface CronDescriptionFieldProps {
  description: string;
}

export const CronDescriptionField: React.FC<CronDescriptionFieldProps> = ({
  description,
}) => {
  const { t } = useTranslation();

  return (
    <CronFieldSection>
      <CronFieldLegend>{t.editor.descriptionLegend}</CronFieldLegend>
      <DescriptionText>{description}</DescriptionText>
    </CronFieldSection>
  );
};
