import Constants, { ExecutionEnvironment } from 'expo-constants';
import { requireOptionalNativeModule } from 'expo-modules-core';
import { Platform } from 'react-native';

/** Guides must not advertise extensions absent from Expo Go or older binaries. */
export function isWidgetGuideAvailable(): boolean {
  if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient || Constants.appOwnership === 'expo') return false;
  if (Constants.expoConfig?.extra?.widgetGuidesEnabled === false) return false;
  try {
    if (Platform.OS === 'android') return Boolean(requireOptionalNativeModule('AndroidFavoriteWidget'));
    if (Platform.OS === 'ios') return Boolean(requireOptionalNativeModule('ExpoWidgets'));
  } catch {
    return false;
  }
  return false;
}
