import { useMemo, type FC } from 'react';
import styled from 'styled-components';
import { MenuButton, Toggle, T } from '@admiral-ds/react-ui';
import LightModeOutline from '@admiral-ds/icons/build/system/LightModeOutline.svg?react';
import DarkModeOutline from '@admiral-ds/icons/build/system/DarkModeOutline.svg?react';
import packageJson from '../../../../package.json';
import type { Locale } from '@shared/i18n/messages';
import { useTranslation } from '@shared/i18n/useTranslation';
import { useThemePreference } from '@shared/providers/AppThemeProvider';

const HeaderBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.color['Neutral/Neutral 20']};
  background: ${({ theme }) => theme.color['Neutral/Neutral 00']};
  min-width: 0;

  @media (max-width: 767px) {
    padding: 12px 16px;
    flex-wrap: wrap;
  }
`;

const LogoGroup = styled.div`
  display: flex;
  align-items: baseline;
  gap: 12px;
  min-width: 0;
`;

const Logo = styled(T)`
  font-size: 20px;
  line-height: 24px;
  color: ${({ theme }) => theme.color['Neutral/Neutral 90']};
`;

const Version = styled(T)`
  color: ${({ theme }) => theme.color['Neutral/Neutral 50']};
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;

  @media (max-width: 767px) {
    gap: 12px;
  }
`;

const ThemeControl = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ThemeIcon = styled.span<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: ${({ theme, $active }) =>
    $active
      ? theme.color['Primary/Primary 60 Main']
      : theme.color['Neutral/Neutral 50']};

  svg {
    width: 20px;
    height: 20px;
  }

  svg *[fill^='#'] {
    fill: currentColor;
  }
`;

const LANGUAGE_ITEMS = [
  { id: 'ru', render: 'RU' },
  { id: 'en', render: 'EN' },
] as const;

export const Header: FC = () => {
  const { t, locale, setLocale } = useTranslation();
  const { isDark, onToggleChange } = useThemePreference();

  const languageItems = useMemo(
    () =>
      LANGUAGE_ITEMS.map((item) => ({
        id: item.id,
        render: item.render,
      })),
    [],
  );

  return (
    <HeaderBar>
      <LogoGroup>
        <Logo font="Header/H4">cron</Logo>
        <Version font="Body/Body 2 Short">v{packageJson.version}</Version>
      </LogoGroup>
      <HeaderActions>
        <MenuButton
          appearance="ghost"
          dimension="m"
          selected={locale}
          items={languageItems}
          onSelectItem={(id) => setLocale(id as Locale)}
          aria-label={locale === 'en' ? t.language.en : t.language.ru}
        >
          {locale.toUpperCase()}
        </MenuButton>
        <ThemeControl>
          <ThemeIcon $active={!isDark} aria-hidden>
            <LightModeOutline />
          </ThemeIcon>
          <Toggle
            checked={isDark}
            onChange={(event) => onToggleChange(event.target.checked)}
            aria-label={isDark ? t.theme.dark : t.theme.light}
          />
          <ThemeIcon $active={isDark} aria-hidden>
            <DarkModeOutline />
          </ThemeIcon>
        </ThemeControl>
      </HeaderActions>
    </HeaderBar>
  );
};
