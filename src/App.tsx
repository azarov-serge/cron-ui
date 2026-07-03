import type { FC } from 'react';
import styled from 'styled-components';
import { CronPage } from '@features/cron/pages/CronPage';
import { Header } from '@shared/components/Header';
import { LAYOUT_MAX_WIDTH_PX } from '@shared/constants/layout';

const Shell = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.color['Neutral/Neutral 00']};
`;

const Layout = styled.div`
  width: 100%;
  max-width: ${LAYOUT_MAX_WIDTH_PX}px;
  margin: 0 auto;
  min-width: 0;
  min-height: 100vh;
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.color['Neutral/Neutral 20']};
  box-sizing: border-box;
`;

const App: FC = (_props) => {
  return (
    <Shell>
      <Layout>
        <Header />
        <CronPage />
      </Layout>
    </Shell>
  );
};

export default App;
