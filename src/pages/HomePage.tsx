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
import { usePageSeo } from '../hooks/usePageSeo';
import { copySiteLink } from '../utils/share';
import { JsonLd } from '../components/JsonLd';
import {
  buildFaqJsonLd,
  buildItemListJsonLd,
  buildWebsiteJsonLd,
  numberPageDescription,
  numberPageTitle,
  numberPath,
} from '../utils/seo';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [activeSituation, setActiveSituation] = useState<Situation | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [toast, setToast] = useState<string | null>(null);
  const { favorites, toggle, isFavorite } = useFavorites();
  const { theme, toggle: toggleTheme } = useTheme();

  const selectedId = searchParams.get('n');
  const selectedItem = selectedId ? getNumberById(selectedId) : undefined;

  usePageSeo(
    selectedItem
      ? {
          title: numberPageTitle(selectedItem),
          description: numberPageDescription(selectedItem),
          path: numberPath(selectedItem.id),
        }
      : { path: '/' },
  );

  const websiteJsonLd = useMemo(() => buildWebsiteJsonLd(), []);
  const itemListJsonLd = useMemo(() => buildItemListJsonLd(), []);
  const faqJsonLd = useMemo(
    () =>
      buildFaqJsonLd([
        {
          question: '응급실 비용이 없을 때 어디에 전화하나요?',
          answer:
            '129(응급의료지원센터)에 연락하면 국가가 먼저 치료비를 지원하는 절차를 안내받을 수 있습니다.',
        },
        {
          question: '고속도로에서 사고가 났을 때 무료 견인은?',
          answer: '1588-2504(고속도로 공공렉카) 또는 1588-2100(긴급견인)을 먼저 연락하세요.',
        },
        {
          question: '간첩·방첩 신고 번호는?',
          answer: '111(국가정보원), 113(경찰 방첩신고)로 신고할 수 있습니다.',
        },
      ]),
    [],
  );

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
      <JsonLd id="website" data={websiteJsonLd} />
      <JsonLd id="itemlist" data={itemListJsonLd} />
      <JsonLd id="faq" data={faqJsonLd} />
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
