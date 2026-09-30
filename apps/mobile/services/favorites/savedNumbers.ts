import type { NumberItem } from '@whatnumber/shared';
export type CustomNumberInput = { title: string; num: string; icon?: string };
export type SavedNumbersState = { favorites: string[]; customNumbers: NumberItem[] };
export const SAVED_NUMBERS_KEY = 'saved_numbers_v1';
export const LEGACY_FAVORITES_KEY = 'favorites_v1';
export const CUSTOM_PREFIX = 'custom:';
export function makeCustomNumber(input: CustomNumberInput, id: string): NumberItem {
  const title = input.title.trim();
  const num = input.num.trim();
  if (!title || title.length > 40 || /[\u0000-\u001f]/.test(title)) throw new Error('invalid_title');
  if (!/^\+?[0-9 ()-]+$/.test(num) || num.replace(/\D/g, '').length < 3 || num.replace(/\D/g, '').length > 15) throw new Error('invalid_phone');
  const icon = input.icon?.trim() || '📞';
  if (icon.length > 16 || /[\u0000-\u001f]/.test(icon)) throw new Error('invalid_icon');
  // Persist dial-safe numbers so every existing phone/widget link helper can use
  // the same value, including restored records created before normalization.
  const normalizedNumber = num.replace(/[ ()-]/g, '');
  return { id, title, num: normalizedNumber, icon, cat: '주거/생활', desc: '', situation: [] };
}
export function parseSavedNumbers(raw: string | null, legacy: string | null): SavedNumbersState {
  if (!raw) {
    const ids: unknown = legacy ? JSON.parse(legacy) : [];
    if (!Array.isArray(ids) || ids.some(id => typeof id !== 'string')) throw new Error('invalid_storage');
    return { favorites: [...new Set(ids as string[])], customNumbers: [] };
  }
  const state = JSON.parse(raw) as SavedNumbersState;
  if (!Array.isArray(state.favorites) || !Array.isArray(state.customNumbers) || state.favorites.some(id => typeof id !== 'string')) throw new Error('invalid_storage');
  const customNumbers = state.customNumbers.map(item => {
    if (typeof item?.id !== 'string' || !item.id.startsWith(CUSTOM_PREFIX)) throw new Error('invalid_storage');
    return makeCustomNumber(item, item.id);
  });
  if (new Set(customNumbers.map(item => item.id)).size !== customNumbers.length) throw new Error('invalid_storage');
  const validIds = new Set(customNumbers.map(item => item.id));
  return { customNumbers, favorites: [...new Set(state.favorites)].filter(id => !id.startsWith(CUSTOM_PREFIX) || validIds.has(id)) };
}
