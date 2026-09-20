import type { ComponentProps } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import type { Category } from '@whatnumber/shared';
import type { AppStyles } from '../styles';
import type { ThemeColors } from '../theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

export type CategoryTileId =
  | 'traffic'
  | 'finance'
  | 'housing'
  | 'family'
  | 'civic'
  | 'labor'
  | 'digital'
  | 'other';

/** Home tile id → existing Category (no new DB categories). */
export const HOME_CATEGORY_TILES: {
  id: CategoryTileId;
  category: Category;
  icon: IconName;
  accent: string;
}[] = [
  { id: 'traffic', category: '교통/차량', icon: 'car', accent: '#3B6FD4' },
  { id: 'finance', category: '법률/금융', icon: 'card', accent: '#0D9488' },
  { id: 'housing', category: '주거/생활', icon: 'home', accent: '#E85D4C' },
  { id: 'family', category: '가족/복지', icon: 'people', accent: '#F59E0B' },
  { id: 'civic', category: '민원/행정', icon: 'document-text', accent: '#8B5CF6' },
  { id: 'labor', category: '고용/노동', icon: 'briefcase', accent: '#A16207' },
  { id: 'digital', category: '통신/디지털', icon: 'wifi', accent: '#2563EB' },
  { id: 'other', category: '긴급/안전', icon: 'ellipsis-horizontal', accent: '#A78BFA' },
];

export function CategoryBrowse({
  styles,
  colors,
  onOpenCategory,
}: {
  styles: AppStyles;
  colors: ThemeColors;
  onOpenCategory: (category: Category, label: string) => void;
}) {
  const { t } = useTranslation();

  return (
    <View style={styles.categoryBrowse}>
      <View style={styles.categoryBrowseSectionHeader}>
        <Text style={styles.categoryBrowseSectionTitle}>{t('home.categoriesTitle')}</Text>
      </View>
      <View style={styles.categoryGrid}>
        {HOME_CATEGORY_TILES.map((tile) => {
          const label = t(`categoryTiles.${tile.id}.label`);
          return (
            <Pressable
              key={tile.id}
              style={styles.categoryTile}
              onPress={() => onOpenCategory(tile.category, label)}
              accessibilityRole="button"
              accessibilityLabel={label}
            >
              <View
                style={[styles.categoryTileIconWrap, { backgroundColor: `${tile.accent}1A` }]}
              >
                <Ionicons name={tile.icon} size={20} color={tile.accent} />
              </View>
              <View style={styles.categoryTileText}>
                <Text style={styles.categoryTileTitle}>{label}</Text>
                <Text style={styles.categoryTileSubtitle}>
                  {t(`categoryTiles.${tile.id}.subtitle`)}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
