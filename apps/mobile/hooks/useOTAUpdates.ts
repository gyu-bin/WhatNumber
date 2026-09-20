import { useEffect, useRef } from 'react';
import * as Updates from 'expo-updates';
import i18n from '../i18n';

/**
 * Store builds already run native `CheckOnLaunch: ALWAYS`.
 * Calling check/fetch/reload from JS during that startup race crashes iOS
 * release builds and triggers expo-updates rollback (expo/expo#21347).
 *
 * - Never call reloadAsync — next cold start applies the download
 * - Wait until native startup finishes before any JS Updates API
 * - Toast when a downloaded update is pending
 */
export function useOTAUpdates(onUpdateReady?: (message: string) => void) {
  const onUpdateReadyRef = useRef(onUpdateReady);
  onUpdateReadyRef.current = onUpdateReady;
  const notifiedRef = useRef(false);
  const fetchStartedRef = useRef(false);
  const fallbackStartedRef = useRef(false);

  const {
    isUpdatePending,
    isUpdateAvailable,
    isStartupProcedureRunning,
  } = Updates.useUpdates();

  useEffect(() => {
    if (__DEV__ || !Updates.isEnabled) return;
    if (!isUpdatePending || notifiedRef.current) return;
    notifiedRef.current = true;
    onUpdateReadyRef.current?.(
      i18n.t('ota.restartToApply', {
        ns: 'ui',
        defaultValue: '업데이트를 준비했어요. 앱을 종료한 뒤 다시 열어주세요.',
      }),
    );
  }, [isUpdatePending]);

  // After native startup: finish a download native already discovered.
  useEffect(() => {
    if (__DEV__ || !Updates.isEnabled) return;
    if (isStartupProcedureRunning) return;
    if (!isUpdateAvailable || isUpdatePending || fetchStartedRef.current) return;

    fetchStartedRef.current = true;
    void Updates.fetchUpdateAsync().catch(() => {
      fetchStartedRef.current = false;
    });
  }, [isStartupProcedureRunning, isUpdateAvailable, isUpdatePending]);

  // Late fallback if native boot check missed the update (e.g. offline at launch).
  useEffect(() => {
    if (__DEV__ || !Updates.isEnabled) return;
    if (isStartupProcedureRunning) return;
    if (isUpdatePending || isUpdateAvailable || fallbackStartedRef.current) return;

    const timer = setTimeout(() => {
      if (notifiedRef.current || fetchStartedRef.current || fallbackStartedRef.current) {
        return;
      }
      fallbackStartedRef.current = true;
      fetchStartedRef.current = true;
      void (async () => {
        try {
          const check = await Updates.checkForUpdateAsync();
          if (!check.isAvailable) return;
          await Updates.fetchUpdateAsync();
        } catch {
          fetchStartedRef.current = false;
          fallbackStartedRef.current = false;
        }
      })();
    }, 8_000);

    return () => clearTimeout(timer);
  }, [isStartupProcedureRunning, isUpdateAvailable, isUpdatePending]);
}
