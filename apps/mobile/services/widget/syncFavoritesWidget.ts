import { Platform } from 'react-native';
import { ALL_NUMBERS, telHref } from '@whatnumber/shared';
import type { FavoriteWidgetItem } from '../../widgets/FavoritesWidget';

const MAX_ITEMS = 4;

/**
 * 홈 화면 위젯에 즐겨찾기 목록을 반영합니다.
 * Expo Go / 미지원 환경에서는 조용히 무시합니다.
 */
export function syncFavoritesWidget(favoriteIds: string[]): void {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const FavoritesWidget = require('../../widgets/FavoritesWidget').default as {
      updateSnapshot: (props: { items: FavoriteWidgetItem[] }) => void;
    };

    const items: FavoriteWidgetItem[] = [];
    for (const id of favoriteIds) {
      if (items.length >= MAX_ITEMS) break;
      const number = ALL_NUMBERS.find((entry) => entry.id === id);
      if (!number) continue;
      items.push({
        title: number.title,
        num: number.num,
        tel: telHref(number.num),
      });
    }

    FavoritesWidget.updateSnapshot({ items });
  } catch (error) {
    if (__DEV__ && Platform.OS === 'ios') {
      console.warn('[FavoritesWidget] sync skipped', error);
    }
  }
}
