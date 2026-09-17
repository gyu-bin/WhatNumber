import { Platform } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { ALL_NUMBERS, telWidgetHref } from '@whatnumber/shared';

const MAX_ITEMS = 6;

export type FavoriteWidgetItem = {
  icon: string;
  title: string;
  num: string;
  tel: string;
};

function canSyncWidget(): boolean {
  if (Platform.OS !== 'ios' && Platform.OS !== 'android') return false;
  // Expo Go has no expo-widgets native module — skip before requiring it.
  if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) {
    return false;
  }
  if (Constants.appOwnership === 'expo') return false;
  return true;
}

/**
 * 홈 화면 위젯에 즐겨찾기 목록을 반영합니다.
 * Expo Go / 미지원 환경에서는 조용히 무시합니다.
 */
export function syncFavoritesWidget(favoriteIds: string[]): void {
  if (!canSyncWidget()) return;

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const FavoritesWidget = require('../../widgets/FavoritesWidget').default as {
      updateSnapshot: (props: { items: FavoriteWidgetItem[] }) => void;
    };

    if (!FavoritesWidget?.updateSnapshot) return;

    const items: FavoriteWidgetItem[] = [];
    for (const id of favoriteIds) {
      if (items.length >= MAX_ITEMS) break;
      const number = ALL_NUMBERS.find((entry) => entry.id === id);
      if (!number) continue;
      items.push({
        icon: number.icon || '📞',
        title: number.title,
        num: number.num,
        tel: telWidgetHref(number.num),
      });
    }

    FavoritesWidget.updateSnapshot({ items });
  } catch {
    // Native widget missing (e.g. outdated binary) — ignore.
  }
}
