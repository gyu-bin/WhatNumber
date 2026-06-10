import { useMemo, useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  NUMBERS,
  getNumberById,
  matchesSearch,
  type Situation,
} from '@whatnumber/shared';
import { useFavorites } from '../hooks/useFavorites';
import { useTheme } from '../hooks/useTheme';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { copySiteLink } from '../utils/share';
import { NumberRequest } from '../components/NumberRequest';
import { Header } from '../components/Header';
import { IntroSection } from '../components/IntroSection';
import { SearchBar } from '../components/SearchBar';
import { SituationBar } from '../components/SituationBar';
import { CategoryFilter } from '../components/CategoryFilter';
import { NumberList } from '../components/NumberList';
import { NumberDetail } from '../components/NumberDetail';
import { Footer } from '../components/Footer';
import { Toast } from '../components/Toast';
import { VercelAnalytics } from '../components/VercelAnalytics';

export function HomePage() {
  useDocumentTitle();
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

  return (
    <div className="app">
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onCopyLink={handleCopySite}
      />
      <main className="main">
        <NumberRequest />
        <SearchBar query={query} onChange={setQuery} />
        {!isSearching && (
          <>
            <SituationBar
              active={activeSituation}
              onSelect={handleSituation}
            />
            <CategoryFilter
              active={activeCategory}
              onSelect={handleCategory}
              situationActive={!!activeSituation}
              favoritesCount={favorites.length}
            />
          </>
        )}
        <NumberList
          items={filtered}
          groupByCategory={groupByCategory}
          isFavorite={isFavorite}
          onToggleFavorite={toggle}
          onOpen={openDetail}
          mode={isFavoritesView ? 'favorites' : 'default'}
        />
        <IntroSection />
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
      <VercelAnalytics />
    </div>
  );
}
