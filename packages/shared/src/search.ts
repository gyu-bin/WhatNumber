import type { ContactPurpose, NumberItem, OrganizationContact, Situation } from './numbers';

/**
 * 공공번호별 구어체·상황 별칭.
 * 기업 contacts의 keywords와 같은 역할 — blob에만 들어가고 화면에 안 보입니다.
 */
const ITEM_ALIASES: Record<string, string[]> = {
  e16: ['국방헬프콜', '군대', '장병', '군생활', '병영생활', '군범죄', '병영안전', '군 고충', '마약'],
  f10: ['정신건강', '위기상담', '마음', '심리상담', '정신건강복지센터'],
  f11: ['치매', '기억력', '치매환자', '돌봄', '중앙치매센터', '치매상담'],
  f12: ['도박', '도박문제', '도박중독', '도박상담', '단도박', '청소년 도박', '한국도박문제예방치유원'],
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
  e2: ['불', '화재신고', '구급차', '아파', '아픔', '아프', '응급실', '응급', '병원'],
  e3: ['경찰청', '경찰서', '도난', '절도', '사기'],
  e4: ['감염병', '질병', '예방접종', '질병관리청', 'KDCA'],
  e6: ['여행', '해외'],
  e7: ['자살'],
  h1: ['집', '주거'],
  h2: ['소음', '집', '주거'],
  h3: ['집', '주거'],
  h5: ['집', '주거'],
  h6: ['집', '주거'],
  h7: ['집', '주거'],
  f5: ['여행'],
  f8: ['학대'],
  c7: ['운전', '면허'],
  l4: ['피싱', '스미싱', '사기'],
  l7: ['세금'],
  l9: ['사이버'],
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
  차: ['차', '자동차'],
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
    if (!word.endsWith(particle) || word.length <= particle.length) continue;
    const stem = word.slice(0, -particle.length);
    // "차가" → 차. "사과"처럼 조사가 아닌 끝소리는 그대로 둡니다.
    if (stem.length >= 2 || stem === '차' || stem === '집') return stem;
  }
  return word;
}

/** 구어 어미. 긴 것부터 잘라 "고장났어요" → 고장, "아파요" → 아파. */
const PREDICATE_ENDINGS = [
  '났음',
  '났어',
  '났다',
  '났어요',
  '했음',
  '했어',
  '했다',
  '했어요',
  '았음',
  '었음',
  '았어',
  '었어',
  '어요',
  '아요',
  '여요',
  '네요',
  '죠',
  '요',
  '음',
  '다',
];

const DROPPED_STEMS = new Set(['났', '나', '했', '하', '있', '있어', '되', '돼', '됨', '였']);

const DROPPED_WORDS = new Set([
  '났음',
  '났어',
  '났다',
  '났어요',
  '있어요',
  '있어',
  '있음',
  '했음',
  '했어',
  '했다',
  '했어요',
]);

const SINGLE_CHAR_STEMS = new Set(['아파', '아프', '응급', '구급', '고장', '사고', '났', '했', '있']);

function stemPredicate(word: string): string {
  for (const ending of PREDICATE_ENDINGS) {
    if (!word.endsWith(ending) || word.length <= ending.length) continue;
    const stem = word.slice(0, -ending.length);
    if (!stem) continue;
    // 한 글자 어미는 "층간소음" 같은 명사를 자르지 않습니다.
    if (ending.length === 1 && !SINGLE_CHAR_STEMS.has(stem) && !DROPPED_STEMS.has(stem)) continue;
    return stem;
  }
  return word;
}

/**
 * 단어가 가리키는 개념입니다. 문장 전체를 답으로 저장하지 않습니다.
 * "차 사고 났음"과 "자동차 박았어"는 둘 다 차량 + 사고로 읽힙니다.
 */
type Concept =
  | 'vehicle'
  | 'accident'
  | 'breakdown'
  | 'illness'
  | 'fire'
  | 'crime'
  | 'home'
  | 'abroad'
  | 'legal'
  | 'loss'
  | 'transit'
  | 'rail';

const CONCEPT_CUES: Record<Concept, string[]> = {
  vehicle: ['자동차', '고속도로', '차량', '교통', '운전', '차'],
  accident: ['추돌', '충돌', '뺑소니', '접촉', '사고', '박'],
  breakdown: ['긴급출동', '견인', '렉카', '고장', '방전', '펑크'],
  illness: ['응급실', '응급', '구급', '병원', '아픔', '아파', '아프'],
  fire: ['화재', '불'],
  crime: ['보이스피싱', '피싱', '범죄', '사기', '도난', '절도'],
  home: ['주거', '집'],
  abroad: ['해외', '외국', '여행', '출국'],
  legal: ['변호사', '법률', '소송', '금융'],
  loss: ['분실물', '유실물', '놓고내림', '두고내림', '분실', '유실'],
  transit: ['대중교통', '지하철', '시내버스', '버스', '전철', '택시'],
  rail: ['코레일', '기차', '열차', '철도', 'ktx'],
};

const SITUATION_CONCEPT: Record<Situation, Concept> = {
  emergency: 'illness',
  car: 'vehicle',
  crime: 'crime',
  home: 'home',
  abroad: 'abroad',
  legal: 'legal',
};

const ALL_CUES = new Set(Object.values(CONCEPT_CUES).flat());

function wordCarriesCue(word: string, cue: string): boolean {
  if (word === cue) return true;
  if (cue.length < 2 || word.length <= cue.length || !word.includes(cue)) return false;
  const rest = word.startsWith(cue)
    ? word.slice(cue.length)
    : word.endsWith(cue)
      ? word.slice(0, -cue.length)
      : '';
  return rest.length > 0 && ALL_CUES.has(rest);
}

function conceptsInText(words: string[]): Set<Concept> {
  const found = new Set<Concept>();
  for (const word of words) {
    for (const [concept, cues] of Object.entries(CONCEPT_CUES) as [Concept, string[]][]) {
      if (cues.some((cue) => wordCarriesCue(word, cue))) found.add(concept);
    }
  }
  return found;
}

function conceptsForItem(item: NumberItem, words: string[]): Set<Concept> {
  const found = conceptsInText(words);
  for (const situation of item.situation) found.add(SITUATION_CONCEPT[situation]);
  if (isOrganizationContact(item)) {
    if (item.purpose === 'accident' || item.purpose === 'roadside') found.add('vehicle');
    if (item.purpose === 'accident') found.add('accident');
    if (item.purpose === 'roadside') found.add('breakdown');
    if (item.purpose === 'lost') found.add('loss');
    if (item.purpose === 'fraud') found.add('crime');
  }
  return found;
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
  if (DROPPED_WORDS.has(word)) return '';
  word = stemPredicate(word);
  if (DROPPED_STEMS.has(word) || STOPWORDS.has(word) || word.length < 1) return '';
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

function hangulWords(text: string): string[] {
  return text.toLowerCase().split(/[^0-9a-z가-힣]+/).filter(Boolean);
}

/** 긴 단어 끝에만 허용하는 두 글자. "비자"⊂"소비자", "화재"⊂"삼성화재"는 제외합니다. */
const COMPOUND_SUFFIXES = new Set(['사기', '오염', '식품', '학대', '소음']);

/**
 * 두 글자는 같은 단어이거나, 그 단어로 시작하는 복합어만 맞습니다.
 * 세 글자 이상은 포함을 허용합니다.
 */
function wordHit(words: string[], token: string): boolean {
  if (!token) return false;
  return words.some((word) => {
    if (word === token) return true;
    if (token.length < 2) return false;
    if (token.length >= 3 && word.includes(token)) return true;
    if (word.startsWith(token) && word.length > token.length) return true;
    return COMPOUND_SUFFIXES.has(token) && word.endsWith(token) && word.length > token.length;
  });
}

function directHit(words: string[], token: string): boolean {
  return words.some((word) => word === token || (token.length >= 3 && word.includes(token)));
}
function dialingMatches(numberDigits: string, queryDigits: string): boolean {
  if (!queryDigits || !numberDigits) return false;
  if (numberDigits === queryDigits) return true;
  if (queryDigits.length <= 3) {
    const extra = numberDigits.length - queryDigits.length;
    return numberDigits.endsWith(queryDigits) && extra >= 2 && extra <= 3;
  }
  return numberDigits.includes(queryDigits);
}

function itemSearchWords(item: NumberItem): {
  title: string[];
  alias: string[];
  keyword: string[];
  body: string[];
} {
  const aliases = ITEM_ALIASES[item.id] ?? [];
  const organizationTerms = isOrganizationContact(item)
    ? [
        item.organization,
        CONTACT_PURPOSE_LABELS[item.purpose],
        ...item.keywords,
        item.available24h ? '24시간' : '',
      ]
    : [];

  return {
    title: hangulWords(item.title),
    alias: hangulWords(aliases.join(' ')),
    keyword: hangulWords(organizationTerms.join(' ')),
    body: hangulWords(`${item.desc} ${item.num}`),
  };
}

function scoreItem(item: NumberItem, query: string, tokens: string[]): number {
  const q = query.trim().toLowerCase();
  const fields = itemSearchWords(item);
  const all = [...fields.title, ...fields.alias, ...fields.keyword, ...fields.body];
  let score = 0;

  if (!q) return 0;

  // Number-only searches match dialing values, not advice text.
  if (/^[+\d\s()-]+$/.test(q)) {
    const digits = q.replace(/\D/g, '');
    const number = item.num.replace(/\D/g, '');
    return dialingMatches(number, digits) ? (digits === number ? 200 : 100) : 0;
  }

  if (wordHit(fields.title, q)) score += 120;
  const digitGroups = q.match(/\d{3,}/g) ?? [];
  const number = item.num.replace(/\D/g, '');
  if (digitGroups.some((digits) => dialingMatches(number, digits))) score += 100;
  if (wordHit(all, q)) score += 40;

  let hitCount = 0;
  for (const token of tokens) {
    if (!wordHit(all, token)) continue;
    hitCount += 1;

    if (wordHit(fields.title, token)) score += 28;
    else if (wordHit(fields.alias, token) || wordHit(fields.keyword, token)) score += 22;
    else score += 12;
  }

  if (isOrganizationContact(item)) {
    if (directHit(hangulWords(item.organization), q)) score += 110;
    score += item.keywords.filter((keyword) => directHit(hangulWords(keyword), q)).length * 80;
    for (const token of tokens) {
      if (item.keywords.some((keyword) => directHit(hangulWords(keyword), token))) score += 24;
    }
  }

  const queryConcepts = conceptsInText(tokens);
  const itemConcepts = conceptsForItem(item, all);
  let covered = 0;
  for (const concept of queryConcepts) {
    if (itemConcepts.has(concept)) covered += 1;
  }
  // 개념이 둘 이상이면 그 조합을 모두 가진 번호만 남깁니다.
  if (queryConcepts.size >= 2 && covered < queryConcepts.size) return 0;
  if (covered > 0) score += 32 * covered;

  if (hitCount === 0 && covered === 0 && score < 40) return 0;

  return score;
}

/** 제목·설명·번호·기업 키워드·별칭으로 검색합니다. */
export function matchesSearch(item: NumberItem, query: string): boolean {
  const q = query.trim();
  if (!q) return true;
  const tokens = expandQueryTokens(q);
  return scoreItem(item, q, tokens) > 0;
}

/**
 * 검색 결과는 점수로 정렬합니다.
 * 카탈로그에 없는 한글 상황은 비우지 않고 112·119를 보여 줍니다.
 */
const URGENT_FALLBACK_IDS = ['e3', 'e2'];

function rankedMatches(items: NumberItem[], query: string): NumberItem[] {
  const tokens = expandQueryTokens(query);
  return items
    .map((item, originalIndex) => ({
      item,
      originalIndex,
      score: scoreItem(item, query, tokens),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.originalIndex - b.originalIndex)
    .map(({ item }) => item);
}

export function isUrgentFallbackQuery(items: NumberItem[], query: string): boolean {
  const q = query.trim();
  if (!/[가-힣]/.test(q)) return false;
  return rankedMatches(items, q).length === 0;
}

export function searchNumbers(items: NumberItem[], query: string): NumberItem[] {
  const q = query.trim();
  if (!q) return items;

  const matched = rankedMatches(items, q);
  if (matched.length > 0 || !/[가-힣]/.test(q)) return matched;

  return URGENT_FALLBACK_IDS.flatMap((id) => {
    const item = items.find((entry) => entry.id === id);
    return item ? [item] : [];
  });
}
