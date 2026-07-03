import { messages } from '@shared/i18n/messages';
import { useLocale } from '@shared/providers/LocaleProvider';

export const useTranslation = () => {
  const { locale, setLocale } = useLocale();

  return {
    t: messages[locale],
    locale,
    setLocale,
  };
};
