import styled from 'styled-components';
import {
  DateTimeContainer as DateTimeContainerUI,
  DateTimeDateInput as DateTimeDateInputUI,
} from '@admiral-ds/react-ui';

const MOBILE = '@media (max-width: 767px)';

export const Root = styled.div`
  width: fit-content;
  max-width: 100%;
`;

export const Container = styled(DateTimeContainerUI)`
  width: fit-content;
  max-width: 100%;
  min-width: 0;
`;

export const DateInput = styled(DateTimeDateInputUI)`
  flex: 0 0 168px;
  width: 168px;
  min-width: 0;

  ${MOBILE} {
    flex: 1 1 auto;
    width: auto;
  }
`;

export const TimeWrap = styled.div`
  flex: 0 0 104px;
  width: 104px;
  min-width: 0;

  ${MOBILE} {
    flex: 0 0 96px;
    width: 96px;
  }
`;
