const WILDCARD = '*';

/** Заменяет null/пустое значение поля cron на «*» */
export const toWildcard = (value: string | null | undefined): string => {
  return value === null || value === undefined || value === ''
    ? WILDCARD
    : value;
};

/** Преобразует «*» в null при разборе cron-выражения */
export const fromWildcard = (value: string): string | null => {
  return value === WILDCARD ? null : value;
};
