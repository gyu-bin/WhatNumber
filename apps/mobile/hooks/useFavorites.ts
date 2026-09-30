import { useCallback, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { CUSTOM_PREFIX, LEGACY_FAVORITES_KEY, SAVED_NUMBERS_KEY, makeCustomNumber, parseSavedNumbers, type CustomNumberInput, type SavedNumbersState } from '../services/favorites/savedNumbers';

export function useFavorites() {
  const [state, setState] = useState<SavedNumbersState>({ favorites: [], customNumbers: [] });
  const current = useRef(state);
  const writable = useRef(false);
  const mounted = useRef(true);
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    mounted.current = true;
    void AsyncStorage.multiGet([SAVED_NUMBERS_KEY, LEGACY_FAVORITES_KEY]).then(values => {
      const loaded = parseSavedNumbers(values[0][1], values[1][1]);
      if (!mounted.current) return;
      current.current = loaded;
      setState(loaded);
      writable.current = true;
    }).catch(() => {
      if (mounted.current) setError('storage_read_failed');
    }).finally(() => { if (mounted.current) setReady(true); });
    return () => { mounted.current = false; writable.current = false; };
  }, []);

  const update = useCallback((change: (prev: SavedNumbersState) => SavedNumbersState) => {
    const operation = queue.current.catch(() => undefined).then(async () => {
      if (!writable.current) throw new Error('storage_unavailable');
      const next = change(current.current);
      // Atomic authoritative record: numbers and favorite order change together.
      await AsyncStorage.setItem(SAVED_NUMBERS_KEY, JSON.stringify(next));
      current.current = next;
      if (mounted.current) { setState(next); setError(null); }
      await AsyncStorage.setItem(LEGACY_FAVORITES_KEY, JSON.stringify(next.favorites)).catch(() => undefined);
      return next;
    });
    queue.current = operation;
    return operation.catch(reason => {
      if (mounted.current) setError('storage_write_failed');
      throw reason;
    });
  }, []);
  const toggle = useCallback(async (id: string) => {
    const next = await update(prev => ({ ...prev, favorites: prev.favorites.includes(id) ? prev.favorites.filter(value => value !== id) : [...prev.favorites, id] }));
    return next.favorites.includes(id);
  }, [update]);

  const reorder = useCallback((nextIds: string[]) => {
    void update(prev => ({ ...prev, favorites: [...new Set(nextIds.filter(id => prev.favorites.includes(id))), ...prev.favorites.filter(id => !nextIds.includes(id))] })).catch(() => undefined);
  }, [update]);

  const saveCustom = useCallback(async (input: CustomNumberInput, existingId?: string) => {
    const id = existingId ?? `${CUSTOM_PREFIX}${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    const item = makeCustomNumber(input, id);
    await update(prev => {
      if (existingId && !prev.customNumbers.some(number => number.id === existingId)) throw new Error('number_not_found');
      return { customNumbers: existingId ? prev.customNumbers.map(number => number.id === id ? item : number) : [...prev.customNumbers, item], favorites: prev.favorites.includes(id) ? prev.favorites : [...prev.favorites, id] };
    });
    return item;
  }, [update]);
  const removeCustom = useCallback(async (id: string) => {
    await update(prev => ({ favorites: prev.favorites.filter(value => value !== id), customNumbers: prev.customNumbers.filter(item => item.id !== id) }));
  }, [update]);
  const isFavorite = useCallback((id: string) => state.favorites.includes(id), [state.favorites]);

  return { ...state, toggle, reorder, isFavorite, ready, storageAvailable: writable.current, saveCustom, removeCustom, error };
}
