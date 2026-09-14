import type { ConfigContext, ExpoConfig } from 'expo/config';

const APP_VERSION = '1.0.0';
const PRIVACY_POLICY_URL = 'https://whatnumber-mu.vercel.app/privacy';
const SUPPORT_URL = 'https://whatnumber-mu.vercel.app';
const EAS_PROJECT_ID = '890993d6-97dd-477a-833c-05a7531eb8c0';

/** 로컬 Expo Go에서는 OTA/코드사이닝을 꺼 rename ENOENT를 피합니다. EAS 빌드에서는 그대로 켭니다. */
const updatesEnabled = process.env.EXPO_NO_UPDATES !== '1';

const ADMOB_ANDROID_APP_ID =
  process.env.ADMOB_ANDROID_APP_ID?.trim() || 'ca-app-pub-2202662035854210~2403134140';
const ADMOB_IOS_APP_ID =
  process.env.ADMOB_IOS_APP_ID?.trim() || 'ca-app-pub-2202662035854210~3472673239';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: '몇번이야',
  slug: 'whatnumber',
  owner: 'rbqls6651',
  version: APP_VERSION,
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  scheme: 'whatnumber',
  description: '진짜 쓸 일 생기는 공공 전화번호 모음',
  runtimeVersion: {
    policy: 'appVersion',
  },
  updates: {
    url: `https://u.expo.dev/${EAS_PROJECT_ID}`,
    enabled: updatesEnabled,
    fallbackToCacheTimeout: 0,
    checkAutomatically: updatesEnabled ? 'ON_LOAD' : 'NEVER',
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'kr.whatnumber.app',
    buildNumber: '1',
    deploymentTarget: '16.4',
    infoPlist: {
      CFBundleAllowMixedLocalizations: true,
      ITSAppUsesNonExemptEncryption: false,
      LSApplicationQueriesSchemes: ['tel', 'mailto'],
    },
    privacyManifests: {
      NSPrivacyAccessedAPITypes: [
        {
          NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryUserDefaults',
          NSPrivacyAccessedAPITypeReasons: ['CA92.1'],
        },
      ],
    },
  },
  android: {
    package: 'kr.whatnumber.app',
    versionCode: 1,
    adaptiveIcon: {
      backgroundColor: '#FCFBFA',
      foregroundImage: './assets/android-icon-foreground.png',
      backgroundImage: './assets/android-icon-background.png',
      monochromeImage: './assets/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
    // 기본 전화/연락처 권한은 막고, 응급실 조회용 위치만 명시합니다.
    permissions: [
      'android.permission.ACCESS_COARSE_LOCATION',
      'android.permission.ACCESS_FINE_LOCATION',
      'com.google.android.gms.permission.AD_ID',
    ],
    blockedPermissions: [
      'android.permission.READ_PHONE_STATE',
      'android.permission.READ_CONTACTS',
    ],
  },
  web: {
    favicon: './assets/favicon.png',
  },
  plugins: [
    [
      'expo-splash-screen',
      {
        // 단색 배경만 (로고 없음). Expo Go는 설정과 무관하게 앱 아이콘을 잠깐 보여줄 수 있음.
        image: './assets/splash-icon.png',
        imageWidth: 1,
        resizeMode: 'contain',
        backgroundColor: '#FCFBFA',
      },
    ],
    [
      'expo-location',
      {
        locationWhenInUsePermission:
          '현재 위치 주변의 응급실을 찾을 때만 위치를 사용합니다.',
      },
    ],
    [
      'react-native-google-mobile-ads',
      {
        androidAppId: ADMOB_ANDROID_APP_ID,
        iosAppId: ADMOB_IOS_APP_ID,
      },
    ],
    [
      'expo-widgets',
      {
        bundleIdentifier: 'kr.whatnumber.app.widgets',
        groupIdentifier: 'group.kr.whatnumber.app',
        enableAndroid: true,
        widgets: [
          {
            name: 'FavoritesWidget',
            displayName: '즐겨찾기 전화',
            description: '즐겨찾기 번호를 탭하면 바로 전화할 수 있어요',
            contentMarginsDisabled: true,
            supportedFamilies: ['systemSmall', 'systemMedium', 'systemLarge'],
            android: {
              minWidth: 110,
              minHeight: 40,
              targetCellWidth: 2,
              targetCellHeight: 2,
              resizeMode: 'both',
            },
          },
        ],
      },
    ],
  ],
  // Expo Go / 런타임 스플래시와 플러그인 설정을 맞춤
  // @ts-expect-error Expo runtime still reads top-level splash; types dropped it
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#FCFBFA',
  },
  locales: {
    ko: './locales/ko.json',
  },
  extra: {
    privacyPolicyUrl: PRIVACY_POLICY_URL,
    supportUrl: SUPPORT_URL,
    eas: {
      projectId: EAS_PROJECT_ID,
    },
  },
});
