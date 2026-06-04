import { useMemo, useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { NUMBERS, getNumberById, type Situation } from './data/numbers';
import { matchesSearch } from './utils/search';
import { useFavorites } from './hooks/useFavorites';
import { useTheme } from './hooks/useTheme';
import { copySiteLink } from './utils/share';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { SituationBar } from './components/SituationBar';
import { CategoryFilter } from './components/CategoryFilter';
import { FavoritesBar } from './components/FavoritesBar';
import { NumberList } from './components/NumberList';
import { NumberDetail } from './components/NumberDetail';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [activeSituation, setActiveSituation] = useState<Situation | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [toast, setToast] = useState<string | null>(null);
  const { favorites, toggle, isFavorite } = useFavorites();
  const { theme, toggle: toggleTheme } = useTheme();

  const selectedId = searchParams.get('n');
  const selectedItem = selectedId ? getNumberById(selectedId) : undefined;

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  }, []);

  const openDetail = useCallback(
    (id: string) => {
      setSearchParams({ n: id }, { replace: false });
    },
    [setSearchParams],
  );

  const closeDetail = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  const handleCopySite = useCallback(async () => {
    const ok = await copySiteLink();
    showToast(ok ? '웹 주소가 복사됐어요' : '복사에 실패했어요');
  }, [showToast]);

  useEffect(() => {
    if (selectedId && !selectedItem) {
      setSearchParams({}, { replace: true });
    }
  }, [selectedId, selectedItem, setSearchParams]);

  const isSearching = query.trim().length > 0;

  const handleSituation = useCallback((id: Situation | null) => {
    setActiveSituation(id);
    if (id) setActiveCategory('all');
  }, []);

  const handleCategory = useCallback((id: string) => {
    setActiveCategory(id);
    if (id !== 'all') setActiveSituation(null);
  }, []);

  const openFavorites = useCallback(() => {
    setActiveSituation(null);
    setActiveCategory('favorites');
    setQuery('');
  }, []);

  const favoriteItems = useMemo(
    () =>
      favorites
        .map((id) => getNumberById(id))
        .filter((n): n is NonNullable<typeof n> => n !== undefined),
    [favorites],
  );

  const filtered = useMemo(() => {
    if (isSearching) {
      return NUMBERS.filter((n) => matchesSearch(n, query));
    }
    if (activeSituation) {
      return NUMBERS.filter((n) => n.situation.includes(activeSituation));
    }
    if (activeCategory === 'favorites') {
      return favoriteItems;
    }
    if (activeCategory !== 'all') {
      return NUMBERS.filter((n) => n.cat === activeCategory);
    }
    return NUMBERS;
  }, [query, isSearching, activeSituation, activeCategory, favorites, favoriteItems]);

  const groupByCategory =
    !isSearching && !activeSituation && activeCategory === 'all';

  const isFavoritesView = activeCategory === 'favorites' && !isSearching;

  const showFavoritesBar =
    favorites.length > 0 && !isFavoritesView && !isSearching && !activeSituation;

  return (
    <div className="app">
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onCopyLink={handleCopySite}
      />
      <main className="main">
        <SearchBar query={query} onChange={setQuery} />
        <SituationBar
          active={activeSituation}
          onSelect={handleSituation}
          disabled={isSearching}
        />
        <CategoryFilter
          active={activeCategory}
          onSelect={handleCategory}
          disabled={isSearching}
          favoritesCount={favorites.length}
        />
        {showFavoritesBar && (
          <FavoritesBar count={favorites.length} onOpen={openFavorites} />
        )}
        <NumberList
          items={filtered}
          groupByCategory={groupByCategory}
          isFavorite={isFavorite}
          onToggleFavorite={toggle}
          onOpen={openDetail}
          mode={isFavoritesView ? 'favorites' : 'default'}
        />
      </main>
      <Footer />

      {selectedItem && (
        <NumberDetail
          item={selectedItem}
          isFavorite={isFavorite(selectedItem.id)}
          onClose={closeDetail}
          onToggleFavorite={toggle}
          onCopied={showToast}
        />
      )}
      <Toast message={toast} />
    </div>
  );
}

export default App;
