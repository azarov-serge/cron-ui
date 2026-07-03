import { useMemo, type FC } from 'react';
import styled from 'styled-components';
import { MenuButton, Toggle, T } from '@admiral-ds/react-ui';
import LightModeOutline from '@admiral-ds/icons/build/system/LightModeOutline.svg?react';
import DarkModeOutline from '@admiral-ds/icons/build/system/DarkModeOutline.svg?react';
import packageJson from '../../../../package.json';
import type { Locale } from '@shared/i18n/messages';
import { useTranslation } from '@shared/i18n/useTranslation';
import { useMediaQuery } from '@shared/hooks/useMediaQuery';
import {
  LanguageFlag,
  LANGUAGE_NATIVE_NAMES,
  LOCALES,
} from '@shared/components/LanguageFlag/LanguageFlag';
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
  flex-wrap: nowrap;

  @media (max-width: 767px) {
    gap: 8px;
    padding: 8px 12px;
  }
`;

const LogoGroup = styled.div`
  display: flex;
  align-items: baseline;
  gap: 12px;
  min-width: 0;
  flex-shrink: 1;

  @media (max-width: 767px) {
    gap: 6px;
  }
`;

const Logo = styled(T)`
  font-size: 20px;
  line-height: 24px;
  color: ${({ theme }) => theme.color['Neutral/Neutral 90']};
  white-space: nowrap;

  @media (max-width: 767px) {
    font-size: 18px;
    line-height: 22px;
  }
`;

const Version = styled(T)`
  color: ${({ theme }) => theme.color['Neutral/Neutral 50']};
  white-space: nowrap;

  @media (max-width: 767px) {
    font-size: 11px;
    line-height: 14px;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;

  @media (max-width: 767px) {
    gap: 6px;
  }
`;

const LanguageOption = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const LanguageButton = styled(MenuButton)`
  color: ${({ theme }) => theme.color['Neutral/Neutral 90']};

  ${LanguageOption} svg {
    flex-shrink: 0;
  }

  @media (max-width: 767px) {
    min-width: auto;
    padding-left: 8px;
    padding-right: 8px;
  }
`;

const ThemeControl = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 767px) {
    gap: 4px;
  }
`;

const ThemeIcon = styled.span<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
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

  @media (max-width: 767px) {
    width: 16px;
    height: 16px;

    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

export const Header: FC = () => {
  const { t, locale, setLocale } = useTranslation();
  const { isDark, onToggleChange } = useThemePreference();
  const isCompact = useMediaQuery('(max-width: 767px)');

  const languageItems = useMemo(
    () =>
      LOCALES.map((id) => ({
        id,
        render: (
          <LanguageOption>
            <LanguageFlag locale={id} />
            {LANGUAGE_NATIVE_NAMES[id]}
          </LanguageOption>
        ),
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
        <LanguageButton
          appearance="ghost"
          dimension={isCompact ? 's' : 'm'}
          selected={locale}
          items={languageItems}
          onSelectItem={(id) => setLocale(id as Locale)}
          aria-label={LANGUAGE_NATIVE_NAMES[locale]}
        >
          <LanguageOption>
            <LanguageFlag locale={locale} />
            {LANGUAGE_NATIVE_NAMES[locale]}
          </LanguageOption>
        </LanguageButton>
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
