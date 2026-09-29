import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import * as Updates from 'expo-updates';
import i18n from '../i18n';

/** Re-check while the app stays open, without hammering the update service. */
const POLL_MS = 90_000;
/** First paint + splash should finish before any network update work. */
const AFTER_READY_MS = 2_500;
/** Let the toast paint before `reloadAsync` tears down the JS runtime. */
const TOAST_BEFORE_RELOAD_MS = 600;

/**
 * Apply a downloaded EAS Update in place.
 *
 * Native startup (`CheckOnLaunch`) must finish first — calling reload during
 * that race has crashed iOS release builds. After that, a new bundle is
 * fetched and `reloadAsync()` swaps it without the user killing the app.
 *
 * `enabled` should stay false until the cold-start splash is gone so update
 * downloads do not compete with first paint on slow networks.
 */
export function useOTAUpdates(
  onUpdateReady?: (message: string) => void,
  enabled = true,
) {
  const busyRef = useRef(false);
  const lastCheckRef = useRef(0);
  const onUpdateReadyRef = useRef(onUpdateReady);
  onUpdateReadyRef.current = onUpdateReady;
  const { isStartupProcedureRunning, isUpdatePending } = Updates.useUpdates();

  useEffect(() => {
    if (!enabled || __DEV__ || !Updates.isEnabled || isStartupProcedureRunning) return;

    let cancelled = false;

    const apply = async (force = false) => {
      if (cancelled || busyRef.current) return;
      if (AppState.currentState !== 'active') return;

      const now = Date.now();
      // Pending updates should apply promptly; otherwise throttle checks.
      if (!force && !isUpdatePending && now - lastCheckRef.current < POLL_MS) return;

      busyRef.current = true;
      try {
        if (!isUpdatePending) {
          lastCheckRef.current = now;
          const check = await Updates.checkForUpdateAsync();
          if (cancelled || !check.isAvailable) return;
          const fetched = await Updates.fetchUpdateAsync();
          if (cancelled || !fetched.isNew) return;
        } else {
          lastCheckRef.current = now;
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
      void apply(true);
    }, AFTER_READY_MS);
    const interval = setInterval(() => {
      void apply(false);
    }, POLL_MS);
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') void apply(false);
    });

    return () => {
      cancelled = true;
      clearTimeout(first);
      clearInterval(interval);
      sub.remove();
    };
  }, [enabled, isStartupProcedureRunning, isUpdatePending]);
}
