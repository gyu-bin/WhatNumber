import { useMemo, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
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
 * 탭바 위 고정 배너. Expo Go / 로드 실패 시 공간을 차지하지 않습니다.
 */
export function AdBanner({ colors }: { colors: ThemeColors }) {
  const ads = useMemo(() => loadAdsModule(), []);
  const [visible, setVisible] = useState(true);

  if (!ads || !visible) return null;

  const { BannerAd, BannerAdSize, TestIds } = ads;
  const unitId = getBannerUnitId(TestIds.BANNER);

  return (
    <View
      style={[styles.wrap, { backgroundColor: colors.surface, borderTopColor: colors.border }]}
      accessibilityLabel="광고"
    >
      <BannerAd
        unitId={unitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        onAdFailedToLoad={() => setVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    // Android에서 배너 높이 예약 없이 로드 전 깜빡임을 줄입니다.
    minHeight: Platform.OS === 'ios' ? 50 : 0,
    overflow: 'hidden',
  },
});
