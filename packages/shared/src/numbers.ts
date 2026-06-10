export type Category =
  | '긴급/안전'
  | '교통/차량'
  | '주거/생활'
  | '법률/금융'
  | '가족/복지'
  | '고용/노동'
  | '민원/행정';

export type Situation =
  | 'emergency'
  | 'car'
  | 'crime'
  | 'home'
  | 'abroad'
  | 'legal';

export interface NumberItem {
  id: string;
  cat: Category;
  icon: string;
  title: string;
  desc: string;
  num: string;
  situation: Situation[];
  tip?: string;
}

export const NUMBERS: NumberItem[] = [
  { id: 'e1', cat: '긴급/안전', icon: '🚑', title: '응급실 비용 없을 때', desc: '국가가 먼저 지급 — 치료 거부는 불법', num: '129', situation: ['emergency'] },
  { id: 'e2', cat: '긴급/안전', icon: '🔥', title: '화재·구급', desc: '기본 중의 기본', num: '119', situation: ['emergency'] },
  { id: 'e3', cat: '긴급/안전', icon: '👮', title: '범죄·경찰 신고', desc: '문자 신고도 가능', num: '112', situation: ['crime'] },
  { id: 'e4', cat: '긴급/안전', icon: '🏥', title: '응급 병원·약국 안내', desc: '새벽에 문 연 병원 찾을 때 필수', num: '1339', situation: ['emergency'] },
  { id: 'e5', cat: '긴급/안전', icon: '🤝', title: '범죄 피해 지원', desc: '치료+심리상담까지 보호', num: '1577-2584', situation: ['crime'] },
  { id: 'e6', cat: '긴급/안전', icon: '🌏', title: '해외 긴급상황', desc: '24시간 한국어 통역 및 지원', num: '02-3210-0404', situation: ['abroad'] },
  { id: 'e7', cat: '긴급/안전', icon: '💚', title: '마음이 힘들 때', desc: '24시간 익명 정신건강 상담', num: '109', situation: ['emergency'] },
  { id: 'e8', cat: '긴급/안전', icon: '🕵️', title: '간첩신고', desc: '국가정보원 · 간첩·테러·북한 연계 의심 신고', num: '111', situation: ['crime'], tip: '경찰 방첩신고는 113. 둘 중 어디로든 신고 가능해요.' },
  { id: 'e9', cat: '긴급/안전', icon: '👮', title: '방첩신고', desc: '경찰청 · 간첩·산업기술 유출·테러·스파이 신고', num: '113', situation: ['crime'] },
  { id: 'e10', cat: '긴급/안전', icon: '🛡️', title: '통합방위 주민신고', desc: '드론·괴선박·수상한 군사 활동 신고', num: '1338', situation: ['crime'] },
  { id: 'e11', cat: '긴급/안전', icon: '🎖️', title: '군사기밀·군 간첩신고', desc: '국군기무사령부 · 군 기밀·간첩·방산 스파이', num: '1337', situation: ['crime'] },

  { id: 'c1', cat: '교통/차량', icon: '🚛', title: '고속도로 공공렉카', desc: '사설렉카 바가지 NO · 무료 이동', num: '1588-2504', situation: ['car'], tip: '고속도로 사고 시 사설렉카 오기 전에 먼저 전화! 공공렉카는 무료예요.' },
  { id: 'c2', cat: '교통/차량', icon: '⚠️', title: '고속도로 긴급견인', desc: '갓길 고장·사고 시 안전지대까지 무료', num: '1588-2100', situation: ['car'] },
  { id: 'c3', cat: '교통/차량', icon: '🚔', title: '교통사고 신고·사실확인', desc: '경찰 출동 · 음주·현장조사 · 합의서', num: '112', situation: ['car', 'crime'] },
  { id: 'c4', cat: '교통/차량', icon: '🚑', title: '교통사고 부상·구급', desc: '119 출동 · 응급처치 및 병원 이송', num: '119', situation: ['car', 'emergency'] },
  { id: 'c5', cat: '교통/차량', icon: '🛡️', title: '자동차보험 사고접수', desc: '보험사별 긴급출동·견인·대차 연결', num: '1566-8000', situation: ['car'] },
  { id: 'c6', cat: '교통/차량', icon: '📋', title: '무보험 차량 사고 피해', desc: '상대가 무보험이어도 피해 보상 안내', num: '1544-0119', situation: ['car', 'legal'] },
  { id: 'c7', cat: '교통/차량', icon: '📍', title: '사고 후 행정·민원 안내', desc: '과태료·면허·보험 관련 민원 연결', num: '110', situation: ['car'] },
  { id: 'c8', cat: '교통/차량', icon: '🚌', title: '대중교통 분실물', desc: '지하철·버스 전국 유실물 통합조회', num: '182', situation: [] },

  { id: 'h1', cat: '주거/생활', icon: '📦', title: '이사 후 주소 일괄변경', desc: '은행·카드·보험 한번에 변경', num: '1588-1300', situation: ['home'], tip: '이사하면 여기 한 번으로 끝! 은행·보험·카드 주소 한꺼번에 바꿔줘요.' },
  { id: 'h2', cat: '주거/생활', icon: '🔊', title: '층간소음 갈등 중재', desc: '전문가가 방문하여 중재', num: '1661-2642', situation: ['home'] },
  { id: 'h3', cat: '주거/생활', icon: '🏘️', title: '전세사기 예방·상담', desc: '계약 전 보증금 안전한지 필수 확인', num: '1566-9009', situation: ['home'] },
  { id: 'h4', cat: '주거/생활', icon: '🔥', title: '가스 누출 긴급', desc: '도시가스 24시간', num: '1670-1004', situation: ['home', 'emergency'] },

  { id: 'l1', cat: '법률/금융', icon: '⚖️', title: '무료 법률 상담', desc: '교통사고·손해배상 · 민형사 소송까지', num: '132', situation: ['legal', 'car'], tip: '소송 전에 꼭! 진짜 변호사가 무료로 상담해줘요.' },
  { id: 'l2', cat: '법률/금융', icon: '💰', title: '병원비 환급받기', desc: '본인부담상한제 기준 초과 시 환급', num: '1577-1000', situation: ['legal', 'emergency'] },
  { id: 'l3', cat: '법률/금융', icon: '🏦', title: '금융 소비자 보호', desc: '보이스피싱·불법금융 신고', num: '1332', situation: ['crime', 'legal'] },
  { id: 'l4', cat: '법률/금융', icon: '📵', title: '보이스피싱 신고', desc: '당하는 중에 바로 전화', num: '1398', situation: ['crime'], tip: '보이스피싱 의심되면 전화 끊고 즉시 1398. 통화 중에도 신고 가능!' },
  { id: 'l5', cat: '법률/금융', icon: '🔒', title: '개인정보 침해 신고', desc: '정보 유출·도용 · KISA 118로도 접수', num: '1811-9000', situation: ['crime', 'legal'] },
  { id: 'l9', cat: '법률/금융', icon: '💻', title: '사이버범죄·해킹 신고', desc: '랜섬웨어·해킹·불법사이트 · KISA 24시간', num: '118', situation: ['crime'], tip: '보이스피싱은 1398, 해킹·사이버범죄는 118이에요.' },
  { id: 'l10', cat: '법률/금융', icon: '💊', title: '마약·검찰 범죄신고', desc: '마약·공무원범죄 · 검찰 종합 민원', num: '1301', situation: ['crime'] },
  { id: 'l6', cat: '법률/금융', icon: '🧾', title: '소비자 분쟁 조정', desc: '환불 안 해줄 때', num: '1544-0990', situation: ['legal'] },
  { id: 'l7', cat: '법률/금융', icon: '💸', title: '세금 문의 (국세청)', desc: '소득세·부가세·세무 상담', num: '126', situation: ['legal'] },
  { id: 'l8', cat: '법률/금융', icon: '🏠', title: '지방세 문의', desc: '자동차세·재산세 상담', num: '1661-7600', situation: ['legal'] },

  { id: 'f1', cat: '가족/복지', icon: '👴', title: '부모님 돌봄 상담', desc: '조건 충족 시 안부 확인 및 방문', num: '1661-2129', situation: [] },
  { id: 'f2', cat: '가족/복지', icon: '🏫', title: '학교폭력 신고', desc: '문자 신고도 가능', num: '117', situation: ['crime'] },
  { id: 'f3', cat: '가족/복지', icon: '🆘', title: '여성긴급전화', desc: '가정폭력·성폭력 24시간', num: '1366', situation: ['emergency', 'crime'] },
  { id: 'f4', cat: '가족/복지', icon: '📷', title: '불법촬영 피해 지원', desc: '영상 삭제까지 도와줌', num: '1899-0088', situation: ['crime'] },
  { id: 'f5', cat: '가족/복지', icon: '🌍', title: '외국인 종합 안내', desc: '외국인 친구 도울 때', num: '1345', situation: ['abroad'] },
  { id: 'f6', cat: '가족/복지', icon: '🧒', title: '청소년 상담', desc: '학업·가족·진로 고민 상담', num: '1388', situation: [] },
  { id: 'f7', cat: '가족/복지', icon: '👶', title: '국민연금 상담', desc: '연금 수령·납부·수급 문의', num: '1355', situation: [] },

  { id: 'w1', cat: '고용/노동', icon: '💼', title: '실업급여·고용지원금', desc: '고용노동부 고객상담', num: '1350', situation: [] },
  { id: 'w2', cat: '고용/노동', icon: '🦺', title: '산재·고용보험', desc: '근로복지공단 상담', num: '1588-0075', situation: [] },
  { id: 'w3', cat: '고용/노동', icon: '📚', title: '내일배움카드·직업교육', desc: '직업훈련 상담 및 신청', num: '1644-8000', situation: [] },

  { id: 'g1', cat: '민원/행정', icon: '📋', title: '정부 민원 콜센터', desc: '전국 어디서든 민원·기관 연결', num: '110', situation: ['home'] },
  { id: 'g2', cat: '민원/행정', icon: '🏙️', title: '서울시 다산콜센터', desc: '서울 관내 120 · 외부·휴대폰 02-120', num: '02-120', situation: ['home'] },
  { id: 'g4', cat: '민원/행정', icon: '🌳', title: '경기도 콜센터', desc: '경기도민 생활·도정 민원', num: '031-120', situation: ['home'] },
  { id: 'g5', cat: '민원/행정', icon: '🛫', title: '인천시 콜센터', desc: '인천시민 생활·행정 민원', num: '032-120', situation: ['home'] },
  { id: 'g6', cat: '민원/행정', icon: '🌊', title: '부산시 민원120', desc: '부산시민 생활·교통·행정 민원', num: '051-120', situation: ['home'] },
  { id: 'g7', cat: '민원/행정', icon: '🏔️', title: '대구시 콜센터', desc: '대구시민 생활·행정 민원', num: '053-120', situation: ['home'] },
  { id: 'g8', cat: '민원/행정', icon: '☀️', title: '광주시 콜센터', desc: '광주시민 생활·행정 민원', num: '062-120', situation: ['home'] },
  { id: 'g9', cat: '민원/행정', icon: '🏛️', title: '대전시 콜센터', desc: '대전시민 생활·행정 민원', num: '042-120', situation: ['home'] },
  { id: 'g10', cat: '민원/행정', icon: '🏭', title: '울산시 콜센터', desc: '울산시민 생활·행정 민원', num: '052-120', situation: ['home'] },
  { id: 'g11', cat: '민원/행정', icon: '🏡', title: '세종시 민원콜센터', desc: '세종시민 생활·행정 민원', num: '044-120', situation: ['home'] },
  { id: 'g12', cat: '민원/행정', icon: '⛰️', title: '강원도 콜센터', desc: '강원도민 생활·도정 민원', num: '033-120', situation: ['home'] },
  { id: 'g13', cat: '민원/행정', icon: '🌾', title: '충청북도 콜센터', desc: '충북도민 생활·도정 민원', num: '043-120', situation: ['home'] },
  { id: 'g14', cat: '민원/행정', icon: '🌾', title: '충청남도 콜센터', desc: '충남도민 생활·도정 민원', num: '041-120', situation: ['home'] },
  { id: 'g15', cat: '민원/행정', icon: '🍃', title: '전북특별자치도 콜센터', desc: '전북도민 생활·도정 민원', num: '063-120', situation: ['home'] },
  { id: 'g16', cat: '민원/행정', icon: '🌿', title: '전라남도 콜센터', desc: '전남도민 생활·도정 민원', num: '061-120', situation: ['home'] },
  { id: 'g17', cat: '민원/행정', icon: '🌸', title: '경상북도 콜센터', desc: '경북도민 생활·도정 민원', num: '054-120', situation: ['home'] },
  { id: 'g18', cat: '민원/행정', icon: '🌺', title: '경상남도 콜센터', desc: '경남도민 생활·도정 민원', num: '055-120', situation: ['home'] },
  { id: 'g19', cat: '민원/행정', icon: '🏝️', title: '제주특별자치도 콜센터', desc: '제주도민 생활·도정 민원', num: '064-120', situation: ['home'] },
  { id: 'g3', cat: '민원/행정', icon: '🪪', title: '주민등록·가족관계', desc: '행정안전부 전자정부 서비스', num: '1588-2188', situation: [] },
];

export const SITUATION_TIPS: Record<Situation, string> = {
  emergency: '💡 응급실에서 비용 없다고 치료 거부하면 안 돼요. 129로 먼저 연락하세요.',
  car: '💡 사고 나면 부상 있으면 119 → 112 신고 → 고속도로는 1588-2504(공공렉카). 보험은 1566-8000.',
  crime: '💡 보이스피싱 1398 · 해킹·사이버 118 · 간첩 111(국정원)·113(경찰). 급하면 112.',
  home: '💡 전국 민원 110 · 거주 지역은 0XX-120(경기 031-120 등). 이사 주소 변경 1588-1300.',
  abroad: '💡 해외 위험 상황이면 02-3210-0404. 한국어로 24시간 연결돼요.',
  legal: '💡 132 무료 법률 상담, 진짜 변호사가 받아요. 소송 전에 꼭 활용하세요.',
};

export const CAT_COLOR: Record<Category, string> = {
  '긴급/안전': '#D94F3D',
  '교통/차량': '#3B6FD4',
  '주거/생활': '#3A7D44',
  '법률/금융': '#B45309',
  '가족/복지': '#6D4ACA',
  '고용/노동': '#0D7490',
  '민원/행정': '#4A4A47',
};

export const CATEGORIES: { id: string; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: '긴급/안전', label: '긴급·안전' },
  { id: '교통/차량', label: '교통·차량' },
  { id: '주거/생활', label: '주거·생활' },
  { id: '법률/금융', label: '법률·금융' },
  { id: '가족/복지', label: '가족·복지' },
  { id: '고용/노동', label: '고용·노동' },
  { id: '민원/행정', label: '민원·행정' },
];

export const SITUATION_ACCENT: Record<Situation, string> = {
  emergency: '#D94F3D',
  car: '#3B6FD4',
  crime: '#D94F3D',
  home: '#3A7D44',
  abroad: '#6D4ACA',
  legal: '#B45309',
};

export function getNumberById(id: string): NumberItem | undefined {
  return NUMBERS.find((n) => n.id === id);
}

export const SITUATION_LABELS: Record<Situation, string> = {
  emergency: '갑자기 아파요',
  car: '차가 고장·사고',
  crime: '사기·범죄 피해',
  home: '집 관련 문제',
  abroad: '해외에 있어요',
  legal: '법률·금융 문제',
};

export function telHref(num: string): string {
  return `tel:${num.replace(/-/g, '')}`;
}

export function iconBgColor(cat: Category): string {
  return `${CAT_COLOR[cat]}1A`;
}
