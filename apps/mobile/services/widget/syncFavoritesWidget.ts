import { AppState, Platform } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { ALL_NUMBERS, telWidgetHref } from '@whatnumber/shared';
import { localizeNumber } from '../../i18n';
import type { AppLocale } from '../../i18n/types';

const MAX_ITEMS = 6;

export type FavoriteWidgetItem = {
  icon: string;
  title: string;
  num: string;
  tel: string;
};

type FavoritesWidgetApi = {
  updateSnapshot: (props: {
    items: FavoriteWidgetItem[];
    locale?: AppLocale;
  }) => void;
  reload: () => void;
};

function canSyncWidget(): boolean {
  if (Platform.OS !== 'ios' && Platform.OS !== 'android') return false;
  if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) {
    return false;
  }
  if (Constants.appOwnership === 'expo') return false;
  return true;
}

function loadWidget(): FavoritesWidgetApi | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const FavoritesWidget = require('../../widgets/FavoritesWidget')
      .default as FavoritesWidgetApi;
    if (!FavoritesWidget?.updateSnapshot) return null;
    return FavoritesWidget;
  } catch {
    return null;
  }
}

function reloadAllWidgetsNative(): void {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const ExpoWidgets = require('expo-widgets/build/ExpoWidgets').default as {
      reloadAllWidgets?: () => void;
    };
    ExpoWidgets?.reloadAllWidgets?.();
  } catch {
    /* optional */
  }
}

/**
 * Re-register layout + push snapshot.
 * createWidget() (module load) writes `__expo_widgets_FavoritesWidget_layout`
 * into the App Group — required after an OTA that changed the widget source.
 */
export function syncFavoritesWidget(
  favoriteIds: string[],
  locale?: AppLocale,
): void {
  if (!canSyncWidget()) return;

  try {
    const FavoritesWidget = loadWidget();
    if (!FavoritesWidget) return;

    const items: FavoriteWidgetItem[] = [];
    for (const id of favoriteIds) {
      if (items.length >= MAX_ITEMS) break;
      const number = ALL_NUMBERS.find((entry) => entry.id === id);
      if (!number) continue;
      const localized = localizeNumber(number, locale);
      items.push({
        icon: localized.icon || '📞',
        title: localized.title,
        num: number.num,
        tel: telWidgetHref(number.num),
      });
    }

    FavoritesWidget.updateSnapshot({ items, locale: locale ?? 'ko' });
    FavoritesWidget.reload?.();
    reloadAllWidgetsNative();
  } catch {
    // Native widget missing (e.g. outdated binary) — ignore.
  }
}

/** Call once at app boot so layout is rewritten even before favorites hydrate. */
export function registerFavoritesWidgetLayout(): void {
  if (!canSyncWidget()) return;
  loadWidget();
}

let appStateHooked = false;
let favoritesRef: () => string[] = () => [];
let localeRef: () => AppLocale | undefined = () => undefined;

/** Re-sync whenever the app becomes active (covers OTA → next foreground). */
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
