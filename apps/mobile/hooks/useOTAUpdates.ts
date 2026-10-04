import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import * as Updates from 'expo-updates';

/** Re-check while the app stays open, without hammering the update service. */
const POLL_MS = 90_000;
/** First paint + splash should finish before any network update work. */
const AFTER_READY_MS = 2_500;
/**
 * Download an EAS Update without swapping the running bundle.
 *
 * `reloadAsync()` during or just after launch has left iOS on a white screen.
 * A fetched update is applied on the next cold start by the native updater.
 *
 * `enabled` should stay false until the cold-start splash is gone so the
 * download does not compete with first paint on slow networks.
 */
export function useOTAUpdates(enabled = true) {
  const busyRef = useRef(false);
  const lastCheckRef = useRef(0);
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
