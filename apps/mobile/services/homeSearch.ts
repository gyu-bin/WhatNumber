import { searchNumbers, type NumberItem } from '@whatnumber/shared';

// Display translated suggestions, while preserving the directory's canonical keywords.
const SUGGESTION_QUERIES = ['교통사고', '타이어 펑크', '배터리 방전', '견인', '카드 분실', '보이스피싱'];
export function searchHomeNumbers(items: NumberItem[], query: string, suggestions: string[]): NumberItem[] {
  const index = suggestions.findIndex((label) => label.toLowerCase() === query.trim().toLowerCase());
  const matches = searchNumbers(items, query);
  if (index < 0) return matches;
  const canonical = searchNumbers(items, SUGGESTION_QUERIES[index] ?? query);
  return [...new Map([...matches, ...canonical].map((item) => [item.id, item])).values()];
}
