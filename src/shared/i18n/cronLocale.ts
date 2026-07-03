import type { Locale } from './messages';

/** Maps app locale to cronstrue locale id (hi не поддерживается — см. describeCronHuman) */
export const toCronstrueLocale = (locale: Locale): string => {
  if (locale === 'zh') {
    return 'zh_CN';
  }
  return locale;
};
