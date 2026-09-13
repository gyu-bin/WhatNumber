import type {
  ContactPurpose,
  NumberItem,
  OrganizationContact,
  Situation,
} from './numbers';
import { getNumberDetail } from './numberDetails';
import { CATEGORIES, SITUATION_LABELS } from './numbers';

/** 상황 버튼·자연어 검색용 키워드 */
const SITUATION_KEYWORDS: Record<Situation, string[]> = {
  emergency: [
    '응급',
    '아파',
    '아픔',
    '아프',
    '병원',
    '구급',
    '화재',
    '119',
    '129',
    '1339',
    '응급실',
    '자살',
    '1393',
    '해경',
    '122',
  ],
  car: [
    '차',
    '교통',
    '사고',
    '고장',
    '렉카',
    '견인',
    '고속도로',
    '탁송',
    '보험',
    '운전',
    '기차',
    'KTX',
    '철도',
  ],
  crime: [
    '범죄',
    '사기',
    '피싱',
    '보이스피싱',
    '도난',
    '신고',
    '112',
    '1398',
    '피해',
    '간첩',
    '111',
    '113',
    '국정원',
    '테러',
    '방첩',
    '해킹',
    '118',
    '사이버',
    '마약',
    '1301',
    '1337',
    '1338',
    '드론',
    '스파이',
    '학대',
  ],
  home: [
    '집',
    '주거',
    '이사',
    '층간소음',
    '전세',
    '가스',
    '민원',
    '월세',
    '전기',
    '정전',
    '수도',
    '날씨',
    '오염',
    '식품',
  ],
  abroad: ['해외', '외국', '여행', '출국', '비자', '통관', '직구'],
  legal: [
    '법률',
    '변호사',
    '소송',
    '세금',
    '환불',
    '소비자',
    '132',
    '신용',
    '채무',
    '인권',
    '공정거래',
  ],
};

function categoryLabels(cat: string): string {
  const chip = CATEGORIES.find((c) => c.id === cat);
  return chip ? `${cat} ${chip.label}` : cat;
}

const CONTACT_PURPOSE_LABELS: Record<ContactPurpose, string> = {
  general: '대표 고객센터',
  lost: '분실 도난 정지',
  fraud: '금융사기 보이스피싱',
  accident: '자동차 사고접수',
  roadside: '긴급출동 견인',
  emergency: '긴급 대응',
};

export function isOrganizationContact(item: NumberItem): item is OrganizationContact {
  return 'organization' in item && 'keywords' in item;
}

function buildSearchBlob(item: NumberItem): string {
  const situationLabels = item.situation.map((s) => SITUATION_LABELS[s]).join(' ');
  const situationKeys = item.situation
    .flatMap((s) => SITUATION_KEYWORDS[s])
    .join(' ');

  const organizationTerms = isOrganizationContact(item)
    ? [
        item.organization,
        item.organizationType,
        CONTACT_PURPOSE_LABELS[item.purpose],
        ...item.keywords,
        item.available24h ? '24시간 연중무휴' : '',
      ]
    : [];

  return [
    item.title,
    item.desc,
    item.num,
    item.tip,
    ...getNumberDetail(item.id),
    categoryLabels(item.cat),
    situationLabels,
    situationKeys,
    ...organizationTerms,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function queryWords(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[^0-9a-z가-힣]+/gi, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

/** 제목·설명·번호·카테고리·상황·상세·꿀팁 통합 검색 */
export function matchesSearch(item: NumberItem, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const blob = buildSearchBlob(item);
  if (blob.includes(q)) return true;

  const words = queryWords(q);
  if (words.length > 1 && words.every((word) => blob.includes(word))) return true;

  for (const sit of item.situation) {
    const label = SITUATION_LABELS[sit].toLowerCase();
    if (label.includes(q) || q.split(/\s+/).every((word) => label.includes(word))) {
      return true;
    }
  }

  return false;
}

/**
 * 검색 결과는 긴급 공공번호를 우선하되, 사용자가 기관·분실·사고 목적을 명확히
 * 입력했을 때는 해당 기업의 바로 연결 번호가 먼저 오도록 정렬합니다.
 */
export function searchNumbers(items: NumberItem[], query: string): NumberItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;

  return items
    .filter((item) => matchesSearch(item, q))
    .map((item, originalIndex) => {
      const words = queryWords(q);
      let score = 0;

      if (item.title.toLowerCase().includes(q)) score += 120;
      if (item.num.replace(/-/g, '').includes(q.replace(/-/g, ''))) score += 100;
      score += words.filter((word) => item.title.toLowerCase().includes(word)).length * 30;

      if (isOrganizationContact(item)) {
        if (item.organization.toLowerCase().includes(q)) score += 110;
        score += words.filter((word) => item.organization.toLowerCase().includes(word)).length * 35;
        score += item.keywords.filter((keyword) => keyword.toLowerCase().includes(q)).length * 80;
        score += words.filter((word) => item.keywords.some((keyword) => keyword.includes(word))).length * 20;
      } else if (item.situation.includes('emergency') || item.situation.includes('crime')) {
        score += 8;
      }

      return { item, originalIndex, score };
    })
    .sort((a, b) => b.score - a.score || a.originalIndex - b.originalIndex)
    .map(({ item }) => item);
}
