import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import type { Category, NumberItem, OrganizationContact } from '@whatnumber/shared';
import { NumberRow } from '../components/NumberCards';
import type { AppStyles } from '../styles';
import type { ThemeColors } from '../theme';

type SubTabId = 'finance' | 'card' | 'traffic' | 'insurance';

function isOrgType(
  item: NumberItem,
  type: OrganizationContact['organizationType'],
): item is OrganizationContact {
  return (
    'organizationType' in item &&
    (item as OrganizationContact).organizationType === type
  );
}

function getSubTabs(category: Category): { id: SubTabId; labelKey: string }[] | null {
  if (category === '법률/금융') {
    return [
      { id: 'finance', labelKey: 'categoryScreen.financeTab' },
      { id: 'card', labelKey: 'categoryScreen.cardTab' },
    ];
  }
  if (category === '교통/차량') {
    return [
      { id: 'traffic', labelKey: 'categoryScreen.trafficTab' },
      { id: 'insurance', labelKey: 'categoryScreen.insuranceTab' },
    ];
  }
  return null;
}

function filterBySubTab(items: NumberItem[], tab: SubTabId): NumberItem[] {
  switch (tab) {
    case 'card':
      return items.filter((item) => isOrgType(item, 'card'));
    case 'finance':
      return items.filter((item) => !isOrgType(item, 'card'));
    case 'insurance':
      return items.filter((item) => isOrgType(item, 'insurance'));
    case 'traffic':
      return items.filter((item) => !isOrgType(item, 'insurance'));
    default:
      return items;
  }
}

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
  const subTabs = getSubTabs(category);
  const [subTab, setSubTab] = useState<SubTabId>(
    category === '교통/차량' ? 'traffic' : 'finance',
  );

  useEffect(() => {
    setSubTab(category === '교통/차량' ? 'traffic' : 'finance');
  }, [category]);

  const activeTab = subTabs?.some((tab) => tab.id === subTab)
    ? subTab
    : (subTabs?.[0]?.id ?? 'finance');

  const visibleItems = useMemo(() => {
    if (!subTabs) return items;
    return filterBySubTab(items, activeTab);
  }, [activeTab, items, subTabs]);

  const showOrgLogoNote = activeTab === 'card' || activeTab === 'insurance';
  const logoNoteKey =
    activeTab === 'insurance'
      ? 'categoryScreen.insuranceLogoNote'
      : 'categoryScreen.cardLogoNote';

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

      {subTabs ? (
        <View style={styles.categorySubTabs}>
          {subTabs.map((tab) => {
            const active = activeTab === tab.id;
            const label = t(tab.labelKey);
            return (
              <Pressable
                key={tab.id}
                style={[styles.categorySubTab, active && styles.categorySubTabActive]}
                onPress={() => setSubTab(tab.id)}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                accessibilityLabel={label}
              >
                <Text
                  style={[
                    styles.categorySubTabLabel,
                    active && styles.categorySubTabLabelActive,
                  ]}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}

      <FlatList
        data={visibleItems}
        keyExtractor={(item) => item.id}
        extraData={activeTab}
        contentContainerStyle={styles.categoryScreenList}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          showOrgLogoNote ? (
            <Text style={styles.categoryCardLogoNote}>{t(logoNoteKey)}</Text>
          ) : null
        }
        renderItem={({ item, index }) => (
          <View
            style={[
              styles.sectionItem,
              index === 0 && styles.sectionItemFirst,
              index === visibleItems.length - 1 && styles.sectionItemLast,
            ]}
          >
            <NumberRow
              item={item}
              isFavorite={isFavorite(item.id)}
              onToggleFavorite={onToggleFavorite}
              onOpen={onOpen}
              styles={styles}
            />
            {index < visibleItems.length - 1 ? <View style={styles.cardDivider} /> : null}
          </View>
        )}
      />
    </View>
  );
}
