import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import i18n from '../i18n';
import { getBannerUnitId, isExpoGo } from '../services/ads/config';
import type { ThemeColors } from '../theme';

type AdsModule = typeof import('react-native-google-mobile-ads');

let cachedAds: AdsModule | null | undefined;

function loadAdsModule(): AdsModule | null {
  if (cachedAds !== undefined) return cachedAds;
  if (isExpoGo()) {
    cachedAds = null;
    return null;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    cachedAds = require('react-native-google-mobile-ads') as AdsModule;
  } catch {
    cachedAds = null;
  }
  return cachedAds;
}

/**
 * 탭바 위 인라인 배너.
 * ANCHORED_ADAPTIVE는 화면 맨 아래에 붙으려 해서 탭바와 겹칠 수 있어
 * 일반 BANNER를 씁니다.
 */
const MAX_AD_ATTEMPTS = 4;
const AD_RETRY_MS = 20_000;

export function AdBanner({ colors }: { colors: ThemeColors }) {
  const ads = useMemo(() => loadAdsModule(), []);
  const [requestKey, setRequestKey] = useState(0);
  const [visible, setVisible] = useState(true);
  const retries = useRef(0);
  const hasLoaded = useRef(false);
  const retryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (retryTimer.current) clearTimeout(retryTimer.current);
    };
  }, []);

  if (!ads || !visible) return null;

  const { BannerAd, BannerAdSize, TestIds } = ads;
  const unitId = getBannerUnitId(TestIds.BANNER);

  return (
    <View
      style={[styles.wrap, { backgroundColor: colors.surface, borderTopColor: colors.border }]}
      accessibilityLabel={i18n.t('common.ad', { ns: 'ui' })}
    >
      <BannerAd
        key={requestKey}
        unitId={unitId}
        size={BannerAdSize.BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: false }}
        onAdLoaded={() => {
          hasLoaded.current = true;
        }}
        onAdFailedToLoad={() => {
          if (hasLoaded.current) return;
          if (retries.current >= MAX_AD_ATTEMPTS - 1) {
            setVisible(false);
            return;
          }
          retries.current += 1;
          if (retryTimer.current) clearTimeout(retryTimer.current);
          retryTimer.current = setTimeout(() => setRequestKey((key) => key + 1), AD_RETRY_MS);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    minHeight: 50,
    overflow: 'hidden',
  },
});
