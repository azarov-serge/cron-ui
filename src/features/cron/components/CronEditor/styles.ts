import styled from 'styled-components';
import { LIGHT_THEME } from '@admiral-ds/react-ui';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0;
  margin: 0;
`;

export const Section = styled.fieldset`
  border: 1px solid ${LIGHT_THEME.color['Neutral/Neutral 20']};
  border-radius: 4px;
  margin: 0 0 16px;
  padding: 12px 16px 16px;

  legend {
    padding: 0 6px;
    color: ${LIGHT_THEME.color['Neutral/Neutral 50']};
    font-size: 13px;
  }
`;

export const InlineRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 12px;
`;

export const WeekDaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(140px, 1fr));
  gap: 8px 16px;
  margin-top: 12px;

  @media (max-width: 700px) {
    grid-template-columns: repeat(2, minmax(120px, 1fr));
  }
`;

export const RadioRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 12px;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const RadioLabel = styled.div`
  display: flex;
  align-items: center;
  min-height: 40px;
`;

export const IntervalControls = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 12px;
`;

export const EveryFrequencyBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const EveryFrequencyRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 12px;
`;

export const FieldHint = styled.div<{ $error?: boolean; $inSection?: boolean }>`
  margin: ${({ $inSection }) => ($inSection ? '4px 0 0' : '-4px 0 8px')};
  padding-left: ${({ $inSection }) => ($inSection ? '0' : '28px')};
  font-size: 12px;
  line-height: 16px;
  color: ${({ $error }) =>
    $error
      ? LIGHT_THEME.color['Error/Error 60 Main']
      : LIGHT_THEME.color['Neutral/Neutral 50']};
`;

export const FrequencyGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const DescriptionSection = styled(Section)`
  margin-bottom: 0;
`;

export const NarrowField = styled.div`
  width: 120px;
`;

export const IntervalField = styled.div`
  width: 180px;
`;

export const TimeFieldWrap = styled.div`
  width: 140px;
`;

export const DateFieldWrap = styled.div`
  width: 180px;
`;

export const UnitSelectWrap = styled.div`
  width: 180px;
`;

export const NoticeWrap = styled.div`
  margin-top: 12px;
`;
