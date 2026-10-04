import { useEffect, useRef, useState } from 'react';
import * as Updates from 'expo-updates';

export type OtaGate = 'checking' | 'clear' | 'updating';

/** Don't hold the first splash if the update check never answers. */
const CHECK_BUDGET_MS = 4_000;
/** Branded splash length, so a fast download still plays it once. */
const SPLASH_PLAY_MS = 1_800;
const DOWNLOAD_BUDGET_MS = 20_000;

const RELOAD_SCREEN = {
  backgroundColor: '#FCFBFA',
  fade: false,
  spinner: { enabled: false, color: '#1C1917', size: 'small' as const },
};

function rejectAfter(ms: number): Promise<never> {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('timeout')), ms);
  });
  // The loser of Promise.race still rejects. This keeps that from surfacing.
  timeout.catch(() => undefined);
  return timeout;
}

/**
 * Check for an EAS Update while the native splash is still up.
 * No update: return `clear` so the app opens.
 * Update: return `updating` for a second splash, then reload into it.
 */
export function useOTAUpdates(): OtaGate {
  const [phase, setPhase] = useState<OtaGate>(() =>
    __DEV__ || !Updates.isEnabled ? 'clear' : 'checking',
  );
  const { isStartupProcedureRunning, isUpdatePending } = Updates.useUpdates();
  const pendingRef = useRef(isUpdatePending);
  pendingRef.current = isUpdatePending;
  const gaveUp = useRef(false);

  useEffect(() => {
    if (phase !== 'checking') return;
    const cap = setTimeout(() => {
      gaveUp.current = true;
      setPhase('clear');
    }, CHECK_BUDGET_MS);
    return () => clearTimeout(cap);
  }, [phase]);

  useEffect(() => {
    if (__DEV__ || !Updates.isEnabled) return;
    if (isStartupProcedureRunning || gaveUp.current) return;

    let cancelled = false;

    const run = async () => {
      try {
        const pending = pendingRef.current;
        if (!pending) {
          const check = await Promise.race([
            Updates.checkForUpdateAsync(),
            rejectAfter(CHECK_BUDGET_MS),
          ]);
          if (cancelled || gaveUp.current) return;
          if (!check.isAvailable) {
            setPhase('clear');
            return;
          }
        }

        if (cancelled || gaveUp.current) return;
        const shownAt = Date.now();
        setPhase('updating');

        if (!pending) {
          const fetched = await Promise.race([
            Updates.fetchUpdateAsync(),
            rejectAfter(DOWNLOAD_BUDGET_MS),
          ]);
          if (cancelled || !fetched.isNew) {
            setPhase('clear');
            return;
          }
        }

        const remain = SPLASH_PLAY_MS - (Date.now() - shownAt);
        if (remain > 0) {
          await new Promise((resolve) => setTimeout(resolve, remain));
        }
        if (cancelled) return;
        await Updates.reloadAsync({ reloadScreenOptions: RELOAD_SCREEN });
      } catch {
        // Offline or the check timed out. Open the bundle already on screen.
        if (!cancelled) setPhase('clear');
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [isStartupProcedureRunning]);

  return phase;
}
