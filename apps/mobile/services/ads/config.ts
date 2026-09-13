import { Platform } from 'react-native';
import Constants from 'expo-constants';

/** AdMob 앱 ID (네이티브 빌드용 — app.config 플러그인과 동일 값) */
export const ADMOB_ANDROID_APP_ID = 'ca-app-pub-2202662035854210~2403134140';
export const ADMOB_IOS_APP_ID = 'ca-app-pub-2202662035854210~3472673239';

const ANDROID_BANNER_UNIT_ID =
  process.env.EXPO_PUBLIC_ADMOB_ANDROID_BANNER_ID?.trim() ||
  'ca-app-pub-2202662035854210/5907264884';
const IOS_BANNER_UNIT_ID =
  process.env.EXPO_PUBLIC_ADMOB_IOS_BANNER_ID?.trim() ||
  'ca-app-pub-2202662035854210/4594183213';

export function isExpoGo(): boolean {
  return Constants.appOwnership === 'expo';
}

export function getBannerUnitId(testBannerId: string): string {
  if (__DEV__) return testBannerId;
  return Platform.OS === 'ios' ? IOS_BANNER_UNIT_ID : ANDROID_BANNER_UNIT_ID;
}
