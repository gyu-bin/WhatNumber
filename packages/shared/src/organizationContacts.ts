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
      "더케이",
      "더케이손해보험",
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
    "id": "org-ins-sf-claim",
    "cat": "법률/금융",
    "icon": "📄",
    "title": "삼성화재 보험금 청구",
    "desc": "자동차 외 보험금 신청",
    "num": "1588-5114",
    "situation": [],
    "tip": "ARS 5번이 자동차 외 보험금 신청입니다. 평일 09:00~18:00.",
    "organization": "삼성화재",
    "organizationType": "insurance",
    "purpose": "general",
    "keywords": [
      "삼성화재",
      "보험금 청구",
      "실손",
      "질병",
      "상해"
    ],
    "source": "https://direct.samsungfire.com/claim/PP040201_001.html",
    "verifiedAt": "2026-10-13"
  },
  {
    "id": "org-ins-hi-claim",
    "cat": "법률/금융",
    "icon": "📄",
    "title": "현대해상 보험금 청구",
    "desc": "질병·상해 보험금 청구",
    "num": "1588-5656",
    "situation": [],
    "tip": "ARS 3번이 질병·상해 보험금 청구입니다.",
    "organization": "현대해상",
    "organizationType": "insurance",
    "purpose": "general",
    "keywords": [
      "현대해상",
      "보험금 청구",
      "실손",
      "질병",
      "상해"
    ],
    "source": "https://www.hi.co.kr/serviceAction.do?menuId=101233",
    "verifiedAt": "2026-10-13"
  },
  {
    "id": "org-ins-db-claim",
    "cat": "법률/금융",
    "icon": "📄",
    "title": "DB손해보험 보험금 청구",
    "desc": "사고·보상 고객센터",
    "num": "1588-0100",
    "situation": [],
    "tip": "사고 접수와 보험금 안내는 이 고객센터로 문의하세요.",
    "organization": "DB손해보험",
    "organizationType": "insurance",
    "purpose": "general",
    "keywords": [
      "DB손해보험",
      "보험금 청구",
      "실손"
    ],
    "source": "https://www.directdb.co.kr/mainView.do?cmd=main",
    "verifiedAt": "2026-10-13"
  },
  {
    "id": "org-ins-kb-claim",
    "cat": "법률/금융",
    "icon": "📄",
    "title": "KB손해보험 보험금 청구",
    "desc": "계약·사고접수·보상",
    "num": "1544-0114",
    "situation": [],
    "tip": "대표콜센터에서 계약, 사고접수, 보상을 안내합니다.",
    "organization": "KB손해보험",
    "organizationType": "insurance",
    "purpose": "general",
    "keywords": [
      "KB손해보험",
      "보험금 청구",
      "실손",
      "보상"
    ],
    "source": "https://www.kbinsure.co.kr/CG206010001.ec",
    "verifiedAt": "2026-10-13"
  },
  {
    "id": "org-ins-carrot",
    "cat": "교통/차량",
    "icon": "🚗",
    "title": "캐롯 자동차 사고·보험금 청구",
    "desc": "한화손보 캐롯 고객센터",
    "num": "1566-0300",
    "situation": [
      "car"
    ],
    "tip": "자동차 사고접수는 24시간, 일반 상담은 평일 09:00~18:00입니다.",
    "organization": "한화손해보험 캐롯",
    "organizationType": "insurance",
    "purpose": "accident",
    "keywords": [
      "캐롯",
      "한화손보 캐롯",
      "자동차 사고",
      "보험금 청구"
    ],
    "source": "https://www.carrotins.com/desktop/reward/claim/guide/",
    "verifiedAt": "2026-10-13",
    "available24h": true
  },
  {
    "id": "org-ins-nhfire",
    "cat": "법률/금융",
    "icon": "📄",
    "title": "NH농협손해보험 보험금 청구",
    "desc": "사고접수·보장 문의",
    "num": "1644-9000",
    "situation": [],
    "tip": "ARS 4번은 사고접수·보장 문의입니다. 상담은 평일 09:00~18:00입니다.",
    "organization": "NH농협손해보험",
    "organizationType": "insurance",
    "purpose": "general",
    "keywords": [
      "농협손해보험",
      "NH농협손해보험",
      "보험금 청구",
      "사고접수"
    ],
    "source": "https://nhfire.co.kr/customer/guide/teleConsultGuide.nhfire",
    "verifiedAt": "2026-10-13"
  },
  {
    "id": "org-ins-nhfire-group",
    "cat": "법률/금융",
    "icon": "📄",
    "title": "NH농협손해보험 단체상해",
    "desc": "단체상해보험 상담",
    "num": "1644-9666",
    "situation": [],
    "tip": "단체상해보험은 이 번호로 문의하세요.",
    "organization": "NH농협손해보험",
    "organizationType": "insurance",
    "purpose": "general",
    "keywords": [
      "농협손해보험",
      "단체상해",
      "보험금 청구"
    ],
    "source": "https://nhfire.co.kr/customer/guide/teleConsultGuide.nhfire",
    "verifiedAt": "2026-10-13"
  },
  {
    "id": "org-ins-shinhanez",
    "cat": "법률/금융",
    "icon": "📄",
    "title": "신한EZ손해보험 보험금 청구",
    "desc": "전화 보험금 청구",
    "num": "1544-2580",
    "situation": [],
    "tip": "상담원을 통해 보험금을 청구할 수 있습니다.",
    "organization": "신한EZ손해보험",
    "organizationType": "insurance",
    "purpose": "general",
    "keywords": [
      "신한EZ",
      "신한이지",
      "보험금 청구",
      "실손"
    ],
    "source": "https://www.shinhanez.co.kr/static/cus/CUS50000M01.html",
    "verifiedAt": "2026-10-13"
  },
  {
    "id": "org-ins-kakaopay",
    "cat": "법률/금융",
    "icon": "📄",
    "title": "카카오페이손해보험 보험금 청구",
    "desc": "보험금 신청 상담",
    "num": "1544-0022",
    "situation": [],
    "tip": "전화 상담과 보험금 신청은 평일 09:00~18:00입니다.",
    "organization": "카카오페이손해보험",
    "organizationType": "insurance",
    "purpose": "general",
    "keywords": [
      "카카오페이손해보험",
      "카카오페이",
      "보험금 청구",
      "실손"
    ],
    "source": "https://kakaopayinscorp.co.kr/",
    "verifiedAt": "2026-10-13"
  },
  {
    "id": "org-ins-samsunglife-claim",
    "cat": "법률/금융",
    "icon": "📄",
    "title": "삼성생명 사고보험금",
    "desc": "사고보험금 전용",
    "num": "1577-4118",
    "situation": [],
    "tip": "사고보험금 전용 번호입니다. 대표 상담은 1588-3114, 평일 09:00~18:00입니다.",
    "organization": "삼성생명",
    "organizationType": "insurance",
    "purpose": "general",
    "keywords": [
      "삼성생명",
      "보험금 청구",
      "실손",
      "사고보험금"
    ],
    "source": "https://direct.samsunglife.com/customerSupport/insuranceClaimInformation/CustomerSupportInsuranceClaimInformationView",
    "verifiedAt": "2026-10-13"
  },
  {
    "id": "org-ins-samsunglife",
    "cat": "법률/금융",
    "icon": "📄",
    "title": "삼성생명 보험금 청구",
    "desc": "삼성생명 고객센터",
    "num": "1588-3114",
    "situation": [],
    "tip": "대표 콜센터입니다. 평일 09:00~18:00. 사고보험금 전용은 1577-4118입니다.",
    "organization": "삼성생명",
    "organizationType": "insurance",
    "purpose": "general",
    "keywords": [
      "삼성생명",
      "보험금 청구",
      "실손"
    ],
    "source": "https://direct.samsunglife.com/customerCenter/consulting.eds",
    "verifiedAt": "2026-10-13"
  },
  {
    "id": "org-ins-hanwhalife",
    "cat": "법률/금융",
    "icon": "📄",
    "title": "한화생명 보험금 청구",
    "desc": "한화생명 고객센터",
    "num": "1588-6363",
    "situation": [],
    "tip": "상담사 연결은 평일 09:00~18:00입니다. 수술·입원·통원·실손 청구 메뉴가 있습니다.",
    "organization": "한화생명",
    "organizationType": "insurance",
    "purpose": "general",
    "keywords": [
      "한화생명",
      "보험금 청구",
      "실손"
    ],
    "source": "https://www.hanwhalife.com/main/customerCenter/callCenterArs/CU_CSARS00_P10000.do",
    "verifiedAt": "2026-10-13"
  },
  {
    "id": "org-ins-kyobo-claim",
    "cat": "법률/금융",
    "icon": "📄",
    "title": "교보생명 사고보험금",
    "desc": "사고보험금 고객센터",
    "num": "1588-1810",
    "situation": [],
    "tip": "사고보험금 고객센터입니다. 대표번호 1588-1001의 2번이 보험금 청구입니다.",
    "organization": "교보생명",
    "organizationType": "insurance",
    "purpose": "general",
    "keywords": [
      "교보생명",
      "보험금 청구",
      "실손"
    ],
    "source": "https://www.kyobo.com/dgt/web/dti/insurance/accInq/findAccIsamInq",
    "verifiedAt": "2026-10-13"
  },
  {
    "id": "org-ins-kyobo",
    "cat": "법률/금융",
    "icon": "📄",
    "title": "교보생명 보험금 청구",
    "desc": "교보생명 고객센터",
    "num": "1588-1001",
    "situation": [],
    "tip": "ARS 2번이 보험금 청구입니다. 사고보험금 전용은 1588-1810입니다.",
    "organization": "교보생명",
    "organizationType": "insurance",
    "purpose": "general",
    "keywords": [
      "교보생명",
      "보험금 청구",
      "실손"
    ],
    "source": "https://www.kyobo.com/dgt/web/customer/support/ars-guidance",
    "verifiedAt": "2026-10-13"
  },
  {
    "id": "org-ins-shinhanlife",
    "cat": "법률/금융",
    "icon": "📄",
    "title": "신한라이프 보험금 청구",
    "desc": "신한라이프 고객센터",
    "num": "1588-5580",
    "situation": [],
    "tip": "보험금 청구와 계약 상담은 이 고객센터로 문의하세요.",
    "organization": "신한라이프",
    "organizationType": "insurance",
    "purpose": "general",
    "keywords": [
      "신한라이프",
      "보험금 청구",
      "실손"
    ],
    "source": "https://www.donotcall.or.kr/guide_inquire_list03.jsp",
    "verifiedAt": "2026-10-13"
  },
  {
    "id": "org-ins-miraeasset",
    "cat": "법률/금융",
    "icon": "📄",
    "title": "미래에셋생명 보험금 청구",
    "desc": "미래에셋생명 고객센터",
    "num": "1588-0220",
    "situation": [],
    "tip": "보험금 청구와 계약 상담은 이 고객센터로 문의하세요.",
    "organization": "미래에셋생명",
    "organizationType": "insurance",
    "purpose": "general",
    "keywords": [
      "미래에셋생명",
      "보험금 청구",
      "실손"
    ],
    "source": "https://www.donotcall.or.kr/guide_inquire_list03.jsp",
    "verifiedAt": "2026-10-13"
  },
  {
    "id": "org-ins-dongyang",
    "cat": "법률/금융",
    "icon": "📄",
    "title": "동양생명 보험금 청구",
    "desc": "동양생명 고객센터",
    "num": "1577-1004",
    "situation": [],
    "tip": "보험금 청구와 계약 상담은 이 고객센터로 문의하세요.",
    "organization": "동양생명",
    "organizationType": "insurance",
    "purpose": "general",
    "keywords": [
      "동양생명",
      "보험금 청구",
      "실손"
    ],
    "source": "https://www.donotcall.or.kr/guide_inquire_list03.jsp",
    "verifiedAt": "2026-10-13"
  },
  {
    "id": "org-ins-nhlife-claim",
    "cat": "법률/금융",
    "icon": "📄",
    "title": "NH농협생명 사고보험금",
    "desc": "사고보험금 상담",
    "num": "1833-4100",
    "situation": [],
    "tip": "사고보험금 상담입니다. 일반 상담은 1544-4000, 평일 09:00~18:00입니다.",
    "organization": "NH농협생명",
    "organizationType": "insurance",
    "purpose": "general",
    "keywords": [
      "NH농협생명",
      "보험금 청구",
      "실손"
    ],
    "source": "https://www.nhlife.co.kr/ho/cc/HOCC0001M00.nhl",
    "verifiedAt": "2026-10-13"
  },
  {
    "id": "org-ins-nhlife",
    "cat": "법률/금융",
    "icon": "📄",
    "title": "NH농협생명 보험금 청구",
    "desc": "NH농협생명 고객센터",
    "num": "1544-4000",
    "situation": [],
    "tip": "일반 상담입니다. 사고보험금은 1833-4100, 상담원 연결은 평일 09:00~18:00입니다.",
    "organization": "NH농협생명",
    "organizationType": "insurance",
    "purpose": "general",
    "keywords": [
      "NH농협생명",
      "보험금 청구",
      "실손"
    ],
    "source": "https://www.nhlife.co.kr/ho/cc/HOCC0001M00.nhl",
    "verifiedAt": "2026-10-13"
  },
  {
    "id": "org-ins-metlife",
    "cat": "법률/금융",
    "icon": "📄",
    "title": "메트라이프생명 보험금 청구",
    "desc": "메트라이프생명 고객센터",
    "num": "1588-9600",
    "situation": [],
    "tip": "콜센터는 평일 09:00~18:00입니다.",
    "organization": "메트라이프생명",
    "organizationType": "insurance",
    "purpose": "general",
    "keywords": [
      "메트라이프생명",
      "보험금 청구",
      "실손"
    ],
    "source": "https://www.metlife.co.kr/customer-service/contact-us/call-center-and-ars/",
    "verifiedAt": "2026-10-13"
  },
  {
    "id": "org-ins-kblife",
    "cat": "법률/금융",
    "icon": "📄",
    "title": "KB라이프생명 보험금 청구",
    "desc": "KB라이프생명 고객센터",
    "num": "1588-3374",
    "situation": [],
    "tip": "보험금 청구와 계약 상담은 이 고객센터로 문의하세요.",
    "organization": "KB라이프생명",
    "organizationType": "insurance",
    "purpose": "general",
    "keywords": [
      "KB라이프생명",
      "보험금 청구",
      "실손"
    ],
    "source": "https://www.donotcall.or.kr/guide_inquire_list03.jsp",
    "verifiedAt": "2026-10-13"
  },
  {
    "id": "org-ins-lina",
    "cat": "법률/금융",
    "icon": "📄",
    "title": "라이나생명 보험금 청구",
    "desc": "라이나생명 고객센터",
    "num": "1588-0058",
    "situation": [],
    "tip": "보험금 청구와 계약 상담은 이 고객센터로 문의하세요.",
    "organization": "라이나생명",
    "organizationType": "insurance",
    "purpose": "general",
    "keywords": [
      "라이나생명",
      "보험금 청구",
      "실손"
    ],
    "source": "https://www.donotcall.or.kr/guide_inquire_list03.jsp",
    "verifiedAt": "2026-10-13"
  },
  {
    "id": "org-ins-aia",
    "cat": "법률/금융",
    "icon": "📄",
    "title": "AIA생명 보험금 청구",
    "desc": "AIA생명 고객센터",
    "num": "1588-9898",
    "situation": [],
    "tip": "보험금 청구와 계약 상담은 이 고객센터로 문의하세요.",
    "organization": "AIA생명",
    "organizationType": "insurance",
    "purpose": "general",
    "keywords": [
      "AIA생명",
      "보험금 청구",
      "실손"
    ],
    "source": "https://www.donotcall.or.kr/guide_inquire_list03.jsp",
    "verifiedAt": "2026-10-13"
  },
  {
    "id": "org-ins-heungkuklife",
    "cat": "법률/금융",
    "icon": "📄",
    "title": "흥국생명 보험금 청구",
    "desc": "흥국생명 고객센터",
    "num": "1588-2288",
    "situation": [],
    "tip": "보험금 청구와 계약 상담은 이 고객센터로 문의하세요.",
    "organization": "흥국생명",
    "organizationType": "insurance",
    "purpose": "general",
    "keywords": [
      "흥국생명",
      "보험금 청구",
      "실손"
    ],
    "source": "https://www.donotcall.or.kr/guide_inquire_list03.jsp",
    "verifiedAt": "2026-10-13"
  },
  {
    "id": "org-ins-dblife",
    "cat": "법률/금융",
    "icon": "📄",
    "title": "DB생명 보험금 청구",
    "desc": "DB생명 고객센터",
    "num": "1588-3131",
    "situation": [],
    "tip": "보험금 청구와 계약 상담은 이 고객센터로 문의하세요.",
    "organization": "DB생명",
    "organizationType": "insurance",
    "purpose": "general",
    "keywords": [
      "DB생명",
      "보험금 청구",
      "실손"
    ],
    "source": "https://www.donotcall.or.kr/guide_inquire_list03.jsp",
    "verifiedAt": "2026-10-13"
  },
  {
    "id": "org-ins-kdblife",
    "cat": "법률/금융",
    "icon": "📄",
    "title": "KDB생명 보험금 청구",
    "desc": "KDB생명 고객센터",
    "num": "1588-4040",
    "situation": [],
    "tip": "보험금 청구와 계약 상담은 이 고객센터로 문의하세요.",
    "organization": "KDB생명",
    "organizationType": "insurance",
    "purpose": "general",
    "keywords": [
      "KDB생명",
      "보험금 청구",
      "실손"
    ],
    "source": "https://www.donotcall.or.kr/guide_inquire_list03.jsp",
    "verifiedAt": "2026-10-13"
  },
  {
    "id": "org-ins-fubon",
    "cat": "법률/금융",
    "icon": "📄",
    "title": "푸본현대생명 보험금 청구",
    "desc": "푸본현대생명 고객센터",
    "num": "1577-3311",
    "situation": [],
    "tip": "보험금 청구와 계약 상담은 이 고객센터로 문의하세요.",
    "organization": "푸본현대생명",
    "organizationType": "insurance",
    "purpose": "general",
    "keywords": [
      "푸본현대생명",
      "보험금 청구",
      "실손"
    ],
    "source": "https://www.donotcall.or.kr/guide_inquire_list03.jsp",
    "verifiedAt": "2026-10-13"
  },
  {
    "id": "org-ins-hanalife",
    "cat": "법률/금융",
    "icon": "📄",
    "title": "하나생명 보험금 청구",
    "desc": "하나생명 고객센터",
    "num": "080-3488-7000",
    "situation": [],
    "tip": "보험금 청구와 계약 상담은 이 고객센터로 문의하세요.",
    "organization": "하나생명",
    "organizationType": "insurance",
    "purpose": "general",
    "keywords": [
      "하나생명",
      "보험금 청구",
      "실손"
    ],
    "source": "https://www.donotcall.or.kr/guide_inquire_list03.jsp",
    "verifiedAt": "2026-10-13"
  },
  {
    "id": "org-ins-abl",
    "cat": "법률/금융",
    "icon": "📄",
    "title": "ABL생명 보험금 청구",
    "desc": "ABL생명 고객센터",
    "num": "1588-6500",
    "situation": [],
    "tip": "입원·수술 등 사고보험금은 1588-4404입니다. 상담은 평일 09:00~18:00입니다.",
    "organization": "ABL생명",
    "organizationType": "insurance",
    "purpose": "general",
    "keywords": [
      "ABL생명",
      "보험금 청구",
      "실손"
    ],
    "source": "https://abllife.co.kr/hp/custDesk/brnofGudn",
    "verifiedAt": "2026-10-13"
  },
  {
    "id": "org-ins-chubb",
    "cat": "법률/금융",
    "icon": "📄",
    "title": "처브라이프 보험금 청구",
    "desc": "처브라이프 고객센터",
    "num": "1599-4600",
    "situation": [],
    "tip": "보험금 청구와 계약 상담은 이 고객센터로 문의하세요.",
    "organization": "처브라이프",
    "organizationType": "insurance",
    "purpose": "general",
    "keywords": [
      "처브라이프",
      "보험금 청구",
      "실손"
    ],
    "source": "https://www.donotcall.or.kr/guide_inquire_list03.jsp",
    "verifiedAt": "2026-10-13"
  },
  {
    "id": "org-ins-lifeplanet",
    "cat": "법률/금융",
    "icon": "📄",
    "title": "교보라이프플래닛 보험금 청구",
    "desc": "교보라이프플래닛 고객센터",
    "num": "1566-0999",
    "situation": [],
    "tip": "보험금 청구와 계약 상담은 이 고객센터로 문의하세요.",
    "organization": "교보라이프플래닛",
    "organizationType": "insurance",
    "purpose": "general",
    "keywords": [
      "교보라이프플래닛",
      "보험금 청구",
      "실손"
    ],
    "source": "https://www.donotcall.or.kr/guide_inquire_list03.jsp",
    "verifiedAt": "2026-10-13"
  },
  {
    "id": "org-ins-cardif",
    "cat": "법률/금융",
    "icon": "📄",
    "title": "BNP파리바카디프생명 보험금 청구",
    "desc": "BNP파리바카디프생명 고객센터",
    "num": "1688-1118",
    "situation": [],
    "tip": "보험금 청구와 계약 상담은 이 고객센터로 문의하세요.",
    "organization": "BNP파리바카디프생명",
    "organizationType": "insurance",
    "purpose": "general",
    "keywords": [
      "BNP파리바카디프생명",
      "보험금 청구",
      "실손"
    ],
    "source": "https://www.donotcall.or.kr/guide_inquire_list03.jsp",
    "verifiedAt": "2026-10-13"
  },
  {
    "id": "org-ins-ibk",
    "cat": "법률/금융",
    "icon": "📄",
    "title": "IBK연금보험 보험금 청구",
    "desc": "IBK연금보험 고객센터",
    "num": "1577-4117",
    "situation": [],
    "tip": "보험금 청구와 계약 상담은 이 고객센터로 문의하세요.",
    "organization": "IBK연금보험",
    "organizationType": "insurance",
    "purpose": "general",
    "keywords": [
      "IBK연금보험",
      "보험금 청구"
    ],
    "source": "https://www.donotcall.or.kr/guide_inquire_list03.jsp",
    "verifiedAt": "2026-10-13"
  },
  {
    "id": "org-ins-dgblife",
    "cat": "법률/금융",
    "icon": "📄",
    "title": "iM라이프 보험금 청구",
    "desc": "구 DGB생명 고객센터",
    "num": "1588-4770",
    "situation": [],
    "tip": "평일 09:00~18:00입니다. 예전 이름은 DGB생명입니다.",
    "organization": "iM라이프",
    "organizationType": "insurance",
    "purpose": "general",
    "keywords": [
      "iM라이프",
      "DGB생명",
      "보험금 청구",
      "실손"
    ],
    "source": "https://www.imlifeins.co.kr/",
    "verifiedAt": "2026-10-13"
  },
  {
    "id": "org-ins-epost",
    "cat": "법률/금융",
    "icon": "📄",
    "title": "우체국보험 보험금 청구",
    "desc": "우체국보험 고객센터",
    "num": "1599-0100",
    "situation": [],
    "tip": "사고보험금 상담은 #2, 수술·입원·실손 상담은 3번입니다. 평일 09:00~18:00, 은행 휴무일은 쉽니다.",
    "organization": "우체국보험",
    "organizationType": "insurance",
    "purpose": "general",
    "keywords": [
      "우체국보험",
      "우체국",
      "보험금 청구",
      "실손",
      "사고보험금"
    ],
    "source": "https://m.epostlife.go.kr/CRUIAA00AT.do",
    "verifiedAt": "2026-10-13"
  },
  {
    "id": "org-ins-hana-claim",
    "cat": "법률/금융",
    "icon": "📄",
    "title": "하나손해보험 보험금 청구",
    "desc": "운전자·질병·상해 보험금",
    "num": "1566-3000",
    "situation": [],
    "tip": "ARS 6번은 운전자·질병·단체상해 보험금 청구입니다. 일반 상담은 평일 09:00~18:00입니다.",
    "organization": "하나손해보험",
    "organizationType": "insurance",
    "purpose": "general",
    "keywords": [
      "하나손해보험",
      "하나손보",
      "더케이",
      "더케이손해보험",
      "보험금 청구",
      "실손",
      "질병",
      "상해"
    ],
    "source": "https://www.hanainsure.co.kr/w/customer/homepageInfo/customerWork",
    "verifiedAt": "2026-10-13"
  },
  {
    "id": "org-ins-linanonlife",
    "cat": "법률/금융",
    "icon": "📄",
    "title": "라이나손해보험 보험금 청구",
    "desc": "라이나손해보험 고객센터",
    "num": "1566-5800",
    "situation": [],
    "tip": "ARS 1번은 보험금 청구 안내, 7-1번은 청구 상담사입니다. 평일 09:00~18:00입니다.",
    "organization": "라이나손해보험",
    "organizationType": "insurance",
    "purpose": "general",
    "keywords": [
      "라이나손해보험",
      "라이나손보",
      "에이스손해보험",
      "보험금 청구",
      "실손"
    ],
    "source": "https://ec.aceinsurance.co.kr/jsp/acelimited/main2.jsp",
    "verifiedAt": "2026-10-13"
  },
  {
    "id": "org-ins-aig",
    "cat": "법률/금융",
    "icon": "📄",
    "title": "AIG손해보험 보험금 청구",
    "desc": "계약·보상 문의",
    "num": "1544-2792",
    "situation": [],
    "tip": "보험 계약과 보상 문의입니다. 평일 09:00~18:00입니다.",
    "organization": "AIG손해보험",
    "organizationType": "insurance",
    "purpose": "general",
    "keywords": [
      "AIG손해보험",
      "AIG",
      "보험금 청구",
      "보상"
    ],
    "source": "https://www.aig.co.kr/wi/dpwim067.html",
    "verifiedAt": "2026-10-13"
  },
  {
    "id": "org-ins-abl-claim",
    "cat": "법률/금융",
    "icon": "📄",
    "title": "ABL생명 사고보험금",
    "desc": "입원·수술 보험금",
    "num": "1588-4404",
    "situation": [],
    "tip": "입원·수술 등 사고보험금 상담입니다. 평일 09:00~18:00. 대표번호는 1588-6500입니다.",
    "organization": "ABL생명",
    "organizationType": "insurance",
    "purpose": "general",
    "keywords": [
      "ABL생명",
      "보험금 청구",
      "실손",
      "사고보험금"
    ],
    "source": "https://abllife.co.kr/hp/custDesk/brnofGudn",
    "verifiedAt": "2026-10-13"
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
