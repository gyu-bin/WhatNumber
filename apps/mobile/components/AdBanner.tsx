import { useMemo, useState } from 'react';
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
export function AdBanner({ colors }: { colors: ThemeColors }) {
  const ads = useMemo(() => loadAdsModule(), []);
  const [visible, setVisible] = useState(true);

  if (!ads || !visible) return null;

  const { BannerAd, BannerAdSize, TestIds } = ads;
  const unitId = getBannerUnitId(TestIds.BANNER);

  return (
    <View
      style={[styles.wrap, { backgroundColor: colors.surface, borderTopColor: colors.border }]}
      accessibilityLabel={i18n.t('common.ad', { ns: 'ui' })}
    >
      <BannerAd
        unitId={unitId}
        size={BannerAdSize.BANNER}
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
    minHeight: 50,
    overflow: 'hidden',
  },
});
