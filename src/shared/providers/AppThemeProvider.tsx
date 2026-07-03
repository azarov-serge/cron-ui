import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type FC,
  type ReactNode,
} from 'react';
import { ThemeProvider } from 'styled-components';
import { DARK_THEME, LIGHT_THEME, type Theme } from '@admiral-ds/react-ui';
import { useMediaQuery } from '@shared/hooks/useMediaQuery';

export type ThemePreference = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'cron-ui-theme';

type ThemePreferenceContextValue = {
  preference: ThemePreference;
  isDark: boolean;
  theme: Theme;
  onToggleChange: (checked: boolean) => void;
};

const ThemePreferenceContext = createContext<ThemePreferenceContextValue | null>(
  null,
);

const readPreference = (): ThemePreference => {
  if (typeof window === 'undefined') {
    return 'system';
  }

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'light' || saved === 'dark' || saved === 'system') {
    return saved;
  }

  const preference: ThemePreference = 'system';
  localStorage.setItem(STORAGE_KEY, preference);
  return preference;
};

type AppThemeProviderProps = {
  children: ReactNode;
};

export const AppThemeProvider: FC<AppThemeProviderProps> = ({ children }) => {
  const [preference, setPreference] = useState<ThemePreference>(readPreference);
  const systemDark = useMediaQuery('(prefers-color-scheme: dark)');

  const isDark =
    preference === 'dark' || (preference === 'system' && systemDark);
  const theme = isDark ? DARK_THEME : LIGHT_THEME;

  useEffect(() => {
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
  }, [isDark]);

  const setLight = useCallback(() => {
    setPreference('light');
    localStorage.setItem(STORAGE_KEY, 'light');
  }, []);

  const setDark = useCallback(() => {
    setPreference('dark');
    localStorage.setItem(STORAGE_KEY, 'dark');
  }, []);

  const onToggleChange = useCallback(
    (checked: boolean) => {
      if (checked) {
        setDark();
      } else {
        setLight();
      }
    },
    [setDark, setLight],
  );

  const value = useMemo(
    () => ({ preference, isDark, theme, onToggleChange }),
    [preference, isDark, theme, onToggleChange],
  );

  return (
    <ThemePreferenceContext.Provider value={value}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemePreferenceContext.Provider>
  );
};

export const useThemePreference = (): ThemePreferenceContextValue => {
  const context = useContext(ThemePreferenceContext);
  if (!context) {
    throw new Error('useThemePreference must be used within AppThemeProvider');
  }
  return context;
};
