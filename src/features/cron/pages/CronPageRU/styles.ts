import { Button, NotificationItem, T } from '@admiral-ds/react-ui';
import styled from 'styled-components';

export const Page = styled.main`
  flex: 1;
  width: 100%;
  padding: 40px 32px 48px;
  min-width: 0;
  overflow-x: hidden;

  @media (max-width: 767px) {
    padding: 16px 12px 24px;
  }
`;

export const PageHeader = styled.div`
  margin-bottom: 8px;
`;

export const PageDescription = styled(T)`
  display: block;
  margin-top: 8px;
  max-width: 56rem;
`;

export const HelpNotice = styled(NotificationItem)`
  margin-top: 16px;
`;

export const UrlErrorNotice = styled(NotificationItem)`
  margin-top: 16px;
`;

export const ParamsHint = styled(T)`
  display: block;
  margin-bottom: 12px;
`;

export const ConstructorEditor = styled.div`
  margin-top: 24px;
  min-width: 0;
  max-width: 100%;
`;

export const CheckerActions = styled.div`
  display: flex;
  flex-shrink: 0;
  gap: 8px;
  width: 100%;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
    margin-top: 16px;
  }

  @media (min-width: 768px) {
    width: auto;
  }
`;

export const EditCronButton = styled(Button)`
  flex: 1;
  justify-content: center;

  @media (min-width: 768px) {
    flex: initial;
    min-width: 200px;
  }
`;

export const ButtonContent = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  pointer-events: none;
`;

export const ControlsPanel = styled.fieldset`
  border: 1px solid ${({ theme }) => theme.color['Neutral/Neutral 20']};
  border-radius: 4px;
  margin: 0 0 24px;
  padding: 12px 16px 16px;

  &:last-child {
    margin-bottom: 0;
  }

  legend {
    padding: 0 6px;
    color: ${({ theme }) => theme.color['Neutral/Neutral 50']};
    font-size: 13px;
  }
`;

export const ControlsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px 24px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

export const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const CheckboxList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Legend = styled.legend`
  width: auto;
`;

export const TabContent = styled.div`
  margin-top: 24px;
  min-width: 0;
  max-width: 100%;
`;

