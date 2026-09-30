import { ALL_NUMBERS, type NumberItem } from '@whatnumber/shared';

export type HomeSituationId = 'health' | 'car' | 'finance' | 'crime';
export const HOME_SITUATIONS = [
  { id: 'health', icon: 'heart', accent: '#F04F60' },
  { id: 'car', icon: 'car', accent: '#1685EF' },
  { id: 'finance', icon: 'card', accent: '#13A98C' },
  { id: 'crime', icon: 'alert-circle', accent: '#EF5365' },
] as const;

/** Curated entry points into the existing directory; no independent phone data. */
export function getSituationNumbers(id: HomeSituationId): NumberItem[] {
  return ALL_NUMBERS.filter((item) => {
    if (id === 'health') return ['e1', 'e2', 'e4', 'e7', 'l2'].includes(item.id);
    if (id === 'car') return item.situation.includes('car');
    if (id === 'finance') return item.cat === '법률/금융';
    return item.situation.includes('crime');
  });
}

export const SEASONAL_CONTACTS = [
  { id: 'holiday', icon: 'flower', accent: '#EC6474', months: [1, 2, 5, 9, 10], numberIds: ['e2', 'e4', 'g1'] },
  { id: 'rain', icon: 'umbrella', accent: '#208BE5', months: [6, 7, 8, 9], numberIds: ['h7', 'e2', 'h5', 'g1'] },
  { id: 'heat', icon: 'sunny', accent: '#D59514', months: [6, 7, 8], numberIds: ['e2', 'h5', 'h6', 'h7'] },
  { id: 'winter', icon: 'snow', accent: '#208BE5', months: [11, 12, 1, 2], numberIds: ['h4', 'h5', 'h6', 'h7'] },
  { id: 'tax', icon: 'document-text', accent: '#9560D9', months: [12, 1, 2, 5], numberIds: ['l7', 'l8'] },
  { id: 'moving', icon: 'home', accent: '#12A88D', months: [3, 4, 9, 10], numberIds: ['h1', 'h3', 'h5', 'h6', 'g1'] },
] as const;
export type SeasonId = typeof SEASONAL_CONTACTS[number]['id'];

export function getCurrentSeasons(date = new Date()) {
  const month = date.getMonth() + 1;
  return SEASONAL_CONTACTS.filter((item) => (item.months as readonly number[]).includes(month));
}
export function getSeasonNumbers(id: string): NumberItem[] {
  const season = SEASONAL_CONTACTS.find((item) => item.id === id);
  return season ? season.numberIds.flatMap((numberId) => {
    const item = ALL_NUMBERS.find((contact) => contact.id === numberId);
    return item ? [item] : [];
  }) : [];
}
