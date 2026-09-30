import { AppState } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { getContactById, normalizeFavoriteIds } from '@whatnumber/shared';
import { localizeNumber } from '../../i18n';
import type { AppLocale } from '../../i18n/types';
import { requiresRegionalDialing } from '../../utils/regionalDialing';
import {
  syncAndroidFavoriteWidget,
  type AndroidFavoriteWidgetSnapshotItem,
} from '../../modules/android-favorite-widget/src';

const MAX_ITEMS = 6;

export type FavoriteWidgetItem = {
  icon: string;
  title: string;
  num: string;
  tel: string;
};

function canSyncWidget(): boolean {
  if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) {
    return false;
  }
  if (Constants.appOwnership === 'expo') return false;
  return true;
}

/**
 * Push current favorites to the native Android App Widget snapshot.
 * Call only after favorites hydration (`ready === true`) to avoid wiping
 * an existing SharedPreferences snapshot with [].
 */
export function syncFavoritesWidget(
  favoriteIds: string[],
  locale?: AppLocale,
): void {
  if (!canSyncWidget()) return;

  try {
    const items: AndroidFavoriteWidgetSnapshotItem[] = [];
    for (const id of normalizeFavoriteIds(favoriteIds)) {
      if (items.length >= MAX_ITEMS) break;
      const number = getContactById(id);
      // A widget cannot ask for an area code; never dial an ambiguous short code.
      if (!number || requiresRegionalDialing(number.num)) continue;
      const localized = localizeNumber(number, locale);
      items.push({
        id: number.id,
        title: localized.title,
        phone: number.num,
        category: number.cat,
      });
    }

    syncAndroidFavoriteWidget(items);
  } catch {
    // Native widget missing (e.g. outdated binary) — ignore.
  }
}

/** No-op on Android — layout lives in native resources. */
export function registerFavoritesWidgetLayout(): void {
  // intentionally empty
}

let appStateHooked = false;
let favoritesRef: () => string[] = () => [];
let localeRef: () => AppLocale | undefined = () => undefined;

/** Re-sync whenever the app becomes active. */
export function ensureWidgetSyncOnForeground(
  getFavorites: () => string[],
  getLocale: () => AppLocale | undefined,
): void {
  favoritesRef = getFavorites;
  localeRef = getLocale;
  if (appStateHooked || !canSyncWidget()) return;
  appStateHooked = true;
  AppState.addEventListener('change', (state) => {
    if (state !== 'active') return;
    syncFavoritesWidget(favoritesRef(), localeRef());
  });
}
