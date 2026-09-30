import type { AppLocale } from '../../i18n/types';
import type { NumberItem } from '@whatnumber/shared';

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
  _customNumbers: NumberItem[] = [],
): void {
  // no-op
}

export function registerFavoritesWidgetLayout(): void {
  // no-op
}

export function ensureWidgetSyncOnForeground(
  _getFavorites: () => string[],
  _getLocale: () => AppLocale | undefined,
  _getCustomNumbers: () => NumberItem[] = () => [],
): void {
  // no-op
}
