import { T } from '@admiral-ds/react-ui';
import styled from 'styled-components';

const MOBILE = '@media (max-width: 767px)';

export const Root = styled.div`
  display: grid;
  grid-template-columns: max-content 24px max-content;
  column-gap: 12px;
  row-gap: 4px;
  width: fit-content;
  max-width: 100%;
  align-items: start;
  justify-items: start;

  ${MOBILE} {
    grid-template-columns: minmax(0, 1fr);
    width: 100%;
  }
`;

export const StartItem = styled.div`
  grid-column: 1;
  grid-row: 1;
  min-width: 0;
  max-width: 100%;

  ${MOBILE} {
    grid-column: 1;
    grid-row: auto;
  }
`;

export const ArrowWrap = styled.div<{ $hasLabels: boolean }>`
  grid-column: 2;
  grid-row: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 24px;
  height: 32px;
  /* С лейблами Field — стрелка напротив инпутов, не подписей */
  margin-top: ${({ $hasLabels }) => ($hasLabels ? '28px' : '0')};
  color: ${({ theme }) => theme.color['Neutral/Neutral 50']};

  ${MOBILE} {
    grid-column: 1;
    grid-row: auto;
    width: 100%;
    height: auto;
    min-height: 20px;
    margin-top: 0;
  }
`;

export const EndItem = styled.div`
  grid-column: 3;
  grid-row: 1;
  min-width: 0;
  max-width: 100%;

  ${MOBILE} {
    grid-column: 1;
    grid-row: auto;
  }
`;

export const StartError = styled(T)`
  grid-column: 1;
  grid-row: 2;
  display: block;
  min-width: 0;
  max-width: 100%;
  color: ${({ theme }) => theme.color['Error/Error 60 Main']};

  ${MOBILE} {
    grid-column: 1;
    grid-row: auto;
  }
`;

export const EndError = styled(T)`
  grid-column: 3;
  grid-row: 2;
  display: block;
  min-width: 0;
  max-width: 100%;
  color: ${({ theme }) => theme.color['Error/Error 60 Main']};

  ${MOBILE} {
    grid-column: 1;
    grid-row: auto;
  }
`;
