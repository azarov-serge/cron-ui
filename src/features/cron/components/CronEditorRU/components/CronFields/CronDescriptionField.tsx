import React from 'react';
import { editorStrings } from '../../strings';
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
}) => (
  <CronFieldSection>
    <CronFieldLegend>{editorStrings.descriptionLegend}</CronFieldLegend>
    <DescriptionText>{description}</DescriptionText>
  </CronFieldSection>
);
