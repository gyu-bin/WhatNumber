import type {
  ContactPurpose,
  NumberItem,
  OrganizationContact,
  Situation,
} from './numbers';
import { getNumberDetail } from './numberDetails';
import { CATEGORIES, SITUATION_LABELS } from './numbers';

/** 상황 버튼·자연어 검색용 키워드 (항목 situation에만 주입 — 과도한 오염 주의) */
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
    '응급실',
    '자살',
    '해경',
  ],
  car: [
    '차',
    '자동차',
    '교통',
    '사고',
    '고장',
    '렉카',
    '견인',
    '고속도로',
    '탁송',
    '보험',
    '운전',
  ],
  crime: [
    '범죄',
    '사기',
    '피싱',
    '보이스피싱',
    '도난',
    '신고',
    '112',
    '1394',
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

/**
 * 공공번호별 구어체·상황 별칭.
 * 기업 contacts의 keywords와 같은 역할 — blob에만 들어가고 화면에 안 보입니다.
 */
const ITEM_ALIASES: Record<string, string[]> = {
  c8: [
    '버스',
    '시내버스',
    '마을버스',
    '광역버스',
    '지하철',
    '전철',
    '지하철역',
    '택시',
    '대중교통',
    '분실물',
    '유실물',
    '분실',
    '유실',
    '짐',
    '가방',
    '캐리어',
    '배낭',
    '물건',
    '소지품',
    '놓고내림',
    '두고내림',
    '내려서',
    '노선',
    '좌석',
  ],
  c9: [
    'KTX',
    'ktx',
    '기차',
    '열차',
    '철도',
    '코레일',
    '무궁화',
    '새마을',
    'ITX',
    '분실물',
    '유실물',
    '분실',
    '유실',
    '짐',
    '가방',
    '캐리어',
    '배낭',
    '물건',
    '소지품',
    '놓고내림',
    '두고내림',
    '내린역',
    '좌석',
  ],
  c1: ['공공렉카', '고속도로렉카', '사설렉카', '갓길', '긴급견인', '한국도로공사'],
  e2: ['불', '화재신고', '구급차'],
  e3: ['경찰청', '경찰서'],
  e4: ['감염병', '질병', '예방접종', '질병관리청', 'KDCA'],
};

/** 쿼리 단어 → 확장 토큰 (동의어) */
const TERM_EXPANSIONS: Record<string, string[]> = {
  버스: ['버스', '대중교통'],
  시내버스: ['버스', '대중교통'],
  마을버스: ['버스', '대중교통'],
  지하철: ['지하철', '전철', '대중교통'],
  전철: ['지하철', '전철', '대중교통'],
  택시: ['택시', '대중교통'],
  대중교통: ['대중교통', '버스', '지하철'],
  ktx: ['ktx', '기차', '열차', '철도'],
  기차: ['기차', '열차', '철도', 'ktx'],
  열차: ['기차', '열차', '철도', 'ktx'],
  철도: ['기차', '열차', '철도', 'ktx'],
  코레일: ['코레일', '기차', '열차', '철도', 'ktx'],
  짐: ['짐', '가방', '분실물', '유실물', '소지품'],
  가방: ['가방', '짐', '분실물', '유실물', '소지품'],
  캐리어: ['캐리어', '짐', '가방', '분실물', '유실물'],
  배낭: ['배낭', '가방', '짐', '분실물', '유실물'],
  물건: ['물건', '소지품', '분실물', '유실물'],
  소지품: ['소지품', '물건', '분실물', '유실물'],
  분실: ['분실', '분실물', '유실물', '유실'],
  분실물: ['분실물', '유실물', '분실', '유실'],
  유실: ['유실', '유실물', '분실물', '분실'],
  유실물: ['유실물', '분실물', '분실', '유실'],
  잃어: ['분실', '분실물', '유실물'],
  놓고: ['놓고내림', '분실', '분실물', '유실물'],
  두고: ['두고내림', '분실', '분실물', '유실물'],
  내림: ['놓고내림', '분실', '분실물'],
  내렸: ['놓고내림', '분실', '분실물'],
  차: ['차', '자동차', '고장', '사고'],
  자동차: ['차', '자동차'],
  고장: ['고장', '긴급출동', '견인'],
  렉카: ['렉카', '견인', '공공렉카'],
  견인: ['견인', '렉카'],
};

/** 서술형 의도 문구 → 추가 토큰 */
const INTENT_PHRASES: Array<{ pattern: RegExp; tokens: string[] }> = [
  {
    pattern: new RegExp(
      '놓고\\s*내렸|놓고\\s*내림|두고\\s*내렸|두고\\s*내림|내려서\\s*놓|놓고\\s*내|두고\\s*내',
    ),
    tokens: ['놓고내림', '분실물', '유실물', '분실'],
  },
  {
    pattern: new RegExp('잃어\\s*버렸|잃어\\s*버림|잃어\\s*버렸어|분실\\s*했|분실함'),
    tokens: ['분실', '분실물', '유실물'],
  },
  {
    pattern: new RegExp('두고\\s*왔|놓고\\s*왔|깜빡[\\s\\S]*놓고|깜빡[\\s\\S]*두고'),
    tokens: ['분실', '분실물', '유실물', '놓고내림'],
  },
];

const STOPWORDS = new Set([
  '하다',
  '했다',
  '했어',
  '하는',
  '해서',
  '있는',
  '없는',
  '이다',
  '이에요',
  '예요',
  '요',
  '좀',
  '제발',
  '어떻게',
  '어디',
  '뭐',
  '뭘',
  '그',
  '저',
  '이것',
  '그것',
  '때',
  '경우',
  '관련',
  '번호',
  '전화',
  '알려',
  '주세요',
  '부탁',
]);

/** 긴 조사부터 제거 */
const PARTICLES = [
  '에서는',
  '에서도',
  '으로는',
  '으로도',
  '에서',
  '으로',
  '에게',
  '한테',
  '부터',
  '까지',
  '처럼',
  '보다',
  '이나',
  '이나요',
  '이에요',
  '예요',
  '을',
  '를',
  '이',
  '가',
  '은',
  '는',
  '의',
  '와',
  '과',
  '도',
  '만',
  '께',
  '로',
  '에',
];

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

function stripParticle(word: string): string {
  for (const particle of PARTICLES) {
    if (word.length > particle.length + 1 && word.endsWith(particle)) {
      return word.slice(0, -particle.length);
    }
  }
  return word;
}

function normalizeToken(raw: string): string {
  let word = raw.toLowerCase().trim();
  if (!word) return '';

  // 활용형 간단 정규화
  if (word.startsWith('내렸') || word === '내렸어요' || word === '내렸다') word = '내렸';
  if (word.startsWith('놓고')) word = '놓고';
  if (word.startsWith('두고')) word = '두고';
  if (word.startsWith('잃어')) word = '잃어';

  word = stripParticle(word);
  if (STOPWORDS.has(word) || word.length < 1) return '';
  return word;
}

function tokenizeQuery(query: string): string[] {
  const cleaned = query
    .toLowerCase()
    .replace(/[^0-9a-z가-힣]+/gi, ' ')
    .split(/\s+/)
    .filter(Boolean);

  const tokens: string[] = [];
  for (const part of cleaned) {
    const normalized = normalizeToken(part);
    if (normalized) tokens.push(normalized);
  }
  return tokens;
}

/** 쿼리 → 매칭용 확장 토큰 집합 */
export function expandQueryTokens(query: string): string[] {
  const q = query.trim().toLowerCase();
  const base = tokenizeQuery(q);
  const expanded = new Set<string>(base);

  for (const token of base) {
    const extras = TERM_EXPANSIONS[token];
    if (extras) {
      for (const extra of extras) expanded.add(extra.toLowerCase());
    }
  }

  for (const { pattern, tokens } of INTENT_PHRASES) {
    if (pattern.test(q)) {
      for (const token of tokens) expanded.add(token.toLowerCase());
    }
  }

  return [...expanded];
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

  const aliases = ITEM_ALIASES[item.id] ?? [];

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
    ...aliases,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function blobHasToken(blob: string, token: string): boolean {
  if (!token) return false;
  if (blob.includes(token)) return true;
  // 짧은 한글 조사 붙인 형태도 허용 (blob 원문에 조사가 남은 경우)
  return false;
}

function scoreItem(item: NumberItem, query: string, tokens: string[]): number {
  const q = query.trim().toLowerCase();
  const blob = buildSearchBlob(item);
  let score = 0;

  if (!q) return 0;

  // Number-only searches match dialing values, not unrelated advice or situation keywords.
  if (/^[+\d\s()-]+$/.test(q)) {
    const digits = q.replace(/\D/g, '');
    const number = item.num.replace(/\D/g, '');
    return digits && number.includes(digits) ? (digits === number ? 200 : 100) : 0;
  }

  // 전체 구문 / 번호 직접 일치
  if (item.title.toLowerCase().includes(q)) score += 120;
  const digitsQ = q.replace(/-/g, '');
  if (digitsQ && item.num.replace(/-/g, '').includes(digitsQ)) score += 100;
  if (blob.includes(q)) score += 40;

  // 확장 토큰 매칭 (OR — 하나라도 맞으면 가산)
  let hitCount = 0;
  for (const token of tokens) {
    if (token.length < 2 && !/[0-9]/.test(token)) continue;
    if (!blobHasToken(blob, token)) continue;
    hitCount += 1;

    if (item.title.toLowerCase().includes(token)) score += 28;
    else if ((ITEM_ALIASES[item.id] ?? []).some((a) => a.toLowerCase() === token)) score += 22;
    else score += 12;
  }

  if (isOrganizationContact(item)) {
    if (item.organization.toLowerCase().includes(q)) score += 110;
    score +=
      item.keywords.filter((keyword) => keyword.toLowerCase().includes(q)).length * 80;
    for (const token of tokens) {
      if (item.keywords.some((keyword) => keyword.toLowerCase().includes(token))) {
        score += 24;
      }
    }
  } else if (score > 0 && (item.situation.includes('emergency') || item.situation.includes('crime'))) {
    score += 6;
  }

  // 분실 의도 + 교통수단이 같이 있으면 대중교통/철도 분실 항목 강하게 부스트
  const hasLostIntent = tokens.some((t) =>
    ['분실', '분실물', '유실', '유실물', '놓고내림', '두고내림'].includes(t),
  );
  const hasTransit = tokens.some((t) =>
    ['버스', '지하철', '전철', '택시', '대중교통'].includes(t),
  );
  const hasRail = tokens.some((t) =>
    ['ktx', '기차', '열차', '철도', '코레일'].includes(t),
  );

  if (hasLostIntent && hasTransit && item.id === 'c8') score += 90;
  if (hasLostIntent && hasRail && item.id === 'c9') score += 90;
  if (hasLostIntent && !hasRail && hasTransit && item.id === 'c9') score += 15;
  if (hasLostIntent && hasRail && item.id === 'c8') score += 15;

  // 의미 있는 히트가 하나도 없으면 탈락 점수
  if (hitCount === 0 && score < 40) return 0;

  return score;
}

/** 제목·설명·번호·카테고리·상황·상세·꿀팁·별칭 통합 검색 */
export function matchesSearch(item: NumberItem, query: string): boolean {
  const q = query.trim();
  if (!q) return true;
  const tokens = expandQueryTokens(q);
  return scoreItem(item, q, tokens) > 0;
}

/**
 * 검색 결과는 점수로 정렬합니다.
 * 서술형("버스에서 물건을 놓고 내렸다")도 동의어·의도 확장으로 매칭합니다.
 */
export function searchNumbers(items: NumberItem[], query: string): NumberItem[] {
  const q = query.trim();
  if (!q) return items;

  const tokens = expandQueryTokens(q);

  return items
    .map((item, originalIndex) => ({
      item,
      originalIndex,
      score: scoreItem(item, q, tokens),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.originalIndex - b.originalIndex)
    .map(({ item }) => item);
}
