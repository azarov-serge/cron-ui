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

const SUPPORTED_LOCALES: Locale[] = ['ru', 'en', 'zh', 'hi'];

const isLocale = (value: string | null): value is Locale =>
  value !== null && SUPPORTED_LOCALES.includes(value as Locale);

const detectBrowserLocale = (): Locale => {
  if (typeof navigator === 'undefined') {
    return 'ru';
  }

  const languages = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];

  for (const language of languages) {
    const code = language.toLowerCase();

    if (code.startsWith('ru')) {
      return 'ru';
    }
    if (code.startsWith('zh')) {
      return 'zh';
    }
    if (code.startsWith('hi')) {
      return 'hi';
    }
    if (code.startsWith('en')) {
      return 'en';
    }
  }

  return 'ru';
};

const readLocale = (): Locale => {
  if (typeof window === 'undefined') {
    return 'ru';
  }

  const saved = localStorage.getItem(STORAGE_KEY);
  if (isLocale(saved)) {
    return saved;
  }

  const detected = detectBrowserLocale();
  localStorage.setItem(STORAGE_KEY, detected);
  return detected;
};

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

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
