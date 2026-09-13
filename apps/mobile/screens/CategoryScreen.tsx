import { FlatList, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Category, NumberItem } from '@whatnumber/shared';
import { NumberGridCard, NumberRow } from '../components/NumberCards';
import type { AppStyles } from '../styles';
import type { ThemeColors } from '../theme';
import type { ViewMode } from '../theme';

type CardRow = {
  id: string;
  left: NumberItem;
  right?: NumberItem;
};

function chunkToRows(items: NumberItem[]): CardRow[] {
  const rows: CardRow[] = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push({
      id: `row-${items[i].id}`,
      left: items[i],
      right: items[i + 1],
    });
  }
  return rows;
}

export function CategoryScreen({
  category,
  subtitle,
  items,
  viewMode,
  styles,
  colors,
  isFavorite,
  onToggleFavorite,
  onOpen,
  onBack,
}: {
  category: Category;
  subtitle?: string;
  items: NumberItem[];
  viewMode: ViewMode;
  styles: AppStyles;
  colors: ThemeColors;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  onOpen: (item: NumberItem) => void;
  onBack: () => void;
}) {
  const rows = chunkToRows(items);

  return (
    <View style={styles.categoryScreen}>
      <View style={styles.categoryScreenTopBar}>
        <Pressable
          onPress={onBack}
          style={styles.categoryScreenBack}
          accessibilityRole="button"
          accessibilityLabel="홈으로 돌아가기"
        >
          <Ionicons name="chevron-back" size={23} color={colors.textPrimary} />
        </Pressable>
        <View style={styles.categoryScreenTitleWrap}>
          <Text style={styles.categoryScreenTitle} numberOfLines={1}>
            {category}
          </Text>
          {subtitle ? (
            <Text style={styles.categoryScreenSubtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        <View style={styles.categoryScreenBack} />
      </View>

      {viewMode === 'card' ? (
        <FlatList
          data={rows}
          keyExtractor={(row) => row.id}
          contentContainerStyle={styles.categoryScreenList}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item: row }) => (
            <View style={styles.gridRow}>
              <View style={styles.gridCell}>
                <NumberGridCard
                  item={row.left}
                  isFavorite={isFavorite(row.left.id)}
                  onToggleFavorite={onToggleFavorite}
                  onOpen={onOpen}
                  styles={styles}
                />
              </View>
              <View style={styles.gridCell}>
                {row.right ? (
                  <NumberGridCard
                    item={row.right}
                    isFavorite={isFavorite(row.right.id)}
                    onToggleFavorite={onToggleFavorite}
                    onOpen={onOpen}
                    styles={styles}
                  />
                ) : (
                  <View style={styles.gridCellSpacer} />
                )}
              </View>
            </View>
          )}
        />
      ) : (
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
      )}
    </View>
  );
}
