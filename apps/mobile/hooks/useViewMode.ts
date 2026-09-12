import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VIEW_MODE_STORAGE_KEY, type ViewMode } from '../theme';

async function loadViewMode(): Promise<ViewMode> {
  try {
    const stored = await AsyncStorage.getItem(VIEW_MODE_STORAGE_KEY);
    if (stored === 'list' || stored === 'card') return stored;
  } catch {
    /* ignore */
  }
  return 'list';
}

export function useViewMode() {
  const [viewMode, setViewModeState] = useState<ViewMode>('list');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadViewMode().then((value) => {
      setViewModeState(value);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    void AsyncStorage.setItem(VIEW_MODE_STORAGE_KEY, viewMode);
  }, [viewMode, ready]);

  const setViewMode = useCallback((next: ViewMode) => {
    setViewModeState(next);
  }, []);

  return { viewMode, setViewMode, ready };
}
