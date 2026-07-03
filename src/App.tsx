import type { FC } from 'react';
import styled from 'styled-components';
import { CronPage } from '@features/cron/pages/CronPage';
import { Header } from '@shared/components/Header';

const Shell = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.color['Neutral/Neutral 00']};
`;

const App: FC = (_props) => {
  return (
    <Shell>
      <Header />
      <CronPage />
    </Shell>
  );
};

export default App;
