import { useEffect } from 'react';
import * as Updates from 'expo-updates';

/**
 * Production builds: check EAS Update on launch and reload when a new
 * JS bundle is ready. No-ops in Expo Go / development.
 */
export function useOTAUpdates() {
  useEffect(() => {
    if (__DEV__ || !Updates.isEnabled) return;

    let cancelled = false;

    const run = async () => {
      try {
        const check = await Updates.checkForUpdateAsync();
        if (cancelled || !check.isAvailable) return;

        const result = await Updates.fetchUpdateAsync();
        if (cancelled || !result.isNew) return;

        await Updates.reloadAsync();
      } catch {
        // Offline or update service unavailable — keep current bundle.
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, []);
}
