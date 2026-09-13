import type { ComponentProps } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Category, NumberItem } from '@whatnumber/shared';
import type { AppStyles } from '../styles';
import type { ThemeColors } from '../theme';
import { NumberGridCard } from './NumberCards';

type IconName = ComponentProps<typeof Ionicons>['name'];

export const BROWSE_CATEGORIES = [
  '교통/차량',
  '법률/금융',
  '주거/생활',
  '가족/복지',
  '민원/행정',
  '고용/노동',
] as const satisfies readonly Category[];

const CATEGORY_TILE: Record<(typeof BROWSE_CATEGORIES)[number], { icon: IconName; subtitle: string }> =
  {
    '교통/차량': { icon: 'car-outline', subtitle: '사고·고장·교통정보' },
    '법률/금융': { icon: 'card-outline', subtitle: '금융·카드·법률 상담' },
    '주거/생활': { icon: 'home-outline', subtitle: '가스·전기·주거 문제' },
    '가족/복지': { icon: 'people-outline', subtitle: '가족·복지·상담' },
    '민원/행정': { icon: 'document-text-outline', subtitle: '민원·행정 안내' },
    '고용/노동': { icon: 'briefcase-outline', subtitle: '고용·노동 상담' },
  };

export function CategoryBrowse({
  emergencyItems,
  styles,
  colors,
  isFavorite,
  onToggleFavorite,
  onOpenItem,
  onOpenCategory,
}: {
  emergencyItems: NumberItem[];
  styles: AppStyles;
  colors: ThemeColors;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  onOpenItem: (item: NumberItem) => void;
  onOpenCategory: (category: Category) => void;
}) {
  const left = emergencyItems[0];
  const right = emergencyItems[1];

  return (
    <View style={styles.categoryBrowse}>
      <View style={styles.categoryBrowseSectionHeader}>
        <Text style={styles.categoryBrowseSectionTitle}>긴급/안전</Text>
        <Pressable
          onPress={() => onOpenCategory('긴급/안전')}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="긴급/안전 전체보기"
        >
          <Text style={styles.categoryBrowseMore}>전체보기 ›</Text>
        </Pressable>
      </View>

      <View style={styles.gridRow}>
        <View style={styles.gridCell}>
          {left ? (
            <NumberGridCard
              item={left}
              isFavorite={isFavorite(left.id)}
              onToggleFavorite={onToggleFavorite}
              onOpen={onOpenItem}
              styles={styles}
            />
          ) : null}
        </View>
        <View style={styles.gridCell}>
          {right ? (
            <NumberGridCard
              item={right}
              isFavorite={isFavorite(right.id)}
              onToggleFavorite={onToggleFavorite}
              onOpen={onOpenItem}
              styles={styles}
            />
          ) : (
            <View style={styles.gridCellSpacer} />
          )}
        </View>
      </View>

      <View style={[styles.categoryBrowseSectionHeader, styles.categoryBrowseSectionHeaderSpaced]}>
        <Text style={styles.categoryBrowseSectionTitle}>분야별 찾기</Text>
      </View>

      <View style={styles.categoryGrid}>
        {BROWSE_CATEGORIES.map((category) => {
          const tile = CATEGORY_TILE[category];
          return (
            <Pressable
              key={category}
              style={styles.categoryTile}
              onPress={() => onOpenCategory(category)}
              accessibilityRole="button"
              accessibilityLabel={`${category} 번호 보기`}
            >
              <Ionicons name={tile.icon} size={20} color={colors.textPrimary} />
              <View style={styles.categoryTileText}>
                <Text style={styles.categoryTileTitle}>{category}</Text>
                <Text style={styles.categoryTileSubtitle} numberOfLines={2}>
                  {tile.subtitle}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={14} color={colors.textTertiary} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
