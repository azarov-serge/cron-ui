import { useCallback, useEffect, useState } from 'react';
import { Cron } from '@features/cron/components/CronEditor/models/cron';
import {
  readCronPageUrlState,
  buildCronPageSearch,
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

  useEffect(() => {
    const state = readCronPageUrlState();
    const params = new URLSearchParams(window.location.search);

    let expression =
      state.tab === 'checker'
        ? state.checkerExpression.trim() || state.cron.toExpression()
        : state.cron.toExpression();

    if (state.tab === 'checker' && !state.checkerExpression.trim()) {
      setCheckerExpression(expression);
    }

    const expectedQuery = buildCronPageSearch(state.tab, expression);
    if (params.toString() !== expectedQuery) {
      syncUrl(state.tab, expression);
    }
  }, [syncUrl]);

  const selectTab = useCallback(
    (tab: PageTabId) => {
      setActiveTab(tab);
      if (tab === 'checker' && !checkerExpression.trim()) {
        const expression = cron.toExpression();
        setCheckerExpression(expression);
        syncUrl(tab, expression);
        return;
      }
      syncUrl(tab, checkerExpression);
    },
    [checkerExpression, cron, syncUrl],
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
