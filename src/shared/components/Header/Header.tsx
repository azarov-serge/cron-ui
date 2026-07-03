import type { FC } from 'react';
import styled from 'styled-components';
import { Toggle, T } from '@admiral-ds/react-ui';
import LightModeOutline from '@admiral-ds/icons/build/system/LightModeOutline.svg?react';
import DarkModeOutline from '@admiral-ds/icons/build/system/DarkModeOutline.svg?react';
import { useThemePreference } from '@shared/providers/AppThemeProvider';

const HeaderBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.color['Neutral/Neutral 20']};
  background: ${({ theme }) => theme.color['Neutral/Neutral 00']};

  @media (max-width: 767px) {
    padding: 12px 16px;
  }
`;

const Logo = styled(T)`
  font-size: 20px;
  line-height: 24px;
  color: ${({ theme }) => theme.color['Neutral/Neutral 90']};
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

export const Header: FC = () => {
  const { isDark, onToggleChange } = useThemePreference();

  return (
    <HeaderBar>
      <Logo font="Header/H4">cron</Logo>
      <ThemeControl>
        <ThemeIcon $active={!isDark} aria-hidden>
          <LightModeOutline />
        </ThemeIcon>
        <Toggle
          checked={isDark}
          onChange={(event) => onToggleChange(event.target.checked)}
          aria-label={isDark ? 'Тёмная тема' : 'Светлая тема'}
        />
        <ThemeIcon $active={isDark} aria-hidden>
          <DarkModeOutline />
        </ThemeIcon>
      </ThemeControl>
    </HeaderBar>
  );
};
