import { FlatList, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import type { Category, NumberItem } from '@whatnumber/shared';
import { NumberRow } from '../components/NumberCards';
import type { AppStyles } from '../styles';
import type { ThemeColors } from '../theme';

export function CategoryScreen({
  category,
  title,
  subtitle,
  items,
  styles,
  colors,
  isFavorite,
  onToggleFavorite,
  onOpen,
  onBack,
}: {
  category: Category;
  title?: string;
  subtitle?: string;
  items: NumberItem[];
  styles: AppStyles;
  colors: ThemeColors;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  onOpen: (item: NumberItem) => void;
  onBack: () => void;
}) {
  const { t } = useTranslation();
  return (
    <View style={styles.categoryScreen}>
      <View style={styles.categoryScreenTopBar}>
        <Pressable
          onPress={onBack}
          style={styles.categoryScreenBack}
          accessibilityRole="button"
          accessibilityLabel={t('categoryScreen.backHome')}
        >
          <Ionicons name="chevron-back" size={23} color={colors.textPrimary} />
        </Pressable>
        <View style={styles.categoryScreenTitleWrap}>
          <Text style={styles.categoryScreenTitle} numberOfLines={1}>
            {title ?? category}
          </Text>
          {subtitle ? (
            <Text style={styles.categoryScreenSubtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        <View style={styles.categoryScreenBack} />
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.categoryScreenList}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item, index }) => (
          <View
            style={[
              styles.sectionItem,
              index === 0 && styles.sectionItemFirst,
              index === items.length - 1 && styles.sectionItemLast,
            ]}
          >
            <NumberRow
              item={item}
              isFavorite={isFavorite(item.id)}
              onToggleFavorite={onToggleFavorite}
              onOpen={onOpen}
              styles={styles}
            />
            {index < items.length - 1 ? <View style={styles.cardDivider} /> : null}
          </View>
        )}
      />
    </View>
  );
}
