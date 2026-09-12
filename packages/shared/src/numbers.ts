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
  { id: 'e1', cat: '긴급/안전', icon: '🚑', title: '응급실 비용 없을 때', desc: '국가가 먼저 지급 — 치료 거부는 불법', num: '129', situation: ['emergency'], tip: '119로 이송·치료 먼저, 병원에서 비용 문제로 막히면 129.' },
  { id: 'e2', cat: '긴급/안전', icon: '🔥', title: '화재·구급', desc: '화재·구조·응급출동', num: '119', situation: ['emergency'], tip: '주소·상황·인원을 순서대로. 연기 나면 문 닫고 낮은 자세로 대피 후 신고.' },
  { id: 'e3', cat: '긴급/안전', icon: '👮', title: '범죄·경찰 신고', desc: '출동·문자 신고 가능', num: '112', situation: ['crime'], tip: '말 못 하는 상황이면 112 문자 신고. 위치 권한을 켜 두면 출동이 빨라져요.' },
  { id: 'e4', cat: '긴급/안전', icon: '🏥', title: '응급 병원·약국 안내', desc: '야간·휴일 문 연 병원·약국', num: '1339', situation: ['emergency'], tip: '지역과 증상을 말하면 가까운 응급실·약국을 안내해 줘요.' },
  { id: 'e5', cat: '긴급/안전', icon: '🤝', title: '범죄 피해 지원', desc: '치료·심리상담·법률 연계', num: '1577-2584', situation: ['crime'], tip: '수사와 별개로 피해 회복을 돕는 창구예요. 초기에 연락할수록 좋아요.' },
  { id: 'e6', cat: '긴급/안전', icon: '🌏', title: '해외 긴급상황', desc: '24시간 한국어 영사 지원', num: '02-3210-0404', situation: ['abroad'], tip: '해외에서는 +82-2-3210-0404. 여권 분실·사고·체포 시 현지 조치 후 연락.' },
  { id: 'e7', cat: '긴급/안전', icon: '💚', title: '마음이 힘들 때', desc: '24시간 정신건강 위기 상담', num: '109', situation: ['emergency'], tip: '익명·무료예요. 극단적 생각이 들면 1393도 함께 기억하세요.' },
  { id: 'e13', cat: '긴급/안전', icon: '🫂', title: '자살예방 상담', desc: '24시간 자살예방 전문 상담', num: '1393', situation: ['emergency'], tip: '당장 목숨이 위태로우면 119·112 먼저. 상담은 109·1393.' },
  { id: 'e8', cat: '긴급/안전', icon: '🕵️', title: '간첩신고', desc: '국정원 · 간첩·테러·안보 위협', num: '111', situation: ['crime'], tip: '경찰 방첩은 113. 둘 중 어디로든 신고 가능해요.' },
  { id: 'e9', cat: '긴급/안전', icon: '👮', title: '방첩신고', desc: '경찰청 · 간첩·기술유출·스파이', num: '113', situation: ['crime'], tip: '일시·장소·행동을 구체적으로 남기면 조사가 수월해요.' },
  { id: 'e10', cat: '긴급/안전', icon: '🛡️', title: '통합방위 주민신고', desc: '드론·괴선박·수상한 군사 활동', num: '1338', situation: ['crime'] },
  { id: 'e11', cat: '긴급/안전', icon: '🎖️', title: '군사기밀·군 간첩신고', desc: '군사안보지원사령부 · 방산·기밀', num: '1337', situation: ['crime'], tip: '일반 형사 사건은 112, 군 기밀·방산 스파이 의심은 1337.' },
  { id: 'e12', cat: '긴급/안전', icon: '🚤', title: '해양 긴급·해경', desc: '해상 조난·사고·불법조업', num: '122', situation: ['emergency'], tip: '바다·섬·갯벌에서 위급하면 122. 섬 이름·위치를 정확히.' },
  { id: 'e14', cat: '긴급/안전', icon: '🌫️', title: '환경오염 신고', desc: '악취·투기·수질·대기 오염', num: '128', situation: ['home'], tip: '발생 시각·장소·오염 형태를 구체적으로 말하세요.' },
  { id: 'e15', cat: '긴급/안전', icon: '🧪', title: '식품안전 신고', desc: '식중독·불량식품·허위표시', num: '1399', situation: ['home'], tip: '제품명·구입처·유통기한·사진이 있으면 신고가 빨라요.' },

  { id: 'c1', cat: '교통/차량', icon: '🚛', title: '고속도로 공공렉카', desc: '사설렉카 바가지 NO · 무료 이동', num: '1588-2504', situation: ['car'], tip: '고속도로 사고 시 사설렉카보다 먼저! 공공렉카는 무료 구간이 있어요.' },
  { id: 'c2', cat: '교통/차량', icon: '⚠️', title: '고속도로 긴급견인', desc: '갓길 고장·사고 시 안전지대까지', num: '1588-2100', situation: ['car'], tip: '비상등·삼각대 설치 후 연락. 부상 있으면 119 먼저.' },
  { id: 'c3', cat: '교통/차량', icon: '🚔', title: '교통사고 신고·사실확인', desc: '경찰 출동 · 음주·현장조사', num: '112', situation: ['car', 'crime'], tip: '합의 전에 112로 사실확인을 남겨 두면 분쟁에 유리해요.' },
  { id: 'c4', cat: '교통/차량', icon: '🚑', title: '교통사고 부상·구급', desc: '응급처치 및 병원 이송', num: '119', situation: ['car', 'emergency'] },
  { id: 'c5', cat: '교통/차량', icon: '🛡️', title: '자동차보험 사고접수', desc: '긴급출동·견인·대차 연결', num: '1566-8000', situation: ['car'], tip: '내 보험사 번호도 따로 저장해 두세요. 고속도로는 공공렉카 우선.' },
  { id: 'c6', cat: '교통/차량', icon: '📋', title: '무보험 차량 사고 피해', desc: '상대 무보험·도주 시 보상 안내', num: '1544-0119', situation: ['car', 'legal'] },
  { id: 'c7', cat: '교통/차량', icon: '📍', title: '사고 후 행정·민원 안내', desc: '과태료·면허·보험 민원 연결', num: '110', situation: ['car'] },
  { id: 'c8', cat: '교통/차량', icon: '🚌', title: '대중교통 분실물', desc: '지하철·버스 유실물 통합조회', num: '182', situation: [], tip: '노선·시간·좌석을 기억해 두면 찾기 쉬워요. 실종 신고도 182.' },
  { id: 'c9', cat: '교통/차량', icon: '🚄', title: '철도·KTX 고객센터', desc: '열차 운행·유실물·지연 안내', num: '1544-7788', situation: ['car'], tip: '열차 번호·내린 역·시간을 알려 주세요.' },

  { id: 'h1', cat: '주거/생활', icon: '📦', title: '이사 후 주소 일괄변경', desc: '은행·카드·보험 한번에 변경', num: '1588-1300', situation: ['home'], tip: '이사하면 여기 한 번으로 끝! 은행·보험·카드 주소를 한꺼번에.' },
  { id: 'h2', cat: '주거/생활', icon: '🔊', title: '층간소음 갈등 중재', desc: '전문 중재인 방문 조정', num: '1661-2642', situation: ['home'], tip: '관리사무소로 안 되면 이웃사이센터. 소음 일지가 도움이 돼요.' },
  { id: 'h3', cat: '주거/생활', icon: '🏘️', title: '전세사기 예방·상담', desc: '계약 전 보증금 안전 확인', num: '1566-9009', situation: ['home'], tip: '보증금 보내기 전에 필수. 급매·대리인만 만나면 의심하세요.' },
  { id: 'h4', cat: '주거/생활', icon: '🔥', title: '가스 누출 긴급', desc: '도시가스 24시간 출동', num: '1670-1004', situation: ['home', 'emergency'], tip: '냄새 나면 스위치 만지지 말고 환기·대피 후 신고.' },
  { id: 'h5', cat: '주거/생활', icon: '⚡', title: '전기 고장·정전', desc: '한전 정전·전선 이상 신고', num: '123', situation: ['home', 'emergency'], tip: '감전·화재 위험이면 119 먼저, 단순 정전은 123.' },
  { id: 'h6', cat: '주거/생활', icon: '💧', title: '수도·수질 문의', desc: '수자원공사 · 단수·수질 안내', num: '1577-0600', situation: ['home'], tip: '시내 누수는 지역 120이 더 빠를 수 있어요. 헷갈리면 110.' },
  { id: 'h7', cat: '주거/생활', icon: '🌦️', title: '기상특보·날씨 안내', desc: '태풍·호우·폭염·한파 정보', num: '131', situation: ['home'], tip: '등산·해상·야외 일정 전 특보를 확인하세요.' },

  { id: 'l1', cat: '법률/금융', icon: '⚖️', title: '무료 법률 상담', desc: '변호사 상담·소송 구조', num: '132', situation: ['legal', 'car'], tip: '소송 전에 꼭. 소득 기준에 따라 무료 지원이 가능해요.' },
  { id: 'l2', cat: '법률/금융', icon: '💰', title: '병원비 환급받기', desc: '본인부담상한제 초과 환급', num: '1577-1000', situation: ['legal', 'emergency'], tip: '1년 의료비가 많았는데 환급 안내가 없으면 문의해 보세요.' },
  { id: 'l3', cat: '법률/금융', icon: '🏦', title: '금융 소비자 보호', desc: '불법금융·금융상품 피해', num: '1332', situation: ['crime', 'legal'], tip: '이체를 재촉하면 끊고 1398. 금융상품 불만은 1332.' },
  { id: 'l4', cat: '법률/금융', icon: '📵', title: '보이스피싱 신고', desc: '당하는 중에도 바로 신고', num: '1398', situation: ['crime'], tip: '검찰·금감원 사칭이면 끊고 즉시 1398. 이체 전이 골든타임.' },
  { id: 'l5', cat: '법률/금융', icon: '🔒', title: '개인정보 침해 신고', desc: '유출·도용 · 삭제·차단 안내', num: '1811-9000', situation: ['crime', 'legal'] },
  { id: 'l9', cat: '법률/금융', icon: '💻', title: '사이버범죄·해킹 신고', desc: '랜섬웨어·해킹 · KISA 24시간', num: '118', situation: ['crime'], tip: '보이스피싱은 1398, 해킹·피싱사이트는 118.' },
  { id: 'l10', cat: '법률/금융', icon: '💊', title: '마약·검찰 범죄신고', desc: '마약·특수수사 · 검찰 민원', num: '1301', situation: ['crime'], tip: '즉시 출동이 필요하면 112.' },
  { id: 'l6', cat: '법률/금융', icon: '🧾', title: '소비자 분쟁 조정', desc: '환불 거부·계약 분쟁', num: '1544-0990', situation: ['legal'], tip: '계약서·결제·대화 기록을 준비하세요.' },
  { id: 'l7', cat: '법률/금융', icon: '💸', title: '세금 문의 (국세청)', desc: '소득세·부가세·세무 상담', num: '126', situation: ['legal'] },
  { id: 'l8', cat: '법률/금융', icon: '🏠', title: '지방세 문의', desc: '자동차세·재산세 상담', num: '1661-7600', situation: ['legal'] },
  { id: 'l11', cat: '법률/금융', icon: '⚖️', title: '공정거래 상담', desc: '불공정·표시광고·가맹 분쟁', num: '1372', situation: ['legal'], tip: '개인 환불 분쟁은 소비자원(1544-0990)이 더 맞는 경우도 많아요.' },
  { id: 'l12', cat: '법률/금융', icon: '📉', title: '신용회복·채무조정', desc: '연체·개인회생 연계 상담', num: '1600-5500', situation: ['legal'], tip: '불법 사채보다 먼저 공적 상담을 받으세요.' },
  { id: 'l13', cat: '법률/금융', icon: '☀️', title: '서민금융 상담', desc: '햇살론 등 정책서민금융', num: '1397', situation: ['legal'] },
  { id: 'l14', cat: '법률/금융', icon: '🕊️', title: '인권 상담', desc: '차별·인권침해 상담·진정', num: '1331', situation: ['legal'] },

  { id: 'f1', cat: '가족/복지', icon: '👴', title: '부모님 돌봄 상담', desc: '안부 확인·방문 돌봄 연계', num: '1661-2129', situation: [] },
  { id: 'f2', cat: '가족/복지', icon: '🏫', title: '학교폭력 신고', desc: '전화·문자 신고 가능', num: '117', situation: ['crime'], tip: '학교 내부 조치와 별도로 공적 신고를 검토하세요.' },
  { id: 'f3', cat: '가족/복지', icon: '🆘', title: '여성긴급전화', desc: '가정폭력·성폭력 24시간', num: '1366', situation: ['emergency', 'crime'], tip: '당장 위험하면 112. 상담은 비밀이 보장돼요.' },
  { id: 'f4', cat: '가족/복지', icon: '📷', title: '불법촬영 피해 지원', desc: '영상 삭제·수사 연계', num: '1899-0088', situation: ['crime'], tip: '증거를 함부로 지우지 말고 상담 안내를 따르세요.' },
  { id: 'f5', cat: '가족/복지', icon: '🌍', title: '외국인 종합 안내', desc: '비자·체류 · 다국어 안내', num: '1345', situation: ['abroad'] },
  { id: 'f6', cat: '가족/복지', icon: '🧒', title: '청소년 상담', desc: '학업·가족·진로 익명 상담', num: '1388', situation: [] },
  { id: 'f7', cat: '가족/복지', icon: '👶', title: '국민연금 상담', desc: '수령·납부·수급 문의', num: '1355', situation: [] },
  { id: 'f8', cat: '가족/복지', icon: '🧓', title: '노인학대 신고·상담', desc: '학대·방임 상담 및 보호', num: '1389', situation: ['crime', 'emergency'], tip: '급박하면 112. 경제적 학대·방임도 신고 대상이에요.' },
  { id: 'f9', cat: '가족/복지', icon: '🔎', title: '실종아동·실종자', desc: '실종 신고·찾기 안내', num: '182', situation: ['crime', 'emergency'], tip: '최근 사진·옷차림·마지막 위치를 준비하세요.' },

  { id: 'w1', cat: '고용/노동', icon: '💼', title: '실업급여·고용지원금', desc: '고용노동부 고객상담', num: '1350', situation: [], tip: '임금 체불·부당해고도 1350으로 진정 절차를 안내받을 수 있어요.' },
  { id: 'w2', cat: '고용/노동', icon: '🦺', title: '산재·고용보험', desc: '근로복지공단 상담', num: '1588-0075', situation: [], tip: '업무 중 다쳤다면 산재 신청 기한을 꼭 확인하세요.' },
  { id: 'w3', cat: '고용/노동', icon: '📚', title: '내일배움카드·직업교육', desc: '직업훈련 상담 및 신청', num: '1644-8000', situation: [] },
  { id: 'w4', cat: '고용/노동', icon: '🗣️', title: '직장 내 괴롭힘·성희롱', desc: '고용평등상담 · 구제 안내', num: '1544-4140', situation: ['legal'], tip: '사내 신고가 어렵거나 보복이 걱정될 때 외부 창구로 쓰세요.' },

  { id: 'g1', cat: '민원/행정', icon: '📋', title: '정부 민원 콜센터', desc: '전국 어디서든 민원·기관 연결', num: '110', situation: ['home'], tip: '어디에 전화할지 모르면 일단 110.' },
  { id: 'g2', cat: '민원/행정', icon: '🏙️', title: '서울시 다산콜센터', desc: '서울 관내 120 · 외부는 02-120', num: '02-120', situation: ['home'] },
  { id: 'g4', cat: '민원/행정', icon: '🌳', title: '경기도 콜센터', desc: '경기도민 생활·도정 민원', num: '031-120', situation: ['home'] },
  { id: 'g5', cat: '민원/행정', icon: '🛫', title: '인천시 콜센터', desc: '인천시민 생활·행정 민원', num: '032-120', situation: ['home'] },
  { id: 'g6', cat: '민원/행정', icon: '🌊', title: '부산시 민원120', desc: '부산시민 생활·교통·행정', num: '051-120', situation: ['home'] },
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
  { id: 'g3', cat: '민원/행정', icon: '🪪', title: '주민등록·가족관계', desc: '정부24 · 증명 발급 안내', num: '1588-2188', situation: [] },
  { id: 'g20', cat: '민원/행정', icon: '📦', title: '관세·해외직구 통관', desc: '세관 통관·관세 문의', num: '125', situation: ['abroad'], tip: '운송장 번호·물품명을 준비하세요.' },
  { id: 'g21', cat: '민원/행정', icon: '🎖️', title: '병무청 상담', desc: '병역판정·입영·전역 문의', num: '1588-9090', situation: [] },
];

export const SITUATION_TIPS: Record<Situation, string> = {
  emergency: '💡 응급실에서 비용 없다고 치료 거부하면 안 돼요. 129로 먼저 연락하세요. 마음은 109·1393.',
  car: '💡 사고 나면 부상 있으면 119 → 112 신고 → 고속도로는 1588-2504(공공렉카). 보험은 1566-8000.',
  crime: '💡 보이스피싱 1398 · 해킹·사이버 118 · 간첩 111(국정원)·113(경찰). 급하면 112.',
  home: '💡 전국 민원 110 · 거주 지역은 0XX-120. 정전 123 · 가스 1670-1004 · 이사 주소 1588-1300.',
  abroad: '💡 해외 위험 상황이면 02-3210-0404(+82). 통관·직구는 125.',
  legal: '💡 132 무료 법률 상담. 채무는 1600-5500, 서민금융은 1397.',
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
