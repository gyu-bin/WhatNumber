import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { THEME_STORAGE_KEY, type Theme } from '../theme';

async function loadTheme(): Promise<Theme> {
  try {
    const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    /* ignore */
  }
  return 'dark';
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadTheme().then((value) => {
      setThemeState(value);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    void AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme, ready]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
  }, []);

  const toggle = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, setTheme, toggle, ready };
}
