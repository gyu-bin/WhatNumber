import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
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
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DraggableFlatList, {
  ScaleDecorator,
  type RenderItemParams,
} from 'react-native-draggable-flatlist';
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
  ALL_NUMBERS,
  SITUATION_TIPS,
  getNumberDetail,
  type Category,
  type NumberItem,
  type Situation,
  iconBgColor,
  searchNumbers,
  telHref,
} from '@whatnumber/shared';
import { NumberRequestModal } from './components/NumberRequest';
import { AdBanner } from './components/AdBanner';
import { EmergencyFinderCard } from './components/EmergencyFinderCard';
import { NumberGridCard, NumberRow } from './components/NumberCards';
import { SplashAnimation } from './components/SplashAnimation';
import { ViewModeToggle } from './components/ViewModeToggle';
import { useAdMobInit } from './hooks/useAdMobInit';
import { useFavorites } from './hooks/useFavorites';
import { useOTAUpdates } from './hooks/useOTAUpdates';
import { useTheme } from './hooks/useTheme';
import { useViewMode } from './hooks/useViewMode';
import { CategoryScreen } from './screens/CategoryScreen';
import { MoreScreen } from './screens/MoreScreen';
import { PrivacyScreen } from './screens/PrivacyScreen';
import { EmergencyFinderScreen } from './screens/EmergencyFinderScreen';
import { syncFavoritesWidget } from './services/widget/syncFavoritesWidget';
import { createStyles, type AppStyles } from './styles';
import { getThemeColors, type ThemeColors } from './theme';
import { Ionicons } from '@expo/vector-icons';

void SplashScreen.preventAutoHideAsync().catch(() => {
  /* already hidden / unavailable */
});

const SPLASH_BG_LIGHT = '#FCFBFA';
const SPLASH_BG_DARK = '#171717';

type TabId = 'home' | 'settings';
type SettingsView = 'main' | 'privacy';
type HomeView = 'numbers' | 'emergency-finder' | 'category';

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

const CATEGORY_SUBTITLES: Partial<Record<Category, string>> = {
  '긴급/안전': '지금 바로 도움이 필요한 순간',
  '교통/차량': '이동 중에도 든든하게',
  '주거/생활': '매일의 생활 문제를 빠르게',
  '법률/금융': '권리와 재산을 지키는 번호',
  '가족/복지': '가족과 이웃을 위한 도움',
  '고용/노동': '일하는 사람을 위한 안내',
  '민원/행정': '공공 서비스가 필요할 때',
};

type ListSection = {
  key: string;
  title: string;
  isFavorites?: boolean;
  collapsible?: boolean;
  collapsed?: boolean;
  data: NumberItem[];
};

type CardRow = {
  id: string;
  left: NumberItem;
  right?: NumberItem;
};

type CardSection = {
  key: string;
  title: string;
  isFavorites?: boolean;
  collapsible?: boolean;
  collapsed?: boolean;
  data: CardRow[];
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
  const detail = getNumberDetail(item.id);

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />
          <ScrollView
            style={styles.sheetScroll}
            contentContainerStyle={styles.sheetScrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={styles.sheetHeader}>
              <View style={[styles.iconWrap, { backgroundColor: iconBgColor(item.cat) }]}>
                <Text style={styles.iconLg}>{item.icon}</Text>
              </View>
              <View style={styles.sheetHeaderText}>
                <Text style={styles.sheetCat}>{item.cat}</Text>
                <Text style={styles.sheetTitle}>{item.title}</Text>
                <Text style={styles.sheetDesc}>{item.desc}</Text>
              </View>
            </View>

            <Text style={styles.sheetNumber}>{item.num}</Text>

            {detail.map((paragraph) => (
              <Text key={paragraph.slice(0, 40)} style={styles.sheetDetail}>
                {paragraph}
              </Text>
            ))}

            {item.tip ? (
              <View style={styles.tipBox}>
                <Text style={styles.tipText}>💡 {item.tip}</Text>
              </View>
            ) : null}
          </ScrollView>

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

function CategoryHeader({
  section,
  styles,
  cardMode,
  onToggle,
}: {
  section: {
    key: string;
    title: string;
    isFavorites?: boolean;
    collapsible?: boolean;
    collapsed?: boolean;
  };
  styles: AppStyles;
  cardMode?: boolean;
  onToggle: (key: string) => void;
}) {
  if (!section.title) return null;

  const titleNode = section.isFavorites ? (
    <Text style={styles.favHeader}>
      <Text style={styles.favHeaderStar}>★ </Text>
      {section.title}
    </Text>
  ) : (
    <View>
      <Text style={styles.catHeader}>{section.title}</Text>
      {CATEGORY_SUBTITLES[section.title as Category] ? (
        <Text style={styles.catSubtitle}>{CATEGORY_SUBTITLES[section.title as Category]}</Text>
      ) : null}
    </View>
  );

  const content = (
    <>
      {titleNode}
      {section.collapsible ? (
        <Ionicons
          name={section.collapsed ? 'chevron-down' : 'chevron-up'}
          size={18}
          color={styles.sectionChevron.color}
        />
      ) : null}
    </>
  );

  const headerStyle = cardMode ? styles.cardModeHeader : styles.sectionHeader;
  if (!section.collapsible) return <View style={headerStyle}>{titleNode}</View>;

  return (
    <View style={headerStyle}>
      <Pressable
        style={cardMode ? styles.cardModeHeaderPressable : styles.sectionHeaderPressable}
        onPress={() => onToggle(section.key)}
        accessibilityRole="button"
        accessibilityLabel={`${section.title} ${section.collapsed ? '펼치기' : '접기'}`}
        accessibilityState={{ expanded: !section.collapsed }}
      >
        {content}
      </Pressable>
    </View>
  );
}

function TabBar({
  active,
  onChange,
  styles,
  colors,
}: {
  active: TabId;
  onChange: (tab: TabId) => void;
  styles: AppStyles;
  colors: ThemeColors;
}) {
  const insets = useSafeAreaInsets();
  const homeActive = active === 'home';
  const settingsActive = active === 'settings';

  return (
    <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 6) }]}>
      <Pressable
        style={[styles.tabItem, homeActive && styles.tabItemActive]}
        onPress={() => onChange('home')}
        accessibilityRole="tab"
        accessibilityState={{ selected: homeActive }}
        accessibilityLabel="홈"
      >
        <Ionicons
          name={homeActive ? 'home' : 'home-outline'}
          size={20}
          color={homeActive ? colors.accent : colors.textTertiary}
        />
        <Text style={[styles.tabLabel, homeActive && styles.tabLabelActive]}>홈</Text>
      </Pressable>
      <Pressable
        style={[styles.tabItem, settingsActive && styles.tabItemActive]}
        onPress={() => onChange('settings')}
        accessibilityRole="tab"
        accessibilityState={{ selected: settingsActive }}
        accessibilityLabel="설정"
      >
        <Ionicons
          name={settingsActive ? 'settings' : 'settings-outline'}
          size={20}
          color={settingsActive ? colors.accent : colors.textTertiary}
        />
        <Text style={[styles.tabLabel, settingsActive && styles.tabLabelActive]}>설정</Text>
      </Pressable>
    </View>
  );
}

export default function App() {
  useOTAUpdates();
  useAdMobInit();
  const [tab, setTab] = useState<TabId>('home');
  const [settingsView, setSettingsView] = useState<SettingsView>('main');
  const [homeView, setHomeView] = useState<HomeView>('numbers');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [query, setQuery] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [activeSituation, setActiveSituation] = useState<Situation | null>(null);
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const [selected, setSelected] = useState<NumberItem | null>(null);
  const [requestOpen, setRequestOpen] = useState(false);
  /** Cold start only — never re-shown on background → foreground */
  const [showSplash, setShowSplash] = useState(true);
  const [nativeSplashHidden, setNativeSplashHidden] = useState(false);
  const { favorites, toggle, reorder, isFavorite, ready: favoritesReady } = useFavorites();
  const { theme, toggle: toggleTheme, ready: themeReady } = useTheme();
  const { viewMode, setViewMode, ready: viewModeReady } = useViewMode();

  useEffect(() => {
    if (!favoritesReady) return;
    syncFavoritesWidget(favorites);
  }, [favorites, favoritesReady]);

  const themeColors = getThemeColors(theme);
  const styles = useMemo(() => createStyles(themeColors), [theme]);

  const homeOpacity = useRef(new Animated.Value(0)).current;
  const homeTY = useRef(new Animated.Value(8)).current;

  const onSplashTransitionStart = useCallback(() => {
    Animated.parallel([
      Animated.timing(homeOpacity, {
        toValue: 1,
        duration: 250,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(homeTY, {
        toValue: 0,
        duration: 250,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [homeOpacity, homeTY]);

  const onSplashFinish = useCallback(() => {
    homeOpacity.setValue(1);
    homeTY.setValue(0);
    setShowSplash(false);
  }, [homeOpacity, homeTY]);

  useEffect(() => {
    if (nativeSplashHidden) return;
    let cancelled = false;
    // Expo Go는 native splash 대신 앱 아이콘을 보여줌 → 최대한 빨리 숨기고 커스텀 스플래시로 덮음
    try {
      SplashScreen.setOptions({ duration: 0, fade: false });
    } catch {
      /* older runtime */
    }
    const id = requestAnimationFrame(() => {
      SplashScreen.hideAsync()
        .catch(() => undefined)
        .finally(() => {
          if (!cancelled) setNativeSplashHidden(true);
        });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
    };
  }, [nativeSplashHidden]);

  const isSearching = query.trim().length > 0;

  const filtered = useMemo(() => {
    if (isSearching) {
      return searchNumbers(ALL_NUMBERS, query);
    }
    if (activeSituation) {
      return ALL_NUMBERS.filter((n) => n.situation.includes(activeSituation));
    }
    if (showFavorites) {
      return favorites
        .map((id) => ALL_NUMBERS.find((n) => n.id === id))
        .filter((n): n is NumberItem => n !== undefined);
    }
    return ALL_NUMBERS;
  }, [query, isSearching, activeSituation, showFavorites, favorites]);

  const groupByCategory = !isSearching && !activeSituation && !showFavorites;
  const isBrowseHome = groupByCategory;
  const isFavoritesView = showFavorites && !isSearching && !activeSituation;

  const openCategory = useCallback((category: Category) => {
    setSelectedCategory(category);
    setHomeView('category');
  }, []);

  const toggleCategory = useCallback((key: string) => {
    setCollapsedCategories((current) => ({ ...current, [key]: !current[key] }));
  }, []);

  const sections = useMemo((): ListSection[] => {
    if (filtered.length === 0) return [];

    if (isBrowseHome) {
      return CATEGORY_ORDER.flatMap((category) => {
        const categoryItems = filtered.filter((item) => item.cat === category);
        if (categoryItems.length === 0) return [];

        const collapsed = collapsedCategories[category] === true;
        return [
          {
            key: category,
            title: category,
            collapsible: true,
            collapsed,
            data: collapsed ? [] : categoryItems,
          },
        ];
      });
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
  }, [filtered, isBrowseHome, isFavoritesView, collapsedCategories]);

  const cardSections = useMemo((): CardSection[] => {
    return sections.map((section) => ({
      ...section,
      data: chunkToRows(section.data),
    }));
  }, [sections]);

  const listHeader = (
    <View style={styles.listHeader}>
      <View style={styles.homeHero}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Image
            source={require('./assets/brand/header-label-light.png')}
            style={styles.logoWordmark}
            resizeMode="contain"
            accessibilityLabel="몇번이야"
            accessibilityIgnoresInvertColors
          />
        </View>
        <ViewModeToggle mode={viewMode} colors={themeColors} onChange={setViewMode} />
      </View>

      <Text style={styles.headerSubtitle}>필요한 번호, 바로 찾아드릴게요.</Text>

      <View style={styles.searchShell}>
        <Ionicons name="search-outline" size={23} color={themeColors.textTertiary} />
        <TextInput
          style={styles.search}
          placeholder="번호나 상황을 검색해보세요"
          placeholderTextColor={themeColors.textTertiary}
          value={query}
          onChangeText={setQuery}
          clearButtonMode="while-editing"
          accessibilityLabel="번호 또는 상황 검색"
        />
      </View>

      {!isSearching && (
        <View style={styles.filterPanel}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.situationScroll}
          >
            <Pressable
              style={[
                styles.situationChip,
                styles.situationChipFav,
                showFavorites && !activeSituation && styles.situationChipFavActive,
              ]}
              onPress={() => {
                const next = !(showFavorites && !activeSituation);
                setShowFavorites(next);
                if (next) setActiveSituation(null);
              }}
              accessibilityLabel="즐겨찾기"
              accessibilityState={{ selected: showFavorites && !activeSituation }}
            >
              <Text
                style={[
                  styles.situationChipText,
                  styles.situationChipFavTextActive,
                ]}
              >
                {favorites.length > 0 ? `⭐ 즐겨찾기 ${favorites.length}` : '⭐ 즐겨찾기'}
              </Text>
            </Pressable>

            {SITUATIONS.map((sit) => {
              const isActive = activeSituation === sit.id;
              return (
                <Pressable
                  key={sit.id}
                  style={[styles.situationChip, isActive && styles.situationChipActive]}
                  onPress={() => {
                    const next = isActive ? null : sit.id;
                    setActiveSituation(next);
                    if (next) setShowFavorites(false);
                  }}
                  accessibilityState={{ selected: isActive }}
                >
                  <Text style={styles.situationIcon}>{sit.icon}</Text>
                  <Text
                    style={[
                      styles.situationChipText,
                      isActive && styles.situationChipTextActive,
                    ]}
                  >
                    {sit.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {activeSituation ? (
            <View style={styles.tipBanner}>
              <Text style={styles.tipBannerText}>{SITUATION_TIPS[activeSituation]}</Text>
            </View>
          ) : null}
        </View>
      )}
      </View>

      <EmergencyFinderCard
        styles={styles}
        colors={themeColors}
        onPress={() => setHomeView('emergency-finder')}
      />
    </View>
  );

  const emptyComponent = (
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
  );

  const listExtraData = `${favorites.join(',')}|${Object.keys(collapsedCategories)
    .filter((key) => collapsedCategories[key])
    .sort()
    .join(',')}`;

  const favoritesHeader = (
    <View>
      {listHeader}
      <View style={styles.sectionHeader}>
        <Text style={styles.favHeader}>
          <Text style={styles.favHeaderStar}>★ </Text>
          {`내 즐겨찾기 · ${filtered.length}개`}
        </Text>
      </View>
      {filtered.length > 1 ? (
        <Text style={styles.favReorderHint}>길게 눌러 순서를 바꿀 수 있어요</Text>
      ) : null}
    </View>
  );

  const renderFavoriteItem = useCallback(
    ({ item, drag, isActive, getIndex }: RenderItemParams<NumberItem>) => {
      const index = getIndex() ?? 0;
      const last = index === filtered.length - 1;
      return (
        <ScaleDecorator>
          <View
            style={[
              styles.sectionItem,
              index === 0 && styles.sectionItemFirst,
              last && styles.sectionItemLast,
            ]}
          >
            <NumberRow
              item={item}
              isFavorite={isFavorite(item.id)}
              onToggleFavorite={toggle}
              onOpen={setSelected}
              onDrag={drag}
              isActive={isActive}
              styles={styles}
            />
            {!last ? <View style={styles.cardDivider} /> : null}
          </View>
        </ScaleDecorator>
      );
    },
    [filtered.length, isFavorite, styles, toggle],
  );

  if (!themeReady || !viewModeReady) {
    // Expo Go 아이콘 splash를 가리기 위한 Warm White 덮개
    return (
      <SafeAreaProvider>
        <View
          style={{
            flex: 1,
            backgroundColor: theme === 'dark' ? SPLASH_BG_DARK : SPLASH_BG_LIGHT,
          }}
        />
      </SafeAreaProvider>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: themeColors.bg }}>
        <Animated.View
          style={{
            flex: 1,
            opacity: homeOpacity,
            transform: [{ translateY: homeTY }],
          }}
          pointerEvents={showSplash ? 'none' : 'auto'}
        >
          <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />

            <View style={styles.main}>
              {tab === 'home' ? (
                homeView === 'emergency-finder' ? (
                  <EmergencyFinderScreen
                    colors={themeColors}
                    onBack={() => setHomeView('numbers')}
                  />
                ) : homeView === 'category' && selectedCategory ? (
                  <CategoryScreen
                    category={selectedCategory}
                    subtitle={CATEGORY_SUBTITLES[selectedCategory]}
                    items={ALL_NUMBERS.filter((item) => item.cat === selectedCategory)}
                    viewMode={viewMode}
                    styles={styles}
                    colors={themeColors}
                    isFavorite={isFavorite}
                    onToggleFavorite={toggle}
                    onOpen={setSelected}
                    onBack={() => {
                      setHomeView('numbers');
                      setSelectedCategory(null);
                    }}
                  />
                ) : isFavoritesView ? (
                  <DraggableFlatList
                    data={filtered}
                    keyExtractor={(item) => item.id}
                    onDragEnd={({ data }) => reorder(data.map((entry) => entry.id))}
                    activationDistance={8}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.listContent}
                    ListHeaderComponent={favoritesHeader}
                    ListEmptyComponent={emptyComponent}
                    renderItem={renderFavoriteItem}
                  />
                ) : viewMode === 'card' ? (
                  <SectionList
                    sections={cardSections}
                    keyExtractor={(row) => row.id}
                    extraData={listExtraData}
                    stickySectionHeadersEnabled={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.listContent}
                    ListHeaderComponent={listHeader}
                    ListEmptyComponent={emptyComponent}
                    renderSectionHeader={({ section }) => (
                      <CategoryHeader
                        section={section}
                        styles={styles}
                        cardMode
                        onToggle={toggleCategory}
                      />
                    )}
                    renderItem={({ item: row }) => (
                      <View style={styles.gridRow}>
                        <View style={styles.gridCell}>
                          <NumberGridCard
                            item={row.left}
                            isFavorite={isFavorite(row.left.id)}
                            onToggleFavorite={toggle}
                            onOpen={setSelected}
                            styles={styles}
                          />
                        </View>
                        <View style={styles.gridCell}>
                          {row.right ? (
                            <NumberGridCard
                              item={row.right}
                              isFavorite={isFavorite(row.right.id)}
                              onToggleFavorite={toggle}
                              onOpen={setSelected}
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
                  <SectionList
                    sections={sections}
                    keyExtractor={(item) => item.id}
                    extraData={listExtraData}
                    stickySectionHeadersEnabled={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.listContent}
                    ListHeaderComponent={listHeader}
                    ListEmptyComponent={emptyComponent}
                    renderSectionHeader={({ section }) => (
                      <CategoryHeader
                        section={section}
                        styles={styles}
                        onToggle={toggleCategory}
                      />
                    )}
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
                        {index < section.data.length - 1 ? (
                          <View style={styles.cardDivider} />
                        ) : null}
                      </View>
                    )}
                  />
                )
              ) : settingsView === 'privacy' ? (
                <PrivacyScreen
                  styles={styles}
                  colors={themeColors}
                  onBack={() => setSettingsView('main')}
                />
              ) : (
                <MoreScreen
                  styles={styles}
                  colors={themeColors}
                  theme={theme}
                  onChangeTheme={(next) => {
                    if (next !== theme) toggleTheme();
                  }}
                  viewMode={viewMode}
                  onChangeViewMode={setViewMode}
                  onOpenRequest={() => setRequestOpen(true)}
                  onOpenPrivacy={() => setSettingsView('privacy')}
                />
              )}
            </View>

            {!(
              tab === 'home' &&
              (homeView === 'emergency-finder' || homeView === 'category')
            ) ? (
              <AdBanner colors={themeColors} />
            ) : null}

            <TabBar
              active={tab}
              onChange={(next) => {
                setTab(next);
                if (next !== 'settings') setSettingsView('main');
                if (next !== 'home') {
                  setHomeView('numbers');
                  setSelectedCategory(null);
                }
              }}
              styles={styles}
              colors={themeColors}
            />

            <NumberRequestModal
              visible={requestOpen}
              onClose={() => setRequestOpen(false)}
              styles={styles}
              colors={themeColors}
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
        </Animated.View>

        {showSplash ? (
          <SplashAnimation
            theme={theme}
            active={nativeSplashHidden && themeReady && viewModeReady}
            onTransitionStart={onSplashTransitionStart}
            onFinish={onSplashFinish}
          />
        ) : null}
      </View>
    </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
