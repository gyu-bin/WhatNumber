import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { normalizeFavoriteIds, resolveContactId } from '@whatnumber/shared';

const STORAGE_KEY = 'favorites_v1';

async function loadFavorites(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? normalizeFavoriteIds(JSON.parse(raw)) : [];
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadFavorites().then((ids) => {
      setFavorites(ids);
      setReady(true);
    });
  }, []);

  const toggle = useCallback((id: string) => {
    id = resolveContactId(id);
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const reorder = useCallback((nextIds: string[]) => {
    const normalized = normalizeFavoriteIds(nextIds);
    setFavorites(normalized);
    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  }, []);

  const isFavorite = useCallback((id: string) => favorites.includes(resolveContactId(id)), [favorites]);

  return { favorites, toggle, reorder, isFavorite, ready };
}
