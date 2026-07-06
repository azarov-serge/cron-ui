import { Cron } from '@features/cron/components/CronEditor/models/cron';
import { parseCronExpression } from '@features/cron/utils/parseCronExpression';

export const PAGE_TAB_IDS = ['constructor', 'editorParams', 'checker'] as const;

export type PageTabId = (typeof PAGE_TAB_IDS)[number];

export const DEFAULT_PAGE_TAB: PageTabId = 'constructor';

export type CronPageUrlState = {
  tab: PageTabId;
  cron: Cron;
  checkerExpression: string;
  cronParamError?: string;
};

export const isPageTabId = (value: string | null): value is PageTabId =>
  PAGE_TAB_IDS.includes(value as PageTabId);

export const parseTabParam = (value: string | null): PageTabId =>
  isPageTabId(value) ? value : DEFAULT_PAGE_TAB;

/** Разбирает cron из query-параметра; при ошибке — createEmpty() и текст ошибки */
export const resolveCronFromSearchParam = (
  raw: string | null,
): Pick<CronPageUrlState, 'cron' | 'checkerExpression' | 'cronParamError'> => {
  if (!raw?.trim()) {
    return {
      cron: Cron.createEmpty(),
      checkerExpression: '',
    };
  }

  const expression = raw.trim();
  const result = parseCronExpression(expression);

  if (result.valid === false) {
    return {
      cron: Cron.createEmpty(),
      checkerExpression: expression,
      cronParamError: result.error,
    };
  }

  return {
    cron: result.cron,
    checkerExpression: result.expression,
  };
};

export const readCronPageUrlState = (
  search = window.location.search,
): CronPageUrlState => {
  const params = new URLSearchParams(search);

  return {
    tab: parseTabParam(params.get('tab')),
    ...resolveCronFromSearchParam(params.get('cron')),
  };
};

/** Cron string for the URL query param (never empty). */
export const resolveUrlCronExpression = (
  tab: PageTabId,
  cron: Cron,
  checkerExpression: string,
): string => {
  if (tab === 'checker') {
    const trimmed = checkerExpression.trim();
    if (trimmed) {
      return trimmed;
    }
  }

  return cron.toExpression();
};

export const buildCronPageSearch = (
  tab: PageTabId,
  cronExpression: string,
): string => {
  const params = new URLSearchParams();
  const trimmed = cronExpression.trim() || Cron.createEmpty().toExpression();

  params.set('tab', tab);
  params.set('cron', trimmed);

  return params.toString();
};

export const writeCronPageUrl = (
  tab: PageTabId,
  cronExpression: string,
): void => {
  const query = buildCronPageSearch(tab, cronExpression);
  const nextUrl = query
    ? `${window.location.pathname}?${query}`
    : window.location.pathname;

  window.history.replaceState(null, '', nextUrl);
};
