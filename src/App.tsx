import { useMemo, useState, useCallback } from 'react';
import { NUMBERS, type Situation } from './data/numbers';
import { useFavorites } from './hooks/useFavorites';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { SituationBar } from './components/SituationBar';
import { CategoryFilter } from './components/CategoryFilter';
import { NumberList } from './components/NumberList';
import { Footer } from './components/Footer';

function App() {
  const [query, setQuery] = useState('');
  const [activeSituation, setActiveSituation] = useState<Situation | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const { favorites, toggle, isFavorite } = useFavorites();

  const isSearching = query.trim().length > 0;

  const handleSituation = useCallback((id: Situation | null) => {
    setActiveSituation(id);
    if (id) setActiveCategory('all');
  }, []);

  const handleCategory = useCallback((id: string) => {
    setActiveCategory(id);
    if (id !== 'all') setActiveSituation(null);
  }, []);

  const filtered = useMemo(() => {
    if (isSearching) {
      const q = query.trim().toLowerCase();
      return NUMBERS.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.desc.toLowerCase().includes(q) ||
          n.num.includes(q),
      );
    }
    if (activeSituation) {
      return NUMBERS.filter((n) => n.situation.includes(activeSituation));
    }
    if (activeCategory === 'favorites') {
      return NUMBERS.filter((n) => favorites.includes(n.id));
    }
    if (activeCategory !== 'all') {
      return NUMBERS.filter((n) => n.cat === activeCategory);
    }
    return NUMBERS;
  }, [query, isSearching, activeSituation, activeCategory, favorites]);

  const groupByCategory =
    !isSearching && !activeSituation && activeCategory === 'all';

  return (
    <div className="app">
      <Header />
      <main className="main">
        <SearchBar
          query={query}
          onChange={setQuery}
        />
        <SituationBar
          active={activeSituation}
          onSelect={handleSituation}
          disabled={isSearching}
        />
        <CategoryFilter
          active={activeCategory}
          onSelect={handleCategory}
          disabled={isSearching}
        />
        <NumberList
          items={filtered}
          groupByCategory={groupByCategory}
          isFavorite={isFavorite}
          onToggleFavorite={toggle}
        />
      </main>
      <Footer />
    </div>
  );
}

export default App;
