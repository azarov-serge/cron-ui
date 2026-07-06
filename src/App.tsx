import type { FC } from 'react';
import styled from 'styled-components';
import { CronPage } from '@features/cron/pages/CronPage';
import { Header } from '@shared/components/Header';
import { LAYOUT_MAX_WIDTH_PX } from '@shared/constants/layout';

const Shell = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  background: ${({ theme }) => theme.color['Neutral/Neutral 05']};
`;

const Layout = styled.div`
  width: 100%;
  max-width: ${LAYOUT_MAX_WIDTH_PX}px;
  min-width: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.color['Neutral/Neutral 00']};
  border-left: 1px solid ${({ theme }) => theme.color['Neutral/Neutral 20']};
  border-right: 1px solid ${({ theme }) => theme.color['Neutral/Neutral 20']};
  box-sizing: border-box;

  @media (min-width: ${LAYOUT_MAX_WIDTH_PX + 1}px) {
    border: 1px solid ${({ theme }) => theme.color['Neutral/Neutral 20']};
  }
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
