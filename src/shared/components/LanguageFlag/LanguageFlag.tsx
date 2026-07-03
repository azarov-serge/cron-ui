import type { FC } from 'react';
import styled from 'styled-components';
import type { Locale } from '@shared/i18n/messages';

const FlagRoot = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  line-height: 0;
`;

const Flag = styled.svg`
  display: block;
  width: 16px;
  height: 12px;
  border-radius: 1px;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.12);

  .f-white {
    fill: #ffffff !important;
  }

  .f-blue {
    fill: #0039a6 !important;
  }

  .f-red {
    fill: #d52b1e !important;
  }

  .f-cn-red {
    fill: #de2910 !important;
  }

  .f-cn-yellow {
    fill: #ffde00 !important;
  }

  .f-gb-blue {
    fill: #012169 !important;
  }

  .f-gb-red {
    fill: #c8102e !important;
  }

  .f-gb-white {
    fill: #ffffff !important;
  }

  .f-in-saffron {
    fill: #ff9933 !important;
  }

  .f-in-green {
    fill: #138808 !important;
  }

  .f-in-navy {
    fill: #000080 !important;
  }
`;

type LanguageFlagProps = {
  locale: Locale;
};

export const LanguageFlag: FC<LanguageFlagProps> = ({ locale }) => {
  if (locale === 'ru') {
    return (
      <FlagRoot>
        <Flag viewBox="0 0 16 12" aria-hidden>
          <rect className="f-white" width="16" height="4" y="0" />
          <rect className="f-blue" width="16" height="4" y="4" />
          <rect className="f-red" width="16" height="4" y="8" />
        </Flag>
      </FlagRoot>
    );
  }

  if (locale === 'zh') {
    return (
      <FlagRoot>
        <Flag viewBox="0 0 16 12" aria-hidden>
          <rect className="f-cn-red" width="16" height="12" />
          <polygon
            className="f-cn-yellow"
            points="3,2 3.6,3.8 5.5,3.8 3.95,4.95 4.55,6.75 3,5.7 1.45,6.75 2.05,4.95 0.5,3.8 2.4,3.8"
          />
        </Flag>
      </FlagRoot>
    );
  }

  if (locale === 'hi') {
    return (
      <FlagRoot>
        <Flag viewBox="0 0 16 12" aria-hidden>
          <rect className="f-in-saffron" width="16" height="4" y="0" />
          <rect className="f-white" width="16" height="4" y="4" />
          <rect className="f-in-green" width="16" height="4" y="8" />
          <circle className="f-in-navy" cx="8" cy="6" r="1.2" fill="none" stroke="#000080" strokeWidth="0.35" />
        </Flag>
      </FlagRoot>
    );
  }

  return (
    <FlagRoot>
      <Flag viewBox="0 0 16 12" aria-hidden>
        <rect className="f-gb-blue" width="16" height="12" />
        <path className="f-gb-white" d="M0 0 L16 12 M16 0 L0 12" stroke="#fff" strokeWidth="2.2" fill="none" />
        <path className="f-gb-red" d="M0 0 L16 12 M16 0 L0 12" stroke="#C8102E" strokeWidth="1.2" fill="none" />
        <path className="f-gb-white" d="M8 0 V12 M0 6 H16" stroke="#fff" strokeWidth="3.2" fill="none" />
        <path className="f-gb-red" d="M8 0 V12 M0 6 H16" stroke="#C8102E" strokeWidth="1.8" fill="none" />
      </Flag>
    </FlagRoot>
  );
};

export const LANGUAGE_NATIVE_NAMES: Record<Locale, string> = {
  ru: 'Русский',
  en: 'English',
  zh: '中文',
  hi: 'हिन्दी',
};

export const LOCALE_CODES: Record<Locale, string> = {
  ru: 'RU',
  en: 'EN',
  zh: 'ZH',
  hi: 'HI',
};

export const LOCALES: Locale[] = ['ru', 'en', 'zh', 'hi'];
