import React from 'react';
import * as Styled from './styles';

export interface CronDescriptionFieldProps {
  description: string;
}

export const CronDescriptionField: React.FC<CronDescriptionFieldProps> = (
  props,
) => {
  const { description } = props;

  return (
    <Styled.CronFieldSection>
      <Styled.CronFieldLegend>Описание</Styled.CronFieldLegend>
      <Styled.DescriptionText>{description}</Styled.DescriptionText>
    </Styled.CronFieldSection>
  );
};
