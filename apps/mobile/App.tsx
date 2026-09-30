import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Image,
  Linking,
  BackHandler,
  Modal,
  Platform,
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
  telHref,
} from '@whatnumber/shared';
import { NumberRequestModal } from './components/NumberRequest';
import { AdBanner } from './components/AdBanner';
import { CategoryBrowse } from './components/CategoryBrowse';
import { SituationHome } from './components/home/SituationHome';
import { useHomeCopy } from './components/home/copy';
import { getSituationNumbers, getSeasonNumbers, SEASONAL_CONTACTS, type HomeSituationId } from './data/homeContent';
import { SavedNumberEditor } from './components/SavedNumberEditor';
import { searchHomeNumbers } from './services/homeSearch';
import { NumberRow } from './components/NumberCards';
import { NumberVisualIcon } from './components/NumberVisualIcon';
import { SplashAnimation } from './components/SplashAnimation';
import { Toast } from './components/Toast';
import { WidgetGuideBanner } from './components/WidgetGuide';
import { FirstLaunchGuide } from './components/guides/FirstLaunchGuide';
import { WidgetIntroSheet } from './components/guides/WidgetIntroSheet';
import { WidgetHowToSheet } from './components/guides/WidgetHowToSheet';
import { EmergencyLocationGuide } from './components/guides/EmergencyLocationGuide';
import { useGuides } from './hooks/useGuides';
import { isWidgetGuideAvailable } from './services/guides/widgetAvailability';
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
type HomeView = 'numbers' | 'emergency-finder' | 'category' | 'categories' | 'seasons';

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
  const insets = useSafeAreaInsets();
  const detail = localizeNumberDetail(item.id) ?? [];
  const sheetBottomPad = Math.max(insets.bottom, Platform.OS === 'android' ? 16 : 12);

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[styles.sheet, { paddingBottom: sheetBottomPad + 8 }]}
          onPress={(e) => e.stopPropagation()}
        >
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
  const bottomPad = Math.max(insets.bottom, Platform.OS === 'android' ? 16 : 6);

  return (
    <View style={[styles.tabBar, { paddingBottom: bottomPad }]}>
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
  const { locale, setLocale, ready: localeReady } = useLocale();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  /** Cold start only — never re-shown on background → foreground */
  const [showSplash, setShowSplash] = useState(true);
  useOTAUpdates(setToastMessage, !showSplash);
  useAdMobInit();
  const [tab, setTab] = useState<TabId>('home');
  const [settingsView, setSettingsView] = useState<SettingsView>('main');
  const [homeView, setHomeView] = useState<HomeView>('numbers');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedCategoryLabel, setSelectedCategoryLabel] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [activeSituation, setActiveSituation] = useState<HomeSituationId | null>(null);
  const [activeSeason, setActiveSeason] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [editor, setEditor] = useState<NumberItem | 'new' | null>(null);
  const homeCopy = useHomeCopy();
  const [selected, setSelected] = useState<NumberItem | null>(null);
  const [requestOpen, setRequestOpen] = useState(false);
  const [requestMode, setRequestMode] = useState<'number' | 'feedback'>('number');
  const [nativeSplashHidden, setNativeSplashHidden] = useState(false);
  const { favorites, customNumbers, saveCustom, removeCustom, storageAvailable, error: favoritesError, toggle, reorder, isFavorite, ready: favoritesReady } = useFavorites();
  const { theme, toggle: toggleTheme, ready: themeReady } = useTheme();
  const widgetAvailable = useMemo(isWidgetGuideAvailable, []);
  const enterEmergency = useCallback(() => setHomeView('emergency-finder'), []);
  const guides = useGuides(widgetAvailable, enterEmergency);
  const toggleFavorite = useCallback((id: string) => {
    if (!favoritesReady || !storageAvailable) return;
    void toggle(id).then((adding) => {
      if (adding && guides.favoriteAdded()) setSelected(null);
    }).catch(() => { /* useFavorites exposes the persistence error. */ });
  }, [favoritesReady, storageAvailable, toggle, guides.favoriteAdded]);

  const localizedNumbers = useMemo(
    () => [...localizeNumbers(ALL_NUMBERS, locale), ...customNumbers],
    [locale, customNumbers],
  );

  const savedItems = useMemo(() => favorites.map((id) => localizedNumbers.find((item) => item.id === id)).filter((item): item is NumberItem => Boolean(item)), [favorites, localizedNumbers]);

  useEffect(() => {
    registerFavoritesWidgetLayout();
  }, []);

  useEffect(() => {
    if (!favoritesReady || !storageAvailable) return;
    syncFavoritesWidget(favorites, locale, customNumbers);
    ensureWidgetSyncOnForeground(
      () => favorites,
      () => locale,
      () => customNumbers,
    );
  }, [favorites, favoritesReady, storageAvailable, locale, customNumbers]);

  const themeColors = getThemeColors(theme);
  const styles = useMemo(() => createStyles(themeColors), [theme]);

  // Home stays fully visible under the splash overlay.
  // Animating root opacity with the native driver was sticking at 0 after
  // background → foreground on iOS (white screen).
  const onSplashFinish = useCallback(() => {
    setShowSplash(false);
    guides.afterSplash();
  }, [guides.afterSplash]);
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
      return searchHomeNumbers(localizedNumbers, query, homeCopy.searchSuggestions);
    }
    if (activeSituation) {
      const ids = new Set(getSituationNumbers(activeSituation).map((n) => n.id));
      return localizedNumbers.filter((n) => ids.has(n.id));
    }
    if (activeSeason) {
      const ids = new Set(getSeasonNumbers(activeSeason).map((n) => n.id));
      return localizedNumbers.filter((n) => ids.has(n.id));
    }
    if (showFavorites) {
      return favorites
        .map((id) => localizedNumbers.find((n) => n.id === id))
        .filter((n): n is NumberItem => n !== undefined);
    }
    return searchOpen ? [] : localizedNumbers;
  }, [query, isSearching, activeSituation, activeSeason, searchOpen, showFavorites, favorites, localizedNumbers, homeCopy.searchSuggestions]);

  const groupByCategory = !searchOpen && !isSearching && !activeSituation && !activeSeason && !showFavorites;
  const isBrowseHome = groupByCategory;
  const isFavoritesView = showFavorites && !isSearching && !activeSituation && !activeSeason;

  const openCategory = useCallback((category: Category, label?: string) => {
    setSelectedCategory(category);
    setSelectedCategoryLabel(label ?? null);
    setHomeView('category');
  }, []);

  const resetHome = useCallback(() => {
    setQuery(''); setSearchOpen(false); setActiveSituation(null); setActiveSeason(null);
    setShowFavorites(false); setHomeView('numbers'); setSelectedCategory(null);
  }, []);
  const openItem = useCallback((item: NumberItem) => {
    if (item.id.startsWith('custom:')) setEditor(item); else setSelected(item);
  }, []);
  const callItem = useCallback((item: NumberItem) => {
    void Linking.openURL(telHref(item.num)).catch(() => setToastMessage(t('home.callFailed', { defaultValue: '전화를 연결할 수 없어요.' })));
  }, [t]);
  useEffect(() => {
    if (favoritesError) setToastMessage(homeCopy.saveError);
  }, [favoritesError, homeCopy.saveError]);
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (tab === 'home' && (homeView !== 'numbers' || !isBrowseHome)) { resetHome(); return true; }
      return false;
    });
    return () => subscription.remove();
  }, [tab, homeView, isBrowseHome, resetHome]);


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

  // Keep the input mounted while typing; search focus must not reset per keystroke.
  const homeChrome = (
    <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12, backgroundColor: themeColors.bg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 44 }}>
        {isBrowseHome ? <Image
          source={theme === 'dark' ? require('./assets/brand/header-label-dark.png') : require('./assets/brand/header-label-light.png')}
          style={{ width: 108, height: 42 }} resizeMode="contain" accessibilityLabel={t('settings.metaBrand')}
        /> : <Pressable onPress={resetHome} accessibilityRole="button" accessibilityLabel={t('tabs.home')} style={{ minWidth: 44, minHeight: 44, justifyContent: 'center' }}><Ionicons name="chevron-back" size={24} color={themeColors.textPrimary} /></Pressable>}
        <Pressable onPress={() => setTab('settings')} accessibilityRole="button" accessibilityLabel={t('tabs.settings')} style={{ minHeight: 44, minWidth: 44, alignItems: 'center', justifyContent: 'center' }}><Ionicons name="settings-outline" size={23} color={themeColors.textSecondary} /></Pressable>
      </View>
      <Text accessibilityRole="header" style={{ color: themeColors.textPrimary, fontSize: isBrowseHome ? 24 : 21, fontWeight: '800', marginTop: 8, marginBottom: 14 }}>
        {isBrowseHome ? (savedItems.length ? homeCopy.returnHeading : homeCopy.firstHeading) : isFavoritesView ? homeCopy.saved : activeSituation ? homeCopy.situations[activeSituation].title : activeSeason ? homeCopy.seasons[activeSeason as keyof typeof homeCopy.seasons]?.title : homeCopy.searchTitle}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 14, minHeight: 50, borderRadius: 17, borderWidth: 1, borderColor: themeColors.border, backgroundColor: themeColors.surface }}>
        <Ionicons name="search-outline" size={21} color={themeColors.textSecondary} />
        <TextInput style={{ flex: 1, minHeight: 50, fontSize: 15, color: themeColors.textPrimary }}
          placeholder={homeCopy.search} placeholderTextColor={themeColors.textTertiary}
          value={query} onChangeText={setQuery} onFocus={() => { setSearchOpen(true); setShowFavorites(false); setActiveSituation(null); setActiveSeason(null); }}
          clearButtonMode="while-editing" accessibilityLabel={homeCopy.search} returnKeyType="search" />
      </View>
      {searchOpen || activeSituation ? <View style={{ marginTop: 14 }}>
        <Text style={{ color: themeColors.textSecondary, fontSize: 13, fontWeight: '600', marginBottom: 8 }}>{homeCopy.suggestions}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ gap: 8 }}>
          {homeCopy.searchSuggestions.map((word) => <Pressable key={word} accessibilityRole="button" onPress={() => { setQuery(word); setSearchOpen(true); }} style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border, borderWidth: 1, borderRadius: 13, minHeight: 44, paddingHorizontal: 13, justifyContent: 'center' }}><Text style={{ color: themeColors.textSecondary }}>{word}</Text></Pressable>)}
        </ScrollView>
      </View> : null}
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
      keyboardDismissMode="on-drag"
      contentContainerStyle={[styles.listContent, { paddingHorizontal: 20 }]}
    >
      <SituationHome colors={themeColors} items={savedItems} onSelectItem={openItem} onCall={callItem}
        onAdd={() => setEditor('new')} onShowSaved={() => setShowFavorites(true)}
        onSituation={(id) => { setActiveSituation(id); setShowFavorites(false); }}
        onEmergency={guides.openEmergency} onSeason={(id) => setActiveSeason(id)}
        onAllSeasons={() => setHomeView('seasons')} onCategories={() => setHomeView('categories')} />
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
      <View style={styles.sectionHeader}>
        <Text style={styles.favHeader}>
          <Text style={styles.favHeaderStar}>★ </Text>
          {homeCopy.saved}
        </Text>
      </View>
      <Pressable accessibilityRole="button" onPress={() => setEditor('new')} style={{ padding: 16, marginHorizontal: 20, marginBottom: 12, borderRadius: 16, backgroundColor: themeColors.accentMuted }}><Text style={{ color: themeColors.accent, fontWeight: '700' }}>＋ {homeCopy.addNumber}</Text></Pressable>
      {widgetAvailable ? <WidgetGuideBanner
        styles={styles}
        colors={themeColors}
        onPress={() => guides.openManual('widgetHowTo')}
      /> : null}
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
              onToggleFavorite={toggleFavorite}
              onOpen={openItem}
              onDrag={drag}
              isActive={isActive}
              styles={styles}
            />
            {!last ? <View style={styles.cardDivider} /> : null}
          </View>
        </ScaleDecorator>
      );
    },
    [filtered.length, isFavorite, styles, toggleFavorite, openItem],
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
          pointerEvents={showSplash || guides.transitioning || guides.active !== null ? 'none' : 'auto'}
        >
          <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />

            <View style={styles.main}>
              {showHomeNumbers ? homeChrome : null}

              {tab === 'home' && (homeView === 'categories' || homeView === 'seasons') ? (
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, gap: 12 }}>
                    <Pressable onPress={resetHome} accessibilityRole="button" accessibilityLabel={t('tabs.home')} style={{ minWidth: 44, minHeight: 52, justifyContent: 'center' }}><Ionicons name="chevron-back" size={24} color={themeColors.textPrimary} /></Pressable>
                    <Text accessibilityRole="header" style={{ fontSize: 21, fontWeight: '800', color: themeColors.textPrimary }}>{homeView === 'categories' ? homeCopy.categories : homeCopy.seasonal}</Text>
                  </View>
                  <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
                    {homeView === 'categories' ? <CategoryBrowse styles={styles} colors={themeColors} onOpenCategory={openCategory} /> : SEASONAL_CONTACTS.map((season) => (
                      <Pressable key={season.id} accessibilityRole="button" onPress={() => { setActiveSeason(season.id); setHomeView('numbers'); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 20, marginHorizontal: 20, marginTop: 12, borderRadius: 18, backgroundColor: themeColors.surface }}>
                        <Ionicons name={season.icon} size={26} color={season.accent} />
                        <View style={{ flex: 1 }}><Text style={{ color: themeColors.textPrimary, fontSize: 16, fontWeight: '700' }}>{homeCopy.seasons[season.id].title}</Text><Text style={{ color: themeColors.textSecondary, marginTop: 5 }}>{homeCopy.seasons[season.id].detail}</Text></View>
                        <Ionicons name="chevron-forward" size={18} color={themeColors.textTertiary} />
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              ) : null}

              {/* Browse Home은 언마운트하지 않아 검색/카테고리 왕복 시 스크롤 유지 */}
              {showHomeNumbers ? (
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
                  onToggleFavorite={toggleFavorite}
                  onOpen={openItem}
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
                  keyboardDismissMode="on-drag"
                  contentContainerStyle={styles.listContent}
                  ListHeaderComponent={favoritesHeader}
                  ListEmptyComponent={searchOpen && !isSearching ? null : emptyComponent}
                  renderItem={renderFavoriteItem}
                  style={{ flex: 1 }}
                />
              ) : null}

              {showFilteredList ? (
                <SectionList
                  sections={sections}
                  keyExtractor={(item) => item.id}
                  extraData={listExtraData}
                  stickySectionHeadersEnabled={false}
                  keyboardShouldPersistTaps="handled"
                  keyboardDismissMode="on-drag"
                  contentContainerStyle={styles.listContent}
                  ListEmptyComponent={searchOpen && !isSearching ? null : emptyComponent}
                  style={{ flex: 1 }}
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
                        onToggleFavorite={toggleFavorite}
                        onOpen={openItem}
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
                    onOpenGuide={() => guides.openManual('manual')}
                    onOpenWidgetGuide={() => guides.openManual('widgetHowTo')}
                    widgetAvailable={widgetAvailable}
                  />
                )
              ) : null}
            </View>

            {!(
              tab === 'home' &&
              homeView !== 'numbers'
            ) ? (
              <AdBanner colors={themeColors} />
            ) : null}

            <TabBar
              active={tab}
              onChange={(next) => {
                setTab(next);
                if (next === 'home') resetHome();
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

            {editor ? <SavedNumberEditor item={editor === 'new' ? undefined : editor} colors={themeColors} onClose={() => setEditor(null)}
              onSave={async (input, id) => { await saveCustom(input, id); setEditor(null); if (!id) guides.favoriteAdded(); }}
              onRemove={async (id) => { await removeCustom(id); setEditor(null); }}
            /> : null}

            {selected ? (
              <DetailSheet
                item={selected}
                isFavorite={isFavorite(selected.id)}
                onClose={() => setSelected(null)}
                onToggleFavorite={toggleFavorite}
                styles={styles}
              />
            ) : null}
          </SafeAreaView>
        </View>

        {showSplash ? (
          <SplashAnimation
            theme={theme}
            active={nativeSplashHidden && themeReady && localeReady && favoritesReady && guides.ready}
            onFinish={onSplashFinish}
          />
        ) : null}
        {!showSplash && (guides.active === 'firstLaunch' || guides.active === 'manual') ? (
          <FirstLaunchGuide colors={themeColors} theme={theme} mode={guides.active} widgetAvailable={widgetAvailable} onClose={guides.close} />
        ) : null}
        {!showSplash && guides.active === 'widgetIntro' ? (
          <WidgetIntroSheet colors={themeColors} onClose={guides.close} onContinue={guides.showWidgetHowTo} />
        ) : null}
        {!showSplash && guides.active === 'widgetHowTo' ? (
          <WidgetHowToSheet colors={themeColors} onClose={guides.close} />
        ) : null}
        {!showSplash && guides.active === 'emergency' ? (
          <EmergencyLocationGuide colors={themeColors} onClose={guides.close} onContinue={guides.continueEmergency} />
        ) : null}
      </View>
    </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
