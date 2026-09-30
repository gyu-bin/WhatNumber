export type Category =
  | '긴급/안전'
  | '교통/차량'
  | '주거/생활'
  | '법률/금융'
  | '가족/복지'
  | '고용/노동'
  | '민원/행정'
  | '통신/디지털';

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

/**
 * 기업 연락처에만 붙는 운영 메타데이터입니다.
 * 화면은 기존 NumberItem과 동일하게 다루므로 공공번호 UI를 바꾸지 않습니다.
 */
export type OrganizationType = 'insurance' | 'card' | 'bank';

export type ContactPurpose =
  | 'general'
  | 'lost'
  | 'fraud'
  | 'accident'
  | 'roadside'
  | 'emergency';

export interface OrganizationContact extends NumberItem {
  organization: string;
  organizationType: OrganizationType;
  purpose: ContactPurpose;
  keywords: string[];
  available24h?: boolean;
  /** 확인용 공식 URL — 앱 화면에는 노출하지 않습니다. */
  source: string;
  /** 전화번호를 마지막으로 대조한 날짜 (YYYY-MM-DD). */
  verifiedAt: string;
}

export const NUMBERS: NumberItem[] = [
  {
    "id": "e1",
    "cat": "긴급/안전",
    "icon": "🚑",
    "title": "보건복지 상담",
    "desc": "긴급복지·의료비 지원제도 상담",
    "num": "129",
    "situation": [
      "emergency"
    ],
    "tip": "긴급한 구조·구급 상황은 119에 먼저 신고하세요. 의료비 지원 여부와 절차는 상담을 통해 확인하세요."
  },
  {
    "id": "e2",
    "cat": "긴급/안전",
    "icon": "🔥",
    "title": "화재·구조·구급 신고",
    "desc": "화재·구조·응급환자 출동 요청",
    "num": "119",
    "situation": [
      "emergency"
    ],
    "tip": "안전한 곳에서 위치와 상황, 도움이 필요한 인원을 알려주세요."
  },
  {
    "id": "e3",
    "cat": "긴급/안전",
    "icon": "👮",
    "title": "경찰 긴급신고",
    "desc": "범죄·위협 신고 및 경찰 출동 요청",
    "num": "112",
    "situation": [
      "crime"
    ],
    "tip": "신고할 때 위치와 상황을 알려주세요. 말하기 어려운 경우 문자 신고를 이용할 수 있습니다."
  },
  {
    "id": "e4",
    "cat": "긴급/안전",
    "icon": "🏥",
    "title": "질병관리청 1339 콜센터",
    "desc": "감염병·질병 상담 및 신고",
    "num": "1339",
    "situation": [],
    "tip": "감염병·질병 정보, 예방접종과 신고 절차를 상담하세요."
  },
  {
    "id": "e5",
    "cat": "긴급/안전",
    "icon": "🤝",
    "title": "검찰청 범죄피해자 지원",
    "desc": "피해 회복 상담·지원기관 연계",
    "num": "1577-2584",
    "situation": [
      "crime"
    ],
    "tip": "긴급한 범죄·신변 위협은 112에 먼저 신고하세요."
  },
  {
    "id": "e6",
    "cat": "긴급/안전",
    "icon": "🌏",
    "title": "영사안전콜센터",
    "desc": "해외 사건·사고 및 긴급상황 지원",
    "num": "02-3210-0404",
    "situation": [
      "abroad"
    ],
    "tip": "긴급 통역 지원 범위와 현지 대응은 상담원의 안내를 확인하세요."
  },
  {
    "id": "e7",
    "cat": "긴급/안전",
    "icon": "💚",
    "title": "자살예방 상담",
    "desc": "24시간 자살예방 전문 상담",
    "num": "109",
    "situation": [
      "emergency"
    ],
    "tip": "당장 생명이나 신체가 위험한 상황은 119 또는 112에 먼저 도움을 요청하세요."
  },

  {
    "id": "e8",
    "cat": "긴급/안전",
    "icon": "🕵️",
    "title": "국가정보원 안보 신고",
    "desc": "간첩·테러·산업스파이 등 안보 제보",
    "num": "111",
    "situation": [
      "crime"
    ],
    "tip": "국번 없이 111은 무료이며 문자 #0111과 공식 온라인 신고도 안내합니다."
  },
  {
    "id": "e9",
    "cat": "긴급/안전",
    "icon": "👮",
    "title": "경찰 방첩 신고",
    "desc": "간첩·산업기술 유출·테러 신고",
    "num": "113",
    "situation": [
      "crime"
    ],
    "tip": "긴급한 범죄나 신변 위협은 112로 신고하세요."
  },
  {
    "id": "e10",
    "cat": "긴급/안전",
    "icon": "🛡️",
    "title": "군부대 주민 신고",
    "desc": "군 관련 안보 위해 의심상황 신고",
    "num": "1338",
    "situation": [
      "crime"
    ],
    "tip": "수상한 군 관련 상황을 신고하고 긴급 범죄·구조 상황은 112·119에 신고하세요."
  },

  {
    "id": "e14",
    "cat": "긴급/안전",
    "icon": "🌫️",
    "title": "환경오염 신고",
    "desc": "환경오염행위 신고 접수",
    "num": "128",
    "situation": [
      "home"
    ],
    "tip": "발생 장소·시간·오염 현상을 준비하세요. 휴대전화는 지역번호와 128을 함께 누르도록 공식 안내되어 있습니다."
  },
  {
    "id": "e15",
    "cat": "긴급/안전",
    "icon": "🧪",
    "title": "부정·불량식품 신고",
    "desc": "불량식품·표시광고 위반 신고",
    "num": "1399",
    "situation": [
      "home"
    ],
    "tip": "의약품·마약류·의료기기·화장품 민원은 해당 전용 창구를 이용하세요."
  },

  {
    "id": "c1",
    "cat": "교통/차량",
    "icon": "🚛",
    "title": "고속도로 긴급견인 안내",
    "desc": "고장·사고 차량 안전지대 이동 안내",
    "num": "1588-2504",
    "situation": [
      "car"
    ],
    "tip": "안전한 곳으로 대피한 뒤 도로 위치와 차량 상황을 알리고 서비스 대상·견인 범위를 확인하세요."
  },

  {
    "id": "c3",
    "cat": "교통/차량",
    "icon": "🚔",
    "title": "교통사고 긴급 신고",
    "desc": "교통사고 경찰 출동·현장 신고",
    "num": "112",
    "situation": [
      "car",
      "crime"
    ],
    "tip": "사고 위치와 현재 위험 상황을 알리세요. 사실확인원 발급과 일반 민원은 별도 경찰 민원 절차를 확인하세요."
  },
  {
    "id": "c4",
    "cat": "교통/차량",
    "icon": "🚑",
    "title": "교통사고 구조·구급",
    "desc": "사고 부상자 응급출동 요청",
    "num": "119",
    "situation": [
      "car",
      "emergency"
    ],
    "tip": "위치·부상자 상태·인원을 알리고 응급처치 안내를 따르세요."
  },
  // c5(1566-8000)는 한화손보 번호와 겹쳐 제거 — 보험사별 번호는 ORGANIZATION_CONTACTS 참고
  {
    "id": "c6",
    "cat": "교통/차량",
    "icon": "📋",
    "title": "뺑소니·무보험 사고 피해 지원",
    "desc": "정부보장사업 보상 상담",
    "num": "1544-0049",
    "situation": [
      "car",
      "legal"
    ],
    "tip": "보상 여부와 필요 서류는 상담을 통해 확인하세요. 모든 사고나 재산 피해를 보상한다는 의미는 아닙니다."
  },
  {
    "id": "c7",
    "cat": "교통/차량",
    "icon": "📍",
    "title": "교통 행정·민원 안내",
    "desc": "교통·면허 등 관련 기관 상담 안내",
    "num": "110",
    "situation": [
      "car"
    ],
    "tip": "365일24시간 무료 전화상담을 제공하며 긴급 사고 출동은 112·119로 요청하세요."
  },
  {
    "id": "c8",
    "cat": "교통/차량",
    "icon": "🚌",
    "title": "경찰 유실물 문의",
    "desc": "LOST112 분실물 신고·조회 안내",
    "num": "182",
    "situation": [],
    "tip": "LOST112에서 신고·조회하거나 182로 문의하세요. 대중교통 운영사의 자체 분실물센터도 확인하세요."
  },
  {
    "id": "c9",
    "cat": "교통/차량",
    "icon": "🚄",
    "title": "코레일 철도 고객센터",
    "desc": "열차·승차권 이용 문의",
    "num": "1544-7788",
    "situation": [
      "car"
    ],
    "tip": "상담 운영시간과 유실물·환불 절차는 코레일 공식 안내 또는 연결 시 안내를 확인하세요."
  },

  {
    "id": "h1",
    "cat": "주거/생활",
    "icon": "📦",
    "title": "우체국 주거이전 우편 안내",
    "desc": "이사 후 우편물 전송서비스 안내",
    "num": "1588-1300",
    "situation": [
      "home"
    ],
    "tip": "우편물 전송 조건·기간·수수료를 확인하세요. 은행·카드·보험의 등록 주소는 별도로 변경해야 합니다."
  },
  {
    "id": "h2",
    "cat": "주거/생활",
    "icon": "🔊",
    "title": "층간소음 상담·측정",
    "desc": "공동주택 층간소음 상담·현장 지원",
    "num": "1661-2642",
    "situation": [
      "home"
    ],
    "tip": "강제 조정이나 분쟁 해결을 보장하지 않습니다. 접수 가능 대상·절차를 상담에서 확인하세요."
  },
  {
    "id": "h3",
    "cat": "주거/생활",
    "icon": "🏘️",
    "title": "HUG 전세보증 상담",
    "desc": "전세보증·주택도시기금 상담",
    "num": "1566-9009",
    "situation": [
      "home"
    ],
    "tip": "전세보증 상품의 가입 요건·보장 범위를 확인하세요. 전세피해지원 상담은 별도 창구입니다."
  },

  {
    "id": "h5",
    "cat": "주거/생활",
    "icon": "⚡",
    "title": "한전 전기 고장·정전 신고",
    "desc": "전기상담·고장 신고",
    "num": "123",
    "situation": [
      "home",
      "emergency"
    ],
    "tip": "화재·감전 등 긴급한 위험은119에 먼저 도움을 요청하세요."
  },
  {
    "id": "h6",
    "cat": "주거/생활",
    "icon": "💧",
    "title": "K-water 고객센터",
    "desc": "수자원공사 수도 관련 문의",
    "num": "1577-0600",
    "situation": [
      "home"
    ],
    "tip": "K-water가 담당하지 않는 지역은 관할 지자체 상수도 창구를 확인하고 담당 기관을 모르면110에 문의하세요."
  },
  {
    "id": "h7",
    "cat": "주거/생활",
    "icon": "🌦️",
    "title": "기상청 날씨 상담",
    "desc": "기상특보·예보 상담",
    "num": "131",
    "situation": [
      "home"
    ],
    "tip": "태풍·호우·폭염·한파 등 기상특보와 예보를 문의할 수 있습니다."
  },

  {
    "id": "l1",
    "cat": "법률/금융",
    "icon": "⚖️",
    "title": "법률 상담",
    "desc": "법률상담 · 소송구조 요건 안내",
    "num": "132",
    "situation": [
      "legal",
      "car"
    ]
  },
  {
    "id": "l2",
    "cat": "법률/금융",
    "icon": "💰",
    "title": "건강보험·본인부담상한제",
    "desc": "보험료·급여·환급 안내",
    "num": "1577-1000",
    "situation": [
      "legal",
      "emergency"
    ]
  },
  {
    "id": "l3",
    "cat": "법률/금융",
    "icon": "🏦",
    "title": "금융 소비자 상담",
    "desc": "금융상품·불법금융 피해 상담",
    "num": "1332",
    "situation": [
      "crime",
      "legal"
    ],
    "tip": "금융 상품·불법금융은1332, 피싱 상담·제보는1394로 문의하세요. 긴급 범죄는112입니다."
  },
  {
    "id": "l4",
    "cat": "법률/금융",
    "icon": "📵",
    "title": "보이스피싱·스미싱 신고",
    "desc": "피싱안심SOS 통합 제보 안내",
    "num": "1394",
    "situation": [
      "crime"
    ],
    "tip": "피싱이 의심되면 통화를 종료하고 1394로 상담·제보하세요. 당장 범죄 피해나 위협이 있으면 112로 신고하세요."
  },
  {
    "id": "l5",
    "cat": "통신/디지털",
    "icon": "🔒",
    "title": "개인정보 침해 상담·신고",
    "desc": "개인정보 유출·침해 상담",
    "num": "118",
    "situation": [
      "crime",
      "legal"
    ],
    "tip": "개인정보 유출·침해 사실과 관련 자료를 준비해 상담하세요."
  },
  {
    "id": "l9",
    "cat": "통신/디지털",
    "icon": "💻",
    "title": "해킹·인터넷 침해 상담",
    "desc": "랜섬웨어·해킹·피싱사이트 상담",
    "num": "118",
    "situation": [
      "crime"
    ],
    "tip": "118은 인터넷 침해사고 상담입니다. 긴급 범죄 신고는112, 피싱 통합 제보는1394입니다."
  },
  {
    "id": "l10",
    "cat": "법률/금융",
    "icon": "💊",
    "title": "검찰 민원 상담",
    "desc": "사건·벌과금 등 검찰 업무 안내",
    "num": "1301",
    "situation": [
      "crime"
    ]
  },
  {
    "id": "d1",
    "cat": "통신/디지털",
    "icon": "📡",
    "title": "과기정통부 민원 안내",
    "desc": "정보통신 등 소관 업무 문의",
    "num": "1335",
    "situation": []
  },
  {
    "id": "d2",
    "cat": "통신/디지털",
    "icon": "☎️",
    "title": "휴대폰 통신사 고객센터",
    "desc": "가입 통신사의 요금·서비스 문의",
    "num": "114",
    "situation": [],
    "tip": "가입한 휴대폰에서 지역번호 없이114로 문의하세요. 알뜰폰은 해당 사업자 안내를 확인하세요."
  },
  {
    "id": "d3",
    "cat": "통신/디지털",
    "icon": "📺",
    "title": "방송·통신 심의 신고",
    "desc": "유해·불법 방송·통신 심의 안내",
    "num": "1377",
    "situation": []
  },
  {
    "id": "d4",
    "cat": "통신/디지털",
    "icon": "📵",
    "title": "불법스팸 신고·상담",
    "desc": "스팸문자·스팸전화 신고 안내",
    "num": "118",
    "situation": [
      "crime"
    ],
    "tip": "스팸은118, 피싱 상담·제보는1394입니다. 당장 범죄 위험이 있으면112로 신고하세요."
  },

  {
    "id": "l7",
    "cat": "법률/금융",
    "icon": "💸",
    "title": "국세 상담",
    "desc": "소득세·부가세·국세 문의",
    "num": "126",
    "situation": [
      "legal"
    ]
  },

  {
    "id": "l11",
    "cat": "법률/금융",
    "icon": "⚖️",
    "title": "소비자 상담센터",
    "desc": "거래·계약·소비자 피해 상담",
    "num": "1372",
    "situation": [
      "legal"
    ],
    "tip": "거래내역·계약서 등 관련 자료를 준비하세요."
  },
  {
    "id": "l12",
    "cat": "법률/금융",
    "icon": "📉",
    "title": "신용회복·채무조정 상담",
    "desc": "채무조정 제도·신청 안내",
    "num": "1600-5500",
    "situation": [
      "legal"
    ]
  },
  {
    "id": "l13",
    "cat": "법률/금융",
    "icon": "☀️",
    "title": "서민금융 상담",
    "desc": "정책서민금융 상품·지원 안내",
    "num": "1397",
    "situation": [
      "legal"
    ]
  },
  {
    "id": "l14",
    "cat": "법률/금융",
    "icon": "🕊️",
    "title": "인권 상담",
    "desc": "인권침해·차별 상담·진정 안내",
    "num": "1331",
    "situation": [
      "legal"
    ]
  },

  {
    "id": "f1",
    "cat": "가족/복지",
    "icon": "👴",
    "title": "노인 돌봄 지원 문의",
    "desc": "중앙노인돌봄지원기관 안내",
    "num": "1661-2129",
    "situation": []
  },
  {
    "id": "f2",
    "cat": "가족/복지",
    "icon": "🏫",
    "title": "학교폭력 신고",
    "desc": "전화117 · 문자#0117",
    "num": "117",
    "situation": [
      "crime"
    ],
    "tip": "전화117, 문자#0117로 신고하세요. 당장 위험하면112로 신고하세요."
  },
  {
    "id": "f3",
    "cat": "가족/복지",
    "icon": "🆘",
    "title": "여성긴급전화",
    "desc": "여성폭력 긴급 상담·지원 연계",
    "num": "1366",
    "situation": [
      "emergency",
      "crime"
    ],
    "tip": "당장 신변이 위험하면112로 신고하세요."
  },
  {
    "id": "f4",
    "cat": "가족/복지",
    "icon": "📷",
    "title": "디지털성범죄 피해 지원",
    "desc": "피해 상담·삭제지원·기관 연계",
    "num": "02-735-8994",
    "situation": [
      "crime"
    ]
  },
  {
    "id": "f5",
    "cat": "가족/복지",
    "icon": "🌍",
    "title": "외국인 종합 안내",
    "desc": "비자·체류·출입국 다국어 상담",
    "num": "1345",
    "situation": [
      "abroad"
    ]
  },
  {
    "id": "f6",
    "cat": "가족/복지",
    "icon": "🧒",
    "title": "청소년 상담",
    "desc": "청소년·보호자 고민 상담",
    "num": "1388",
    "situation": []
  },
  {
    "id": "f7",
    "cat": "가족/복지",
    "icon": "👶",
    "title": "국민연금 상담",
    "desc": "가입·납부·연금 수급 문의",
    "num": "1355",
    "situation": []
  },
  {
    "id": "f8",
    "cat": "가족/복지",
    "icon": "🧓",
    "title": "노인학대 신고·상담",
    "desc": "학대·방임 신고와 보호 안내",
    "num": "1577-1389",
    "situation": [
      "crime",
      "emergency"
    ],
    "tip": "학대·방임이 의심되면 상담하세요. 당장 위험하면112로 신고하세요."
  },
  {
    "id": "f9",
    "cat": "가족/복지",
    "icon": "🔎",
    "title": "실종아동·실종자 안내",
    "desc": "실종 관련 경찰 상담",
    "num": "182",
    "situation": [
      "crime",
      "emergency"
    ]
  },

  {
    "id": "w1",
    "cat": "고용/노동",
    "icon": "💼",
    "title": "고용·노동 상담",
    "desc": "실업급여·근로기준·고용지원 안내",
    "num": "1350",
    "situation": []
  },
  {
    "id": "w2",
    "cat": "고용/노동",
    "icon": "🦺",
    "title": "산재·고용보험 상담",
    "desc": "근로복지공단 제도 안내",
    "num": "1588-0075",
    "situation": []
  },
  {
    "id": "w3",
    "cat": "고용/노동",
    "icon": "📚",
    "title": "내일배움카드·직업훈련",
    "desc": "국민내일배움카드 제도 안내",
    "num": "1350",
    "situation": []
  },
  {
    "id": "w4",
    "cat": "고용/노동",
    "icon": "🗣️",
    "title": "직장 내 괴롭힘·노동 상담",
    "desc": "고용노동부 근로기준 상담 안내",
    "num": "1350",
    "situation": [
      "legal"
    ]
  },

  {
    "id": "g1",
    "cat": "민원/행정",
    "icon": "📋",
    "title": "정부 민원 안내",
    "desc": "정부 업무·민원 상담",
    "num": "110",
    "situation": [
      "home"
    ]
  },
  {
    "id": "g2",
    "cat": "민원/행정",
    "icon": "🏙️",
    "title": "서울시 다산콜센터",
    "desc": "서울 생활·행정 민원 안내",
    "num": "02-120",
    "situation": [
      "home"
    ]
  },
  {
    "id": "g4",
    "cat": "민원/행정",
    "icon": "🌳",
    "title": "경기도 콜센터",
    "desc": "경기도 생활·도정 민원",
    "num": "031-120",
    "situation": [
      "home"
    ]
  },
  {
    "id": "g5",
    "cat": "민원/행정",
    "icon": "🛫",
    "title": "인천시 미추홀콜센터",
    "desc": "인천 생활·행정 민원",
    "num": "032-120",
    "situation": [
      "home"
    ]
  },
  {
    "id": "g6",
    "cat": "민원/행정",
    "icon": "🌊",
    "title": "부산시120바로콜센터",
    "desc": "부산 생활·행정 민원",
    "num": "051-120",
    "situation": [
      "home"
    ]
  },
  {
    "id": "g7",
    "cat": "민원/행정",
    "icon": "🏔️",
    "title": "대구시 달구벌콜센터",
    "desc": "대구 생활·행정 민원",
    "num": "053-120",
    "situation": [
      "home"
    ]
  },
  {
    "id": "g8",
    "cat": "민원/행정",
    "icon": "☀️",
    "title": "빛고을콜센터",
    "desc": "광주 지역 생활·행정 문의",
    "num": "062-120",
    "situation": [
      "home"
    ]
  },
  {
    "id": "g9",
    "cat": "민원/행정",
    "icon": "🏛️",
    "title": "대전시120콜센터",
    "desc": "대전 생활·행정 민원",
    "num": "042-120",
    "situation": [
      "home"
    ]
  },
  {
    "id": "g10",
    "cat": "민원/행정",
    "icon": "🏭",
    "title": "울산시120민원센터",
    "desc": "울산 생활·행정 민원",
    "num": "052-120",
    "situation": [
      "home"
    ]
  },
  {
    "id": "g11",
    "cat": "민원/행정",
    "icon": "🏡",
    "title": "세종시 민원콜센터",
    "desc": "세종 생활·행정 민원",
    "num": "044-120",
    "situation": [
      "home"
    ]
  },
  {
    "id": "g12",
    "cat": "민원/행정",
    "icon": "⛰️",
    "title": "강원특별자치도 콜센터",
    "desc": "강원 생활·도정 민원",
    "num": "033-120",
    "situation": [
      "home"
    ]
  },

  {
    "id": "g18",
    "cat": "민원/행정",
    "icon": "🌺",
    "title": "경상남도120콜센터",
    "desc": "경남 생활·도정 민원",
    "num": "055-120",
    "situation": [
      "home"
    ]
  },
  {
    "id": "g19",
    "cat": "민원/행정",
    "icon": "🏝️",
    "title": "제주특별자치도 콜센터",
    "desc": "제주 생활·행정 민원",
    "num": "064-120",
    "situation": [
      "home"
    ]
  },
  {
    "id": "g3",
    "cat": "민원/행정",
    "icon": "🪪",
    "title": "정부24 이용 안내",
    "desc": "온라인 민원·증명 발급 이용 문의",
    "num": "1588-2188",
    "situation": []
  },
  {
    "id": "g20",
    "cat": "민원/행정",
    "icon": "📦",
    "title": "관세·해외직구 통관",
    "desc": "통관·관세·밀수신고 안내",
    "num": "125",
    "situation": [
      "abroad"
    ]
  },
  {
    "id": "g21",
    "cat": "민원/행정",
    "icon": "🎖️",
    "title": "병무청 상담",
    "desc": "병역판정·입영·병무 민원",
    "num": "1588-9090",
    "situation": []
  },
];

export const SITUATION_TIPS: Record<Situation, string> = {
  emergency: '생명이 위급하면 119, 자살예방 상담은 109입니다. 의료비 지원제도는 129에서 확인하세요.',
  car: '부상·구조는 119, 긴급 교통사고 신고는 112. 고속도로 견인 범위는 1588-2504에 문의하세요.',
  crime: '긴급 범죄 신고는 112, 피싱 상담·제보는 1394, 인터넷 침해사고 상담은 118입니다.',
  home: '담당 기관을 모르면 110에 문의하세요. 전기 고장 신고는 지역번호+123, 가스 사고 등 긴급 위험은 119입니다.',
  abroad: '해외 사건·사고는 영사안전콜센터 +82-2-3210-0404, 통관·관세 상담은 125입니다.',
  legal: '법률 상담은 132, 채무조정 상담은 1600-5500입니다. 통화요금과 지원 요건을 확인하세요.',
};

export const CAT_COLOR: Record<Category, string> = {
  '긴급/안전': '#D94F3D',
  '교통/차량': '#3B6FD4',
  '주거/생활': '#3A7D44',
  '법률/금융': '#B45309',
  '가족/복지': '#6D4ACA',
  '고용/노동': '#0D7490',
  '민원/행정': '#4A4A47',
  '통신/디지털': '#4F46E5',
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
  { id: '통신/디지털', label: '통신·디지털' },
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
  return NUMBERS.find((n) => n.id === resolveContactId(id));
}

/** Canonical IDs for services merged during the 2026-09-30 official-source audit. */
export const CONTACT_ID_ALIASES: Record<string, string> = {
  e13: 'e7',
  e12: 'e2',
  c2: 'c1',
  l6: 'l11',
};

export function resolveContactId(id: string): string {
  return CONTACT_ID_ALIASES[id] ?? id;
}

/** Preserve order and unknown string IDs; removed IDs are safely skipped by consumers. */
export function normalizeFavoriteIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((id): id is string => typeof id === 'string' && id.length > 0).map(resolveContactId))];
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

/** 위젯 Link(destination)용 — URL 파서에 더 안정적인 tel:// 형식 */
export function telWidgetHref(num: string): string {
  return `tel://${num.replace(/-/g, '')}`;
}

export function iconBgColor(cat: Category): string {
  return `${CAT_COLOR[cat]}1A`;
}
