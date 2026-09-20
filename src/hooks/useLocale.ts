import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  APP_LOCALES,
  changeAppLocale,
  getAppLocale,
  type AppLocale,
} from '../i18n';

export function useLocale() {
  const { i18n } = useTranslation();
  const [locale, setLocaleState] = useState<AppLocale>(getAppLocale);

  useEffect(() => {
    const onLanguageChanged = (lng: string) => {
      const code = lng.split('-')[0];
      if ((APP_LOCALES as readonly string[]).includes(code)) {
        setLocaleState(code as AppLocale);
      }
    };
    i18n.on('languageChanged', onLanguageChanged);
    return () => {
      i18n.off('languageChanged', onLanguageChanged);
    };
  }, [i18n]);

  const setLocale = useCallback(async (next: AppLocale) => {
    await changeAppLocale(next);
  }, []);

  return { locale, setLocale };
}
