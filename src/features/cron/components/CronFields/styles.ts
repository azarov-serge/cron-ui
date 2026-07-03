import styled from 'styled-components';
import { T } from '@admiral-ds/react-ui';
import { MONO_FONT_FAMILY } from '@shared/styles/typography';
import { Section } from '../CronEditor/styles';

export const CronFieldSection = styled(Section)`
  margin-bottom: 0;
`;

export const CronFieldLegend = styled.legend`
  width: auto;
`;

export const CronCodeText = styled.code`
  font-family: ${MONO_FONT_FAMILY};
  font-size: 13px;
  line-height: 20px;
  color: ${({ theme }) => theme.color['Neutral/Neutral 90']};
  word-break: break-all;
`;

export const CronExpressionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;

  @media (max-width: 767px) {
    justify-content: space-between;
    width: 100%;
  }
`;

export const DescriptionText = styled(T).attrs({
  font: 'Body/Body 1 Long',
  color: 'Neutral/Neutral 90',
  as: 'span',
})`
  display: block;
  word-break: break-word;
`;
