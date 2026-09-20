import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  APP_LOCALES,
  LOCALE_STORAGE_KEY,
  type AppLocale,
} from '../i18n/types';
import { changeAppLocale, detectDeviceLocale, getAppLocale } from '../i18n';

async function loadStoredLocale(): Promise<AppLocale | null> {
  try {
    const stored = await AsyncStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored && (APP_LOCALES as readonly string[]).includes(stored)) {
      return stored as AppLocale;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function useLocale() {
  const [locale, setLocaleState] = useState<AppLocale>(getAppLocale);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void (async () => {
      const stored = await loadStoredLocale();
      const next = stored ?? detectDeviceLocale();
      await changeAppLocale(next);
      setLocaleState(next);
      setReady(true);
    })();
  }, []);

  const setLocale = useCallback(async (next: AppLocale) => {
    setLocaleState(next);
    await changeAppLocale(next);
    try {
      await AsyncStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  return { locale, setLocale, ready };
}
