import { useCallback, useEffect, useState } from 'react';
import { Cron } from '@features/cron/components/CronEditor/models/cron';
import {
  readCronPageUrlState,
  buildCronPageSearch,
  resolveUrlCronExpression,
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

  const syncUrl = useCallback(
    (tab: PageTabId, cronState: Cron, checkerExpr: string) => {
      writeCronPageUrl(
        tab,
        resolveUrlCronExpression(tab, cronState, checkerExpr),
      );
    },
    [],
  );

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
    const expression = resolveUrlCronExpression(
      state.tab,
      state.cron,
      state.checkerExpression,
    );

    if (state.tab === 'checker' && !state.checkerExpression.trim()) {
      setCheckerExpression(expression);
    }

    const expectedQuery = buildCronPageSearch(state.tab, expression);
    if (params.toString() !== expectedQuery) {
      syncUrl(state.tab, state.cron, state.checkerExpression);
    }
  }, [syncUrl]);

  const selectTab = useCallback(
    (tab: PageTabId) => {
      setActiveTab(tab);

      if (tab === 'checker' && !checkerExpression.trim()) {
        const expression = cron.toExpression();
        setCheckerExpression(expression);
        syncUrl(tab, cron, expression);
        return;
      }

      syncUrl(tab, cron, checkerExpression);
    },
    [checkerExpression, cron, syncUrl],
  );

  const changeCheckerExpression = useCallback(
    (expression: string) => {
      setCheckerExpression(expression);
      setCronParamError(undefined);
      syncUrl(activeTab, cron, expression);
    },
    [activeTab, cron, syncUrl],
  );

  const submitCron = useCallback(
    (nextCron: Cron) => {
      const expression = nextCron.toExpression();
      setCron(nextCron);
      setCheckerExpression(expression);
      setCronParamError(undefined);
      syncUrl(activeTab, nextCron, expression);
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
