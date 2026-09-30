import type { OrganizationContact } from './numbers';

/**
 * 공공 긴급번호와 구분해 관리하는 기업 긴급 연락처입니다.
 * 번호는 각 기관의 공식 고객센터/사고신고 페이지로만 확인해 수록합니다.
 */
export const ORGANIZATION_CONTACTS: OrganizationContact[] = [
  {
    "id": "org-ins-samsung-auto",
    "cat": "교통/차량",
    "icon": "🚗",
    "title": "삼성화재 자동차 사고·긴급출동",
    "desc": "사고접수·고장출동 ARS",
    "num": "1588-5114",
    "situation": [
      "car"
    ],
    "tip": "ARS 1번 사고접수, 2번 고장출동.",
    "organization": "삼성화재",
    "organizationType": "insurance",
    "purpose": "accident",
    "keywords": [
      "자동차 사고",
      "차 사고",
      "교통사고",
      "차 고장",
      "긴급출동",
      "견인",
      "배터리 방전",
      "타이어 펑크",
      "보험 사고접수"
    ],
    "available24h": true,
    "source": "https://d.samsungfire.com/claim/submain.html",
    "verifiedAt": "2026-09-30"
  },
  {
    "id": "org-ins-db-auto",
    "cat": "교통/차량",
    "icon": "🚗",
    "title": "DB손해보험 사고·긴급출동",
    "desc": "자동차 사고접수·고장출동",
    "num": "1588-0100",
    "situation": [
      "car"
    ],
    "organization": "DB손해보험",
    "organizationType": "insurance",
    "purpose": "accident",
    "keywords": [
      "자동차 사고",
      "차 사고",
      "교통사고",
      "차 고장",
      "긴급출동",
      "견인",
      "배터리 방전",
      "타이어 펑크",
      "보험 사고접수"
    ],
    "source": "https://www.directdb.co.kr/mainView.do?cmd=main",
    "verifiedAt": "2026-09-30",
    "tip": "자동차 사고접수·고장출동은 해당 보험계약의 보장 조건을 확인하세요."
  },
  {
    "id": "org-ins-kb-auto",
    "cat": "교통/차량",
    "icon": "🚗",
    "title": "KB손해보험 사고·긴급출동",
    "desc": "자동차 사고접수·고장출동",
    "num": "1544-0114",
    "situation": [
      "car"
    ],
    "organization": "KB손해보험",
    "organizationType": "insurance",
    "purpose": "accident",
    "keywords": [
      "자동차 사고",
      "차 사고",
      "교통사고",
      "차 고장",
      "긴급출동",
      "견인",
      "배터리 방전",
      "타이어 펑크",
      "보험 사고접수"
    ],
    "available24h": true,
    "source": "https://www.kbinsure.co.kr/main.ec?jjout=Y",
    "verifiedAt": "2026-09-30"
  },
  {
    "id": "org-ins-hyundai-auto",
    "cat": "교통/차량",
    "icon": "🚗",
    "title": "현대해상 자동차 사고·긴급출동",
    "desc": "사고접수·고장출동 ARS",
    "num": "1588-5656",
    "situation": [
      "car"
    ],
    "tip": "ARS 1번은 고장출동, 2번은 사고접수입니다.",
    "organization": "현대해상",
    "organizationType": "insurance",
    "purpose": "accident",
    "keywords": [
      "현대해상",
      "자동차 사고",
      "차 사고",
      "교통사고",
      "차 고장",
      "긴급출동",
      "견인",
      "배터리 방전",
      "타이어 펑크",
      "보험 사고접수"
    ],
    "available24h": true,
    "source": "https://cardirect-direct.hi.co.kr/service.do?m=483ee197fc",
    "verifiedAt": "2026-09-30"
  },
  {
    "id": "org-ins-meritz-auto",
    "cat": "교통/차량",
    "icon": "🚗",
    "title": "메리츠화재 자동차 사고·긴급출동",
    "desc": "사고접수·긴급출동",
    "num": "1566-7711",
    "situation": [
      "car"
    ],
    "organization": "메리츠화재",
    "organizationType": "insurance",
    "purpose": "accident",
    "keywords": [
      "메리츠화재",
      "메리츠",
      "자동차 사고",
      "차 사고",
      "교통사고",
      "차 고장",
      "긴급출동",
      "견인",
      "배터리 방전",
      "타이어 펑크",
      "보험 사고접수"
    ],
    "source": "https://store.meritzfire.com/main.do",
    "verifiedAt": "2026-09-30"
  },
  {
    "id": "org-ins-hanwha-auto",
    "cat": "교통/차량",
    "icon": "🚗",
    "title": "한화손해보험 사고·보상 문의",
    "desc": "한화손보 고객의 사고·보상 상담",
    "num": "1566-8000",
    "situation": [
      "car"
    ],
    "tip": "한화손해보험의 사고·보상 관련 업무를 문의하세요. 보험계약의 보장 조건을 확인하세요.",
    "organization": "한화손해보험",
    "organizationType": "insurance",
    "purpose": "accident",
    "keywords": [
      "한화손해보험",
      "한화손보",
      "자동차 사고",
      "차 사고",
      "교통사고",
      "차 고장",
      "긴급출동",
      "견인",
      "배터리 방전",
      "타이어 펑크",
      "보험 사고접수"
    ],
    "source": "https://carinfo.knia.or.kr/lmxsrv/cnswc/icnyCnswcList.do",
    "verifiedAt": "2026-09-30"
  },
  {
    "id": "org-ins-lotte-auto",
    "cat": "교통/차량",
    "icon": "🚗",
    "title": "롯데손해보험 사고·긴급출동",
    "desc": "사고접수·고장출동 24시간",
    "num": "1588-3344",
    "situation": [
      "car"
    ],
    "tip": "ARS 1번은 고장출동, 2번은 사고접수입니다.",
    "organization": "롯데손해보험",
    "organizationType": "insurance",
    "purpose": "accident",
    "keywords": [
      "롯데손해보험",
      "롯데손보",
      "자동차 사고",
      "차 사고",
      "교통사고",
      "차 고장",
      "긴급출동",
      "견인",
      "배터리 방전",
      "타이어 펑크",
      "보험 사고접수"
    ],
    "available24h": true,
    "source": "https://www.lotteins.co.kr/web/C/D/I/popcdi010_ars.jsp",
    "verifiedAt": "2026-09-30"
  },
  {
    "id": "org-ins-heungkuk-auto",
    "cat": "교통/차량",
    "icon": "🚗",
    "title": "흥국화재 자동차 사고·긴급출동",
    "desc": "사고접수·고장출동 24시간",
    "num": "1688-1688",
    "situation": [
      "car"
    ],
    "tip": "ARS 1번은 사고접수, 2번은 고장 긴급출동입니다.",
    "organization": "흥국화재",
    "organizationType": "insurance",
    "purpose": "accident",
    "keywords": [
      "흥국화재",
      "자동차 사고",
      "차 사고",
      "교통사고",
      "차 고장",
      "긴급출동",
      "견인",
      "배터리 방전",
      "타이어 펑크",
      "보험 사고접수"
    ],
    "available24h": true,
    "source": "https://m.heungkukfire.co.kr/servicecenter/uinf/CCSIN0301_M01/CCSIN0301_M01.do",
    "verifiedAt": "2026-09-30"
  },
  {
    "id": "org-ins-mg-auto",
    "cat": "교통/차량",
    "icon": "🚗",
    "title": "예별손해보험 사고·긴급출동",
    "desc": "구 MG손보 계약 · 사고·고장출동",
    "num": "1588-5959",
    "situation": [
      "car"
    ],
    "organization": "예별손해보험",
    "organizationType": "insurance",
    "purpose": "accident",
    "keywords": [
      "예별손해보험",
      "예별손보",
      "MG손해보험",
      "MG손보",
      "자동차 사고",
      "긴급출동",
      "보험 사고접수"
    ],
    "source": "https://www.yebyeol.co.kr/HP021250DM.scp?menuId=MN0603001",
    "verifiedAt": "2026-09-30",
    "tip": "MG손해보험에서 이전된 보험계약은 예별손해보험으로 문의하세요. 고장출동은 가입 특약 조건에 따라 제공됩니다."
  },
  {
    "id": "org-ins-axa-auto",
    "cat": "교통/차량",
    "icon": "🚗",
    "title": "AXA손해보험 사고·긴급출동",
    "desc": "사고접수·고장출동 24시간",
    "num": "1566-1566",
    "situation": [
      "car"
    ],
    "tip": "ARS 2번은 고장출동, 3번은 사고접수입니다.",
    "organization": "AXA손해보험",
    "organizationType": "insurance",
    "purpose": "accident",
    "keywords": [
      "AXA손해보험",
      "AXA",
      "악사",
      "자동차 사고",
      "차 사고",
      "교통사고",
      "차 고장",
      "긴급출동",
      "견인",
      "배터리 방전",
      "타이어 펑크",
      "보험 사고접수"
    ],
    "available24h": true,
    "source": "https://www.axa.co.kr/cms/benefit/cyms0304/cyms030401/CMKBEI01M01_CMS001.html",
    "verifiedAt": "2026-09-30"
  },
  {
    "id": "org-ins-hana-auto",
    "cat": "교통/차량",
    "icon": "🚗",
    "title": "하나손해보험 사고·긴급출동",
    "desc": "사고접수·고장출동 24시간",
    "num": "1566-3000",
    "situation": [
      "car"
    ],
    "tip": "ARS 1번은 고장출동, 2번은 사고접수입니다.",
    "organization": "하나손해보험",
    "organizationType": "insurance",
    "purpose": "accident",
    "keywords": [
      "하나손해보험",
      "하나손보",
      "자동차 사고",
      "차 사고",
      "교통사고",
      "차 고장",
      "긴급출동",
      "견인",
      "배터리 방전",
      "타이어 펑크",
      "보험 사고접수"
    ],
    "available24h": true,
    "source": "https://www.hanainsure.co.kr/w/customer/homepageInfo/customerWork",
    "verifiedAt": "2026-09-30"
  },

  {
    "id": "org-card-hyundai-lost",
    "cat": "법률/금융",
    "icon": "💳",
    "title": "현대카드 도난·분실 신고",
    "desc": "카드 분실·도난·보이스피싱",
    "num": "1577-6200",
    "situation": [
      "crime",
      "legal"
    ],
    "organization": "현대카드",
    "organizationType": "card",
    "purpose": "lost",
    "keywords": [
      "카드 잃어버림",
      "카드 잃어버렸어",
      "카드 분실",
      "신용카드 분실",
      "카드 도난",
      "지갑 잃어버림",
      "해외 카드 분실",
      "카드 정지",
      "보이스피싱"
    ],
    "available24h": true,
    "source": "https://mycompany.hyundaicard.com/cs/cl/CSCL1002.do?_method=l",
    "verifiedAt": "2026-09-30"
  },
  {
    "id": "org-card-samsung-lost",
    "cat": "법률/금융",
    "icon": "💳",
    "title": "삼성카드 분실·한도승인",
    "desc": "카드 분실·금융사고 신고",
    "num": "1588-8900",
    "situation": [
      "crime",
      "legal"
    ],
    "organization": "삼성카드",
    "organizationType": "card",
    "purpose": "lost",
    "keywords": [
      "카드 잃어버림",
      "카드 잃어버렸어",
      "카드 분실",
      "신용카드 분실",
      "카드 도난",
      "지갑 잃어버림",
      "해외 카드 분실",
      "카드 정지",
      "보이스피싱"
    ],
    "available24h": true,
    "source": "https://www.samsungcard.com/personal/customer-service/ars/UHPPCC0221M0.jsp?click=gnb_customer_ars",
    "verifiedAt": "2026-09-30",
    "tip": "ARS 1번은 분실신고·해제·조회, 9번은 보이스피싱 등 금융사고 신고입니다."
  },
  {
    "id": "org-card-lotte-lost",
    "cat": "법률/금융",
    "icon": "💳",
    "title": "롯데카드 분실·승인",
    "desc": "카드 분실·도난 신고",
    "num": "1588-8300",
    "situation": [
      "crime",
      "legal"
    ],
    "organization": "롯데카드",
    "organizationType": "card",
    "purpose": "lost",
    "keywords": [
      "카드 잃어버림",
      "카드 잃어버렸어",
      "카드 분실",
      "신용카드 분실",
      "카드 도난",
      "지갑 잃어버림",
      "해외 카드 분실",
      "카드 정지"
    ],
    "available24h": true,
    "source": "https://mweb2.lottecard.co.kr/app/LPCSTEA_V100.lc",
    "verifiedAt": "2026-09-30"
  },
  {
    "id": "org-card-shinhan-lost",
    "cat": "법률/금융",
    "icon": "💳",
    "title": "신한카드 분실·도난 신고",
    "desc": "카드 분실·도난·승인 신고",
    "num": "1544-7200",
    "situation": [
      "crime",
      "legal"
    ],
    "organization": "신한카드",
    "organizationType": "card",
    "purpose": "lost",
    "keywords": [
      "신한카드",
      "카드 분실",
      "카드 도난",
      "지갑 잃어버림",
      "카드 정지",
      "거래 승인"
    ],
    "source": "https://www.shinhancard.com/conts/store/customor_center/ars_gu/cardLost.jsp",
    "verifiedAt": "2026-09-30",
    "tip": "ARS 1번에서 카드분실신고·해제·분실접수 확인을 선택하세요."
  },
  {
    "id": "org-card-kb-lost",
    "cat": "법률/금융",
    "icon": "💳",
    "title": "KB국민카드 분실·가맹점승인",
    "desc": "카드 분실·도난·가맹점 승인",
    "num": "1588-1788",
    "situation": [
      "crime",
      "legal"
    ],
    "organization": "KB국민카드",
    "organizationType": "card",
    "purpose": "lost",
    "keywords": [
      "KB국민카드",
      "국민카드",
      "카드 잃어버림",
      "카드 잃어버렸어",
      "카드 분실",
      "신용카드 분실",
      "카드 도난",
      "지갑 잃어버림",
      "해외 카드 분실",
      "카드 정지",
      "보이스피싱"
    ],
    "available24h": true,
    "source": "https://card.kbcard.com/SVC/DVIEW/HSGMCXCRSCSC0030",
    "verifiedAt": "2026-09-30",
    "tip": "ARS 2번은 도난·분실 신고 및 해제입니다."
  },
  {
    "id": "org-card-woori-lost",
    "cat": "법률/금융",
    "icon": "💳",
    "title": "우리카드 분실 신고",
    "desc": "카드 분실·도난·보이스피싱",
    "num": "1588-5300",
    "situation": [
      "crime",
      "legal"
    ],
    "organization": "우리카드",
    "organizationType": "card",
    "purpose": "lost",
    "keywords": [
      "우리카드",
      "카드 잃어버림",
      "카드 잃어버렸어",
      "카드 분실",
      "신용카드 분실",
      "카드 도난",
      "지갑 잃어버림",
      "해외 카드 분실",
      "카드 정지",
      "보이스피싱"
    ],
    "available24h": true,
    "source": "https://pc.wooricard.com/dcpc/yh1/cct/cct04/H1CCT204S06.do",
    "verifiedAt": "2026-09-30",
    "tip": "ARS 1번은 개인카드 분실, 2번은 기업카드 분실, 0번은 보이스피싱 등 금융사고 신고입니다."
  },
  {
    "id": "org-card-hana-lost",
    "cat": "법률/금융",
    "icon": "💳",
    "title": "하나카드 분실·도난 신고",
    "desc": "카드 분실·도난·부정사용",
    "num": "1800-1111",
    "situation": [
      "crime",
      "legal"
    ],
    "tip": "대표번호 ARS 8번에서 분실·금융사고 신고를 선택하세요. 도난·분실 전용 번호는 1599-1133입니다.",
    "organization": "하나카드",
    "organizationType": "card",
    "purpose": "lost",
    "keywords": [
      "하나카드",
      "카드 잃어버림",
      "카드 잃어버렸어",
      "카드 분실",
      "신용카드 분실",
      "카드 도난",
      "지갑 잃어버림",
      "해외 카드 분실",
      "카드 정지",
      "보이스피싱"
    ],
    "available24h": true,
    "source": "https://www.hanacard.co.kr/jsp/wcms/scd/sa/OSA10200000P.jsp",
    "verifiedAt": "2026-09-30"
  },
  {
    "id": "org-card-nh-lost",
    "cat": "법률/금융",
    "icon": "💳",
    "title": "NH농협카드 분실·도난 신고",
    "desc": "카드 분실·도난 신고",
    "num": "1644-4000",
    "situation": [
      "crime",
      "legal"
    ],
    "tip": "ARS 1-1번은 분실신고, 1-4번은 금융사기 신고입니다.",
    "organization": "NH농협카드",
    "organizationType": "card",
    "purpose": "lost",
    "keywords": [
      "NH농협카드",
      "농협카드",
      "카드 잃어버림",
      "카드 잃어버렸어",
      "카드 분실",
      "신용카드 분실",
      "카드 도난",
      "지갑 잃어버림",
      "해외 카드 분실",
      "카드 정지",
      "보이스피싱"
    ],
    "available24h": true,
    "source": "https://card.nonghyup.com/content/html/ip/ci/ipci1097c.html",
    "verifiedAt": "2026-09-30"
  },
  {
    "id": "org-bank-kb-incident",
    "cat": "법률/금융",
    "icon": "🏦",
    "title": "KB국민은행 분실·사고 신고",
    "desc": "통장·현금카드·OTP·KB카드",
    "num": "1588-9999",
    "situation": [
      "crime",
      "legal"
    ],
    "tip": "ARS 연결 뒤 * 버튼에서 분실 대상에 맞는 신고 메뉴를 선택하세요.",
    "organization": "KB국민은행",
    "organizationType": "bank",
    "purpose": "lost",
    "keywords": [
      "통장 분실",
      "은행",
      "계좌",
      "현금카드 분실",
      "체크카드 분실",
      "OTP 분실",
      "보안카드 분실",
      "금융사기",
      "카드 정지"
    ],
    "available24h": true,
    "source": "https://obank.kbstar.com/quics?page=C028064",
    "verifiedAt": "2026-09-30"
  },
  {
    "id": "org-bank-woori-incident",
    "cat": "법률/금융",
    "icon": "🏦",
    "title": "우리은행 분실·금융사기 신고",
    "desc": "통장·현금카드·OTP·보이스피싱",
    "num": "1588-5000",
    "situation": [
      "crime",
      "legal"
    ],
    "tip": "ARS #-1은 보이스피싱, #-2-3은 통장·인감, #-2-5는 보안카드·OTP 분실 신고입니다.",
    "organization": "우리은행",
    "organizationType": "bank",
    "purpose": "fraud",
    "keywords": [
      "통장 분실",
      "은행",
      "계좌",
      "현금카드 분실",
      "OTP 분실",
      "보안카드 분실",
      "보이스피싱",
      "금융사기",
      "송금 잘못",
      "계좌 정지"
    ],
    "available24h": true,
    "source": "https://spot.wooribank.com/pot/Dream?withyou=CQACR0001",
    "verifiedAt": "2026-09-30"
  },
];
