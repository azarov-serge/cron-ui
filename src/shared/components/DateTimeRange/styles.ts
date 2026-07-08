import { T } from '@admiral-ds/react-ui';
import styled from 'styled-components';

const MOBILE = '@media (max-width: 767px)';

export const Root = styled.div`
  width: 100%;
  max-width: 100%;
`;

export const Row = styled.div`
  display: flex;
  align-items: flex-end;
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
  min-width: 24px;
  height: 32px;
  color: ${({ theme }) => theme.color['Neutral/Neutral 50']};

  ${MOBILE} {
    width: 100%;
    height: auto;
    min-height: 20px;
  }
`;

export const Item = styled.div`
  min-width: 0;
  max-width: 100%;
`;

export const ErrorText = styled(T)`
  display: block;
  margin-top: 8px;
`;

