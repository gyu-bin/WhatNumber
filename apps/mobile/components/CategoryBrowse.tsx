import type { ComponentProps } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Category } from '@whatnumber/shared';
import type { AppStyles } from '../styles';
import type { ThemeColors } from '../theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

/** Home tile label → existing Category (no new DB categories). */
export const HOME_CATEGORY_TILES: {
  label: string;
  category: Category;
  icon: IconName;
  accent: string;
  subtitle: string;
}[] = [
  {
    label: '교통/차량',
    category: '교통/차량',
    icon: 'car',
    accent: '#3B6FD4',
    subtitle: '사고 · 고장 · 교통정보',
  },
  {
    label: '금융/카드',
    category: '법률/금융',
    icon: 'card',
    accent: '#0D9488',
    subtitle: '분실 · 사기 · 금융상담',
  },
  {
    label: '집·주거',
    category: '주거/생활',
    icon: 'home',
    accent: '#E85D4C',
    subtitle: '전월세 · 주거복지',
  },
  {
    label: '가족/복지',
    category: '가족/복지',
    icon: 'people',
    accent: '#F59E0B',
    subtitle: '아동 · 청소년 · 노인 · 마음건강',
  },
  {
    label: '생활/민원',
    category: '민원/행정',
    icon: 'document-text',
    accent: '#8B5CF6',
    subtitle: '행정 · 세금 · 민원안내',
  },
  {
    label: '고용/노동',
    category: '고용/노동',
    icon: 'briefcase',
    accent: '#A16207',
    subtitle: '실업급여 · 노동상담',
  },
  {
    label: '통신/디지털',
    category: '통신/디지털',
    icon: 'wifi',
    accent: '#2563EB',
    subtitle: '해킹 · 스팸 · 통신서비스',
  },
  {
    label: '기타',
    category: '긴급/안전',
    icon: 'ellipsis-horizontal',
    accent: '#A78BFA',
    subtitle: '응급 · 신고 · 해외 상담',
  },
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
  return (
    <View style={styles.categoryBrowse}>
      <View style={styles.categoryBrowseSectionHeader}>
        <Text style={styles.categoryBrowseSectionTitle}>분야별 찾기</Text>
      </View>

      <View style={styles.categoryGrid}>
        {HOME_CATEGORY_TILES.map((tile) => (
          <Pressable
            key={tile.label}
            style={styles.categoryTile}
            onPress={() => onOpenCategory(tile.category, tile.label)}
            accessibilityRole="button"
            accessibilityLabel={`${tile.label} 번호 보기`}
          >
            <View style={[styles.categoryTileIconWrap, { backgroundColor: `${tile.accent}1F` }]}>
              <Ionicons name={tile.icon} size={20} color={tile.accent} />
            </View>
            <View style={styles.categoryTileText}>
              <Text style={styles.categoryTileTitle}>{tile.label}</Text>
              <Text style={styles.categoryTileSubtitle} numberOfLines={2}>
                {tile.subtitle}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color={colors.textTertiary} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}
