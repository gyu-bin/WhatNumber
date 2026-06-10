import { useMemo, useState } from 'react';
import {
  Linking,
  Modal,
  Pressable,
  ScrollView,
  SectionList,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  CAT_COLOR,
  CATEGORIES,
  NUMBERS,
  SITUATION_ACCENT,
  SITUATION_TIPS,
  type Category,
  type NumberItem,
  type Situation,
  iconBgColor,
  matchesSearch,
  telHref,
} from '@whatnumber/shared';
import { ThemeToggle } from './components/ThemeToggle';
import { NumberRequest } from './components/NumberRequest';
import { useFavorites } from './hooks/useFavorites';
import { useTheme } from './hooks/useTheme';
import { createStyles, type AppStyles } from './styles';
import { getThemeColors } from './theme';

const SITUATIONS: { id: Situation; icon: string; label: string }[] = [
  { id: 'emergency', icon: '🚑', label: '갑자기 아파요' },
  { id: 'car', icon: '🚗', label: '차가 고장났어요' },
  { id: 'crime', icon: '🚨', label: '사기·범죄 피해' },
  { id: 'home', icon: '🏠', label: '집 관련 문제' },
  { id: 'abroad', icon: '✈️', label: '해외에 있어요' },
  { id: 'legal', icon: '⚖️', label: '법률·금융 문제' },
];

const CATEGORY_ORDER: Category[] = [
  '긴급/안전',
  '교통/차량',
  '주거/생활',
  '법률/금융',
  '가족/복지',
  '고용/노동',
  '민원/행정',
];

const CATEGORY_CHIPS = [
  CATEGORIES[0],
  { id: 'favorites', label: '즐겨찾기' },
  ...CATEGORIES.slice(1),
];

type ListSection = {
  key: string;
  title: string;
  titleColor?: string;
  isFavorites?: boolean;
  data: NumberItem[];
};

function NumberRow({
  item,
  isFavorite,
  onToggleFavorite,
  onOpen,
  styles,
}: {
  item: NumberItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpen: (item: NumberItem) => void;
  styles: AppStyles;
}) {
  return (
    <Pressable style={styles.card} onPress={() => onOpen(item)}>
      <View style={[styles.iconWrap, { backgroundColor: iconBgColor(item.cat) }]}>
        <Text style={styles.icon}>{item.icon}</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDesc} numberOfLines={2}>
          {item.desc}
        </Text>
      </View>
      <View style={styles.cardActions}>
        <Pressable
          onPress={() => onToggleFavorite(item.id)}
          hitSlop={8}
          accessibilityLabel={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
        >
          <Text style={[styles.favorite, isFavorite && styles.favoriteActive]}>
            {isFavorite ? '★' : '☆'}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => void Linking.openURL(telHref(item.num))}
          style={styles.callBtn}
        >
          <Text style={styles.callText}>{item.num}</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

function DetailSheet({
  item,
  isFavorite,
  onClose,
  onToggleFavorite,
  styles,
}: {
  item: NumberItem;
  isFavorite: boolean;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  styles: AppStyles;
}) {
  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />
          <View style={styles.sheetHeader}>
            <View style={[styles.iconWrap, { backgroundColor: iconBgColor(item.cat) }]}>
              <Text style={styles.iconLg}>{item.icon}</Text>
            </View>
            <View style={styles.sheetHeaderText}>
              <Text style={styles.sheetTitle}>{item.title}</Text>
              <Text style={styles.sheetDesc}>{item.desc}</Text>
            </View>
          </View>

          {item.tip ? (
            <View style={styles.tipBox}>
              <Text style={styles.tipText}>💡 {item.tip}</Text>
            </View>
          ) : null}

          <View style={styles.sheetActions}>
            <Pressable
              style={styles.secondaryBtn}
              onPress={() => onToggleFavorite(item.id)}
            >
              <Text style={styles.secondaryBtnText}>
                {isFavorite ? '★ 즐겨찾기 해제' : '☆ 즐겨찾기 추가'}
              </Text>
            </Pressable>
            <Pressable
              style={styles.primaryBtn}
              onPress={() => void Linking.openURL(telHref(item.num))}
            >
              <Text style={styles.primaryBtnText}>{item.num} 전화</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default function App() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSituation, setActiveSituation] = useState<Situation | null>(null);
  const [selected, setSelected] = useState<NumberItem | null>(null);
  const { favorites, toggle, isFavorite } = useFavorites();
  const { theme, toggle: toggleTheme, ready: themeReady } = useTheme();

  const themeColors = getThemeColors(theme);
  const styles = useMemo(() => createStyles(themeColors), [theme]);

  const isSearching = query.trim().length > 0;

  const filtered = useMemo(() => {
    if (isSearching) {
      return NUMBERS.filter((n) => matchesSearch(n, query));
    }
    if (activeSituation) {
      return NUMBERS.filter((n) => n.situation.includes(activeSituation));
    }
    if (activeCategory === 'favorites') {
      return favorites
        .map((id) => NUMBERS.find((n) => n.id === id))
        .filter((n): n is NumberItem => n !== undefined);
    }
    if (activeCategory !== 'all') {
      return NUMBERS.filter((n) => n.cat === activeCategory);
    }
    return NUMBERS;
  }, [query, isSearching, activeSituation, activeCategory, favorites]);

  const groupByCategory =
    !isSearching && !activeSituation && activeCategory === 'all';
  const isFavoritesView = activeCategory === 'favorites' && !isSearching;

  const sections = useMemo((): ListSection[] => {
    if (filtered.length === 0) return [];

    if (groupByCategory) {
      return CATEGORY_ORDER.map((cat) => ({
        key: cat,
        title: cat,
        titleColor: CAT_COLOR[cat],
        data: filtered.filter((n) => n.cat === cat),
      })).filter((section) => section.data.length > 0);
    }

    if (isFavoritesView) {
      return [
        {
          key: 'favorites',
          title: `내 즐겨찾기 · ${filtered.length}개`,
          isFavorites: true,
          data: filtered,
        },
      ];
    }

    return [{ key: 'list', title: '', data: filtered }];
  }, [filtered, groupByCategory, isFavoritesView]);

  const listHeader = (
    <View style={styles.listHeader}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.logo}>몇번이야</Text>
          <Text style={styles.subtitle}>진짜 쓸 일 생기는 번호 모음</Text>
        </View>
        <ThemeToggle theme={theme} colors={themeColors} onToggle={toggleTheme} />
      </View>

      <NumberRequest styles={styles} colors={themeColors} />

      <TextInput
        style={styles.search}
        placeholder="번호·상황 검색"
        placeholderTextColor={themeColors.textTertiary}
        value={query}
        onChangeText={setQuery}
        clearButtonMode="while-editing"
      />

      {!isSearching && (
        <View style={[styles.filterPanel, isSearching && styles.filterDisabled]}>
          <Text style={styles.filterLabel}>지금 어떤 상황이에요?</Text>
          <View style={styles.situationGrid}>
            {SITUATIONS.map((sit) => {
              const isActive = activeSituation === sit.id;
              const accent = SITUATION_ACCENT[sit.id];
              return (
                <Pressable
                  key={sit.id}
                  style={[
                    styles.situationBtn,
                    isActive && {
                      borderColor: accent,
                      backgroundColor: `${accent}1A`,
                    },
                  ]}
                  onPress={() => {
                    const next = isActive ? null : sit.id;
                    setActiveSituation(next);
                    if (next) setActiveCategory('all');
                  }}
                >
                  <Text style={styles.situationIcon}>{sit.icon}</Text>
                  <Text style={styles.situationLabel}>{sit.label}</Text>
                </Pressable>
              );
            })}
          </View>
          {activeSituation ? (
            <View style={styles.tipBanner}>
              <Text style={styles.tipBannerText}>{SITUATION_TIPS[activeSituation]}</Text>
            </View>
          ) : null}
        </View>
      )}

      {!isSearching && (
        <View style={[styles.filterPanel, styles.categoryPanel]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {CATEGORY_CHIPS.map((chip) => {
              const isFavChip = chip.id === 'favorites';
              const isActive = activeCategory === chip.id && !activeSituation;
              const label = isFavChip
                ? favorites.length > 0
                  ? `⭐ ${favorites.length}`
                  : '⭐'
                : chip.label;

              return (
                <Pressable
                  key={chip.id}
                  style={[
                    styles.categoryChip,
                    isFavChip && styles.categoryChipFav,
                    isActive && styles.categoryChipActive,
                    isActive && isFavChip && styles.categoryChipFavActive,
                  ]}
                  onPress={() => {
                    setActiveCategory(chip.id);
                    if (chip.id !== 'all') setActiveSituation(null);
                  }}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      isActive && !isFavChip && styles.categoryChipTextActive,
                      isActive && isFavChip && styles.categoryChipFavTextActive,
                    ]}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );

  if (!themeReady) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />

        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          stickySectionHeadersEnabled={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              {isFavoritesView ? (
                <>
                  <Text style={styles.emptyIcon}>☆</Text>
                  <Text style={styles.emptyTitle}>아직 즐겨찾기가 없어요</Text>
                  <Text style={styles.emptyHint}>
                    자주 쓰는 번호 카드에서 ☆를 눌러 모아두세요
                  </Text>
                </>
              ) : (
                <Text style={styles.empty}>해당하는 번호가 없어요</Text>
              )}
            </View>
          }
          renderSectionHeader={({ section }) => {
            if (!section.title) return null;
            return (
              <View style={styles.sectionHeader}>
                {section.isFavorites ? (
                  <Text style={styles.favHeader}>
                    <Text style={styles.favHeaderStar}>★ </Text>
                    {section.title}
                  </Text>
                ) : (
                  <Text style={[styles.catHeader, { color: section.titleColor }]}>
                    {section.title}
                  </Text>
                )}
              </View>
            );
          }}
          renderItem={({ item, index, section }) => (
            <View
              style={[
                styles.sectionItem,
                !section.title && index === 0 && styles.sectionItemFirst,
                index === section.data.length - 1 && styles.sectionItemLast,
              ]}
            >
              <NumberRow
                item={item}
                isFavorite={isFavorite(item.id)}
                onToggleFavorite={toggle}
                onOpen={setSelected}
                styles={styles}
              />
              {index < section.data.length - 1 ? <View style={styles.cardDivider} /> : null}
            </View>
          )}
          SectionSeparatorComponent={() => <View style={styles.sectionGap} />}
        />

        {selected ? (
          <DetailSheet
            item={selected}
            isFavorite={isFavorite(selected.id)}
            onClose={() => setSelected(null)}
            onToggleFavorite={toggle}
            styles={styles}
          />
        ) : null}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
