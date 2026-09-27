import type { AppLocale } from '../../i18n/types';

export type FavoriteWidgetItem = {
  icon: string;
  title: string;
  num: string;
  tel: string;
};

/** Web / fallback — no native widget. */
export function syncFavoritesWidget(
  _favoriteIds: string[],
  _locale?: AppLocale,
): void {
  // no-op
}

export function registerFavoritesWidgetLayout(): void {
  // no-op
}

export function ensureWidgetSyncOnForeground(
  _getFavorites: () => string[],
  _getLocale: () => AppLocale | undefined,
): void {
  // no-op
}
