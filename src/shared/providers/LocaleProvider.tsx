import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type FC,
  type ReactNode,
} from 'react';
import type { Locale } from '@shared/i18n/messages';

const STORAGE_KEY = 'cron-ui-locale';

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

const readLocale = (): Locale => {
  if (typeof window === 'undefined') {
    return 'ru';
  }

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'ru' || saved === 'en') {
    return saved;
  }

  return 'ru';
};

type LocaleProviderProps = {
  children: ReactNode;
};

export const LocaleProvider: FC<LocaleProviderProps> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(readLocale);

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
    localStorage.setItem(STORAGE_KEY, nextLocale);
  }, []);

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
};

export const useLocale = (): LocaleContextValue => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return context;
};
