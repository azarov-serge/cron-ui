import { useCallback, useEffect, useState } from 'react';
import { Cron } from '@features/cron/components/CronEditor/models/cron';
import {
  readCronPageUrlState,
  type PageTabId,
  writeCronPageUrl,
} from '@features/cron/utils/cronPageSearchParams';

export const useCronPageSearchParams = () => {
  const [activeTab, setActiveTab] = useState<PageTabId>(
    () => readCronPageUrlState().tab,
  );
  const [cron, setCron] = useState<Cron>(() => readCronPageUrlState().cron);
  const [checkerExpression, setCheckerExpression] = useState(
    () => readCronPageUrlState().checkerExpression,
  );
  const [cronParamError, setCronParamError] = useState<string | undefined>(
    () => readCronPageUrlState().cronParamError,
  );

  const syncUrl = useCallback((tab: PageTabId, expression: string) => {
    writeCronPageUrl(tab, expression);
  }, []);

  const applyUrlState = useCallback((search: string) => {
    const state = readCronPageUrlState(search);
    setActiveTab(state.tab);
    setCron(state.cron);
    setCheckerExpression(state.checkerExpression);
    setCronParamError(state.cronParamError);
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      applyUrlState(window.location.search);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [applyUrlState]);

  const selectTab = useCallback(
    (tab: PageTabId) => {
      setActiveTab(tab);
      syncUrl(tab, checkerExpression);
    },
    [checkerExpression, syncUrl],
  );

  const changeCheckerExpression = useCallback(
    (expression: string) => {
      setCheckerExpression(expression);
      setCronParamError(undefined);
      syncUrl(activeTab, expression);
    },
    [activeTab, syncUrl],
  );

  const submitCron = useCallback(
    (nextCron: Cron) => {
      const expression = nextCron.toExpression();
      setCron(nextCron);
      setCheckerExpression(expression);
      setCronParamError(undefined);
      syncUrl(activeTab, expression);
    },
    [activeTab, syncUrl],
  );

  return {
    activeTab,
    cron,
    checkerExpression,
    cronParamError,
    selectTab,
    changeCheckerExpression,
    submitCron,
  };
};
