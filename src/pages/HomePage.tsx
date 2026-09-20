import { useMemo, useState, useCallback } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  NUMBERS,
  getNumberById,
  matchesSearch,
  type Situation,
} from '@whatnumber/shared';
import { localizeNumbers } from '../i18n';
import { useLocale } from '../hooks/useLocale';
import { useFavorites } from '../hooks/useFavorites';
import { useTheme } from '../hooks/useTheme';
import { usePageSeo } from '../hooks/usePageSeo';
import { copySiteLink } from '../utils/share';
import { JsonLd } from '../components/JsonLd';
import {
  buildFaqJsonLd,
  buildItemListJsonLd,
  buildWebsiteJsonLd,
  numberPath,
} from '../utils/seo';
import { NumberRequest } from '../components/NumberRequest';
import { Header } from '../components/Header';
import { IntroSection } from '../components/IntroSection';
import { PopularNumbersSection } from '../components/PopularNumbersSection';
import { SearchBar } from '../components/SearchBar';
import { SituationBar } from '../components/SituationBar';
import { CategoryFilter } from '../components/CategoryFilter';
import { NumberList } from '../components/NumberList';
import { Footer } from '../components/Footer';
import { Toast } from '../components/Toast';
import { VercelAnalytics } from '../components/VercelAnalytics';

export function HomePage() {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const [searchParams] = useSearchParams();
  const legacyId = searchParams.get('n');
  const legacyItem = legacyId ? getNumberById(legacyId) : undefined;

  const [query, setQuery] = useState('');
  const [activeSituation, setActiveSituation] = useState<Situation | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [toast, setToast] = useState<string | null>(null);
  const { favorites, toggle, isFavorite } = useFavorites();
  const { theme, toggle: toggleTheme } = useTheme();

  usePageSeo({ path: '/' });

  const localizedNumbers = useMemo(
    () => localizeNumbers(NUMBERS, locale),
    [locale],
  );

  const websiteJsonLd = useMemo(() => buildWebsiteJsonLd(), []);
  const itemListJsonLd = useMemo(() => buildItemListJsonLd(), []);
  const faqJsonLd = useMemo(() => {
    const faq = t('home.faq', { returnObjects: true }) as {
      question: string;
      answer: string;
    }[];
    return buildFaqJsonLd(faq);
  }, [t, locale]);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  }, []);

  const handleCopySite = useCallback(async () => {
    const ok = await copySiteLink();
    showToast(ok ? t('header.copySiteOk') : t('common.copyFail'));
  }, [showToast, t]);

  if (legacyItem) {
    return <Navigate to={numberPath(legacyItem.id)} replace />;
  }

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
      localizeNumbers(
        favorites
          .map((id) => getNumberById(id))
          .filter((n): n is NonNullable<typeof n> => n !== undefined),
        locale,
      ),
    [favorites, locale],
  );

  const filtered = useMemo(() => {
    if (isSearching) {
      return localizedNumbers.filter((n) => matchesSearch(n, query));
    }
    if (activeSituation) {
      return localizedNumbers.filter((n) => n.situation.includes(activeSituation));
    }
    if (activeCategory === 'favorites') {
      return favoriteItems;
    }
    if (activeCategory !== 'all') {
      return localizedNumbers.filter((n) => n.cat === activeCategory);
    }
    return localizedNumbers;
  }, [
    query,
    isSearching,
    activeSituation,
    activeCategory,
    localizedNumbers,
    favoriteItems,
  ]);

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
        <h1 className="sr-only">{t('home.srTitle')}</h1>
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
          mode={isFavoritesView ? 'favorites' : 'default'}
        />
        <PopularNumbersSection />
        <IntroSection />
      </main>
      <Footer />
      <Toast message={toast} />
      <VercelAnalytics />
    </div>
  );
}
