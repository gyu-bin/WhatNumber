import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Image,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  SectionList,
  StyleSheet,
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
import { useTranslation } from 'react-i18next';
import {
  ALL_NUMBERS,
  type Category,
  type NumberItem,
  type Situation,
  searchNumbers,
  telHref,
} from '@whatnumber/shared';
import { NumberRequestModal } from './components/NumberRequest';
import { AdBanner } from './components/AdBanner';
import { CategoryBrowse } from './components/CategoryBrowse';
import { EmergencyFinderCard } from './components/EmergencyFinderCard';
import { ImmediateEmergency } from './components/ImmediateEmergency';
import { NumberRow } from './components/NumberCards';
import { NumberVisualIcon } from './components/NumberVisualIcon';
import { SplashAnimation } from './components/SplashAnimation';
import { Toast } from './components/Toast';
import { useAdMobInit } from './hooks/useAdMobInit';
import { useFavorites } from './hooks/useFavorites';
import { useOTAUpdates } from './hooks/useOTAUpdates';
import { useLocale } from './hooks/useLocale';
import { useTheme } from './hooks/useTheme';
import { localizeNumberDetail, localizeNumbers } from './i18n';
import { CategoryScreen } from './screens/CategoryScreen';
import { MoreScreen } from './screens/MoreScreen';
import { PrivacyScreen } from './screens/PrivacyScreen';
import { EmergencyFinderScreen } from './screens/EmergencyFinderScreen';
import { syncFavoritesWidget, registerFavoritesWidgetLayout, ensureWidgetSyncOnForeground } from './services/widget/syncFavoritesWidget';
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

const PRIMARY_SITUATIONS: { id: Situation; icon: string }[] = [
  { id: 'emergency', icon: '🚑' },
  { id: 'car', icon: '🚗' },
  { id: 'crime', icon: '🛡' },
  { id: 'home', icon: '🏠' },
];

const MORE_SITUATIONS: { id: Situation; icon: string }[] = [
  { id: 'abroad', icon: '✈️' },
  { id: 'legal', icon: '⚖️' },
];

type ListSection = {
  key: string;
  title: string;
  isFavorites?: boolean;
  collapsible?: boolean;
  collapsed?: boolean;
  data: NumberItem[];
};

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
  const { t } = useTranslation();
  const detail = localizeNumberDetail(item.id) ?? [];

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
              <NumberVisualIcon item={item} size={52} />
              <View style={styles.sheetHeaderText}>
                <Text style={styles.sheetCat}>{t(`categories.${item.cat}`)}</Text>
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
                {isFavorite ? t('detail.removeFavorite') : t('detail.addFavorite')}
              </Text>
            </Pressable>
            <Pressable
              style={styles.primaryBtn}
              onPress={() => void Linking.openURL(telHref(item.num))}
            >
              <Text style={styles.primaryBtnText}>{t('detail.call', { num: item.num })}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
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
  const { t } = useTranslation();
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
        accessibilityLabel={t('tabs.home')}
      >
        <Ionicons
          name={homeActive ? 'home' : 'home-outline'}
          size={20}
          color={homeActive ? colors.accent : colors.textTertiary}
        />
        <Text style={[styles.tabLabel, homeActive && styles.tabLabelActive]}>{t('tabs.home')}</Text>
      </Pressable>
      <Pressable
        style={[styles.tabItem, settingsActive && styles.tabItemActive]}
        onPress={() => onChange('settings')}
        accessibilityRole="tab"
        accessibilityState={{ selected: settingsActive }}
        accessibilityLabel={t('tabs.settings')}
      >
        <Ionicons
          name={settingsActive ? 'settings' : 'settings-outline'}
          size={20}
          color={settingsActive ? colors.accent : colors.textTertiary}
        />
        <Text style={[styles.tabLabel, settingsActive && styles.tabLabelActive]}>
          {t('tabs.settings')}
        </Text>
      </Pressable>
    </View>
  );
}

export default function App() {
  const { t } = useTranslation();
  const { locale, setLocale } = useLocale();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  useOTAUpdates(setToastMessage);
  useAdMobInit();
  const [tab, setTab] = useState<TabId>('home');
  const [settingsView, setSettingsView] = useState<SettingsView>('main');
  const [homeView, setHomeView] = useState<HomeView>('numbers');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedCategoryLabel, setSelectedCategoryLabel] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [activeSituation, setActiveSituation] = useState<Situation | null>(null);
  const [situationMoreOpen, setSituationMoreOpen] = useState(false);
  const [selected, setSelected] = useState<NumberItem | null>(null);
  const [requestOpen, setRequestOpen] = useState(false);
  const [requestMode, setRequestMode] = useState<'number' | 'feedback'>('number');
  /** Cold start only — never re-shown on background → foreground */
  const [showSplash, setShowSplash] = useState(true);
  const [nativeSplashHidden, setNativeSplashHidden] = useState(false);
  const { favorites, toggle, reorder, isFavorite, ready: favoritesReady } = useFavorites();
  const { theme, toggle: toggleTheme, ready: themeReady } = useTheme();

  const localizedNumbers = useMemo(
    () => localizeNumbers(ALL_NUMBERS, locale),
    [locale],
  );

  const fireItem = useMemo(
    () => localizedNumbers.find((n) => n.id === 'e2')!,
    [localizedNumbers],
  );
  const policeItem = useMemo(
    () => localizedNumbers.find((n) => n.id === 'e3')!,
    [localizedNumbers],
  );

  useEffect(() => {
    registerFavoritesWidgetLayout();
  }, []);

  useEffect(() => {
    if (!favoritesReady) return;
    syncFavoritesWidget(favorites, locale);
    ensureWidgetSyncOnForeground(
      () => favorites,
      () => locale,
    );
  }, [favorites, favoritesReady, locale]);

  const themeColors = getThemeColors(theme);
  const styles = useMemo(() => createStyles(themeColors), [theme]);

  // Home stays fully visible under the splash overlay.
  // Animating root opacity with the native driver was sticking at 0 after
  // background → foreground on iOS (white screen).
  const onSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);
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
      return searchNumbers(localizedNumbers, query);
    }
    if (activeSituation) {
      return localizedNumbers.filter((n) => n.situation.includes(activeSituation));
    }
    if (showFavorites) {
      return favorites
        .map((id) => localizedNumbers.find((n) => n.id === id))
        .filter((n): n is NumberItem => n !== undefined);
    }
    return localizedNumbers;
  }, [query, isSearching, activeSituation, showFavorites, favorites, localizedNumbers]);

  const groupByCategory = !isSearching && !activeSituation && !showFavorites;
  const isBrowseHome = groupByCategory;
  const isFavoritesView = showFavorites && !isSearching && !activeSituation;

  const openCategory = useCallback((category: Category, label?: string) => {
    setSelectedCategory(category);
    setSelectedCategoryLabel(label ?? null);
    setHomeView('category');
  }, []);

  const isMoreSituationActive = MORE_SITUATIONS.some((sit) => sit.id === activeSituation);

  const sections = useMemo((): ListSection[] => {
    if (filtered.length === 0) return [];

    if (isFavoritesView) {
      return [
        {
          key: 'favorites',
          title: t('home.favoritesHeader', { count: filtered.length }),
          isFavorites: true,
          data: filtered,
        },
      ];
    }

    return [{ key: 'list', title: '', data: filtered }];
  }, [filtered, isFavoritesView, t]);

  const listHeader = (
    <View style={styles.listHeader}>
      <View style={styles.homeHero}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Image
            source={require('./assets/brand/header-label-light.png')}
            style={styles.logoWordmark}
            resizeMode="contain"
            accessibilityLabel={t('settings.metaBrand')}
            accessibilityIgnoresInvertColors
          />
          <Text style={styles.headerSubtitle}>{t('home.subtitle')}</Text>
        </View>
      </View>

      <View style={styles.searchShell}>
        <Ionicons name="search-outline" size={23} color={themeColors.textTertiary} />
        <TextInput
          style={styles.search}
          placeholder={t('home.searchPlaceholder')}
          placeholderTextColor={themeColors.textTertiary}
          value={query}
          onChangeText={setQuery}
          clearButtonMode="while-editing"
          accessibilityLabel={t('home.searchA11y')}
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
              accessibilityLabel={t('home.favoritesA11y')}
              accessibilityState={{ selected: showFavorites && !activeSituation }}
            >
              <Text
                style={[
                  styles.situationChipText,
                  styles.situationChipFavTextActive,
                ]}
              >
                {favorites.length > 0
                  ? `★ ${t('home.favoritesWithCount', { count: favorites.length })}`
                  : `★ ${t('home.favorites')}`}
              </Text>
            </Pressable>

            {PRIMARY_SITUATIONS.map((sit) => {
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
                    {t(`situations.${sit.id}`)}
                  </Text>
                </Pressable>
              );
            })}

            <Pressable
              style={[
                styles.situationChip,
                isMoreSituationActive && styles.situationChipActive,
              ]}
              onPress={() => setSituationMoreOpen(true)}
              accessibilityLabel={t('home.situationMoreA11y')}
              accessibilityState={{ selected: isMoreSituationActive }}
            >
              <Text style={styles.situationIcon}>•••</Text>
              <Text
                style={[
                  styles.situationChipText,
                  isMoreSituationActive && styles.situationChipTextActive,
                ]}
              >
                {t('home.moreSituations')}
              </Text>
            </Pressable>
          </ScrollView>

          {activeSituation ? (
            <View style={styles.tipBanner}>
              <Text style={styles.tipBannerText}>{t(`situationTips.${activeSituation}`)}</Text>
            </View>
          ) : null}
        </View>
      )}
      </View>
    </View>
  );

  const emptyComponent = (
    <View style={styles.emptyWrap}>
      {isFavoritesView ? (
        <>
          <Text style={styles.emptyIcon}>☆</Text>
          <Text style={styles.emptyTitle}>{t('home.favoritesEmptyTitle')}</Text>
          <Text style={styles.emptyHint}>{t('home.favoritesEmptyBody')}</Text>
        </>
      ) : (
        <Text style={styles.empty}>{t('home.empty')}</Text>
      )}
    </View>
  );

  const listExtraData = favorites.join(',');

  const browseHome = (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.listContent}
    >
      {listHeader}
      <EmergencyFinderCard
        styles={styles}
        colors={themeColors}
        onPress={() => setHomeView('emergency-finder')}
      />
      <ImmediateEmergency
        fireItem={fireItem}
        policeItem={policeItem}
        styles={styles}
        colors={themeColors}
        onOpen={setSelected}
      />
      <CategoryBrowse
        styles={styles}
        colors={themeColors}
        onOpenCategory={openCategory}
      />
    </ScrollView>
  );

  const showHomeNumbers = tab === 'home' && homeView === 'numbers';
  const showBrowse = showHomeNumbers && isBrowseHome;
  const showFavoritesList = showHomeNumbers && isFavoritesView;
  const showFilteredList = showHomeNumbers && !isBrowseHome && !isFavoritesView;
  const showCategory = tab === 'home' && homeView === 'category' && selectedCategory;
  const showEmergencyFinder = tab === 'home' && homeView === 'emergency-finder';
  const showSettings = tab === 'settings';

  const favoritesHeader = (
    <View>
      {listHeader}
      <View style={styles.sectionHeader}>
        <Text style={styles.favHeader}>
          <Text style={styles.favHeaderStar}>★ </Text>
          {t('home.favoritesHeader', { count: filtered.length })}
        </Text>
      </View>
      {filtered.length > 1 ? (
        <Text style={styles.favReorderHint}>{t('home.favoritesReorderHint')}</Text>
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

  if (!themeReady) {
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
        <View
          style={{ flex: 1 }}
          pointerEvents={showSplash ? 'none' : 'auto'}
        >
          <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />

            <View style={styles.main}>
              {/* Browse Home은 언마운트하지 않아 탭/카테고리 왕복 시 스크롤 유지 */}
              {isBrowseHome ? (
                <View
                  style={
                    showBrowse
                      ? { flex: 1 }
                      : [StyleSheet.absoluteFill, { opacity: 0, zIndex: 0 }]
                  }
                  pointerEvents={showBrowse ? 'auto' : 'none'}
                  importantForAccessibility={showBrowse ? 'yes' : 'no-hide-descendants'}
                >
                  {browseHome}
                </View>
              ) : null}

              {showEmergencyFinder ? (
                <EmergencyFinderScreen
                  colors={themeColors}
                  onBack={() => setHomeView('numbers')}
                />
              ) : null}

              {showCategory ? (
                <CategoryScreen
                  category={selectedCategory}
                  title={selectedCategoryLabel ?? t(`categories.${selectedCategory}`)}
                  subtitle={t(`categorySubtitles.${selectedCategory}`)}
                  items={localizedNumbers.filter((item) => item.cat === selectedCategory)}
                  styles={styles}
                  colors={themeColors}
                  isFavorite={isFavorite}
                  onToggleFavorite={toggle}
                  onOpen={setSelected}
                  onBack={() => {
                    setHomeView('numbers');
                    setSelectedCategory(null);
                    setSelectedCategoryLabel(null);
                  }}
                />
              ) : null}

              {showFavoritesList ? (
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
              ) : null}

              {showFilteredList ? (
                <SectionList
                  sections={sections}
                  keyExtractor={(item) => item.id}
                  extraData={listExtraData}
                  stickySectionHeadersEnabled={false}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={styles.listContent}
                  ListHeaderComponent={listHeader}
                  ListEmptyComponent={emptyComponent}
                  renderItem={({ item, index, section }) => (
                    <View
                      style={[
                        styles.sectionItem,
                        index === 0 && styles.sectionItemFirst,
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
              ) : null}

              {showSettings ? (
                settingsView === 'privacy' ? (
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
                    locale={locale}
                    onChangeLocale={setLocale}
                    onChangeTheme={(next) => {
                      if (next !== theme) toggleTheme();
                    }}
                    onOpenRequest={() => {
                      setRequestMode('number');
                      setRequestOpen(true);
                    }}
                    onOpenFeedback={() => {
                      setRequestMode('feedback');
                      setRequestOpen(true);
                    }}
                    onOpenPrivacy={() => setSettingsView('privacy')}
                  />
                )
              ) : null}
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
                  setSelectedCategoryLabel(null);
                }
              }}
              styles={styles}
              colors={themeColors}
            />

            <NumberRequestModal
              visible={requestOpen}
              mode={requestMode}
              onClose={() => setRequestOpen(false)}
              onSuccess={(message) => setToastMessage(message)}
              styles={styles}
              colors={themeColors}
            />

            <Toast
              message={toastMessage}
              visible={Boolean(toastMessage)}
              styles={styles}
              onHide={() => setToastMessage(null)}
              durationMs={4000}
            />

            <Modal
              visible={situationMoreOpen}
              transparent
              animationType="slide"
              onRequestClose={() => setSituationMoreOpen(false)}
            >
              <View style={styles.requestOverlay}>
                <Pressable
                  style={styles.requestBackdrop}
                  onPress={() => setSituationMoreOpen(false)}
                />
                <View style={styles.situationMoreSheet}>
                  <View style={styles.situationMoreHandle} />
                  <Text style={styles.situationMoreTitle}>{t('home.situationMoreTitle')}</Text>
                  {MORE_SITUATIONS.map((sit) => {
                    const isActive = activeSituation === sit.id;
                    return (
                      <Pressable
                        key={sit.id}
                        style={styles.situationMoreRow}
                        onPress={() => {
                          setActiveSituation(isActive ? null : sit.id);
                          if (!isActive) setShowFavorites(false);
                          setSituationMoreOpen(false);
                        }}
                        accessibilityState={{ selected: isActive }}
                      >
                        <Text style={styles.situationIcon}>{sit.icon}</Text>
                        <Text style={styles.situationMoreRowText}>
                          {t(`situations.${sit.id}`)}
                        </Text>
                        {isActive ? (
                          <Ionicons name="checkmark" size={18} color={themeColors.accent} />
                        ) : null}
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </Modal>

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
        </View>

        {showSplash ? (
          <SplashAnimation
            theme={theme}
            active={nativeSplashHidden && themeReady}
            onFinish={onSplashFinish}
          />
        ) : null}
      </View>
    </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
