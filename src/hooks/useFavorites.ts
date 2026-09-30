import { useState, useCallback } from 'react';
import { normalizeFavoriteIds, resolveContactId } from '@whatnumber/shared';

const STORAGE_KEY = 'favorites_v1';

function loadFavorites(): string[] {
  try {
    return normalizeFavoriteIds(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(loadFavorites);

  const toggle = useCallback((id: string) => {
    id = resolveContactId(id);
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isFavorite = useCallback((id: string) => favorites.includes(resolveContactId(id)), [favorites]);

  return { favorites, toggle, isFavorite };
}
