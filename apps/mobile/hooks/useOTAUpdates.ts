import { useEffect, useRef } from 'react';
import * as Updates from 'expo-updates';
import i18n from '../i18n';

const TOAST_BEFORE_RELOAD_MS = 1_400;

/**
 * Production builds: check EAS Update on launch and reload when a new
 * JS bundle is ready. No-ops in Expo Go / development.
 */
export function useOTAUpdates(onUpdateReady?: (message: string) => void) {
  const onUpdateReadyRef = useRef(onUpdateReady);
  onUpdateReadyRef.current = onUpdateReady;

  useEffect(() => {
    if (__DEV__ || !Updates.isEnabled) return;

    let cancelled = false;

    const run = async () => {
      try {
        const check = await Updates.checkForUpdateAsync();
        if (cancelled || !check.isAvailable) return;

        const result = await Updates.fetchUpdateAsync();
        if (cancelled || !result.isNew) return;

        onUpdateReadyRef.current?.(i18n.t('ota.updating', { ns: 'ui' }));
        await new Promise((resolve) => setTimeout(resolve, TOAST_BEFORE_RELOAD_MS));
        if (cancelled) return;

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
