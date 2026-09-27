import { requireNativeModule } from 'expo-modules-core';

export type AndroidFavoriteWidgetSnapshotItem = {
  id: string;
  title: string;
  phone: string;
  category: string;
};

type AndroidFavoriteWidgetNativeModule = {
  syncFavorites: (json: string) => void;
};

let cached: AndroidFavoriteWidgetNativeModule | null | undefined;

function getNativeModule(): AndroidFavoriteWidgetNativeModule | null {
  if (cached !== undefined) return cached;
  try {
    cached = requireNativeModule<AndroidFavoriteWidgetNativeModule>('AndroidFavoriteWidget');
  } catch {
    cached = null;
  }
  return cached;
}

/** Persist favorite snapshot to SharedPreferences and refresh all widget instances. */
export function syncAndroidFavoriteWidget(
  items: AndroidFavoriteWidgetSnapshotItem[],
): void {
  const native = getNativeModule();
  if (!native) return;
  try {
    native.syncFavorites(JSON.stringify(items));
  } catch {
    // Native module missing in Expo Go / outdated binary.
  }
}
