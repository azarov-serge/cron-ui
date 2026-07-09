import { T } from '@admiral-ds/react-ui';
import styled from 'styled-components';

const MOBILE = '@media (max-width: 767px)';

export const Root = styled.div`
  width: 100%;
  max-width: 100%;
`;

export const Row = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
  max-width: 100%;
  min-width: 0;

  ${MOBILE} {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const ArrowWrap = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  min-width: 24px;
  height: 32px;
  /* Подпись Field (~20px) + отступ до инпута — стрелка напротив полей, не лейблов */
  margin-top: 28px;
  color: ${({ theme }) => theme.color['Neutral/Neutral 50']};

  ${MOBILE} {
    width: 100%;
    height: auto;
    min-height: 20px;
    margin-top: 0;
  }
`;

export const Item = styled.div`
  min-width: 0;
  max-width: 100%;
  align-self: flex-start;
`;

export const ErrorText = styled(T)`
  display: block;
  margin-top: 8px;
`;

