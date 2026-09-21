import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import * as Updates from 'expo-updates';
import i18n from '../i18n';

/** Re-check while the app stays open, without hammering the update service. */
const POLL_MS = 90_000;
/** Let the toast paint before `reloadAsync` tears down the JS runtime. */
const TOAST_BEFORE_RELOAD_MS = 600;

/**
 * Apply a downloaded EAS Update in place.
 *
 * Native startup (`CheckOnLaunch`) must finish first — calling reload during
 * that race has crashed iOS release builds. After that, a new bundle is
 * fetched and `reloadAsync()` swaps it without the user killing the app.
 */
export function useOTAUpdates(onUpdateReady?: (message: string) => void) {
  const busyRef = useRef(false);
  const onUpdateReadyRef = useRef(onUpdateReady);
  onUpdateReadyRef.current = onUpdateReady;
  const { isStartupProcedureRunning, isUpdatePending } = Updates.useUpdates();

  useEffect(() => {
    if (__DEV__ || !Updates.isEnabled || isStartupProcedureRunning) return;

    let cancelled = false;

    const apply = async () => {
      if (cancelled || busyRef.current) return;
      if (AppState.currentState !== 'active') return;
      busyRef.current = true;
      try {
        if (!isUpdatePending) {
          const check = await Updates.checkForUpdateAsync();
          if (cancelled || !check.isAvailable) return;
          const fetched = await Updates.fetchUpdateAsync();
          if (cancelled || !fetched.isNew) return;
        }
        onUpdateReadyRef.current?.(i18n.t('ota.updating', { ns: 'ui' }));
        await new Promise((resolve) => setTimeout(resolve, TOAST_BEFORE_RELOAD_MS));
        if (cancelled) return;
        await Updates.reloadAsync();
      } catch {
        // Offline or update service unavailable — keep the current bundle.
      } finally {
        busyRef.current = false;
      }
    };

    const first = setTimeout(() => {
      void apply();
    }, 1200);
    const interval = setInterval(() => {
      void apply();
    }, POLL_MS);
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') void apply();
    });

    return () => {
      cancelled = true;
      clearTimeout(first);
      clearInterval(interval);
      sub.remove();
    };
  }, [isStartupProcedureRunning, isUpdatePending]);
}
