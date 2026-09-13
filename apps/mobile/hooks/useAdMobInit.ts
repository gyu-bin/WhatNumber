import { useEffect } from 'react';
import { isExpoGo } from '../services/ads/config';

/**
 * Production / Dev Client에서만 AdMob SDK를 초기화합니다.
 * Expo Go에는 네이티브 모듈이 없어 no-op 합니다.
 */
export function useAdMobInit() {
  useEffect(() => {
    if (isExpoGo()) return;

    let cancelled = false;

    const run = async () => {
      try {
        const mobileAds = (await import('react-native-google-mobile-ads')).default;
        if (cancelled) return;
        await mobileAds().initialize();
      } catch {
        // Expo Go / 미빌드 환경에서는 무시
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, []);
}
