import styled from 'styled-components';
import { LIGHT_THEME } from '@admiral-ds/react-ui';

const MOBILE = '@media (max-width: 767px)';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0;
  margin: 0;
  min-width: 0;
  max-width: 100%;
`;

export const Section = styled.fieldset`
  border: 1px solid ${LIGHT_THEME.color['Neutral/Neutral 20']};
  border-radius: 4px;
  margin: 0 0 16px;
  padding: 12px 16px 16px;
  min-width: 0;
  max-width: 100%;

  ${MOBILE} {
    padding: 12px;
  }

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
  min-width: 0;
  max-width: 100%;
`;

export const WeekDaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px 16px;
  margin-top: 12px;
  min-width: 0;
  max-width: 100%;

  @media (max-width: 700px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  ${MOBILE} {
    grid-template-columns: 1fr;
    gap: 6px;
  }
`;

export const RadioRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 12px;
  margin-bottom: 12px;
  min-width: 0;
  max-width: 100%;

  &:last-child {
    margin-bottom: 0;
  }

  ${MOBILE} {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
`;

export const RadioLabel = styled.div`
  display: flex;
  align-items: center;
  min-height: 40px;
  min-width: 0;
`;

export const IntervalControls = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 12px;
  min-width: 0;
  max-width: 100%;

  ${MOBILE} {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const EveryFrequencyBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
  min-width: 0;
  max-width: 100%;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const EveryFrequencyRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 12px;
  min-width: 0;
  max-width: 100%;

  ${MOBILE} {
    flex-direction: column;
    align-items: stretch;
  }
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

  ${MOBILE} {
    padding-left: 0;
  }
`;

export const FrequencyGroup = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  max-width: 100%;
`;

export const DescriptionSection = styled(Section)`
  margin-bottom: 0;
`;

const responsiveField = (desktopWidth: string) => styled.div`
  width: ${desktopWidth};
  max-width: 100%;
  min-width: 0;

  ${MOBILE} {
    width: 100%;
  }

  & > * {
    max-width: 100%;
  }
`;

export const NarrowField = responsiveField('120px');
export const IntervalField = responsiveField('180px');
export const TimeFieldWrap = responsiveField('140px');
export const DateFieldWrap = responsiveField('180px');
export const UnitSelectWrap = responsiveField('180px');

export const NoticeWrap = styled.div`
  margin-top: 12px;
  min-width: 0;
  max-width: 100%;
`;
