# 전화번호 전수 점검 결과

기준일: 2026-09-30. 시작 main: `140c7f6c1a64308383e6def835978e4e52a9fe9f`(당시 origin/main과 일치).

정적 등록 데이터 **104개(공공 82 + 기업 22)**를 조사했습니다. 이 보고서는 공식 게시 내용 대조와 실제 코드 검증 결과이며, 전화망의 실제 연결을 인증하는 보고서가 아닙니다.

## 최초 데이터 판정

| 판정 | 개수 |
|---|---:|
| VALID_BUT_COPY_FIX | 45 |
| OUTDATED | 6 |
| UNVERIFIED | 10 |
| WRONG_NUMBER | 6 |
| REGIONAL | 13 |
| VALID | 24 |
| 합계 | 104 |

`VALID`도 기관 페이지에서 확인되지 않은 시간·요금까지 보장한다는 의미는 아닙니다. 각 필드의 UNKNOWN과 증거 취득 방식을 별도 기록했습니다. 최초 판정은 감사 당시 구 데이터 기준이며 아래 실제 적용 건수와 중복해서 더하지 않습니다.

## 실제 반영

- 현재 노출 91개: 공공 70, 기업 21.
- 기존 ID를 유지한 직접 번호 정정 7개.
- 통합·잘못된 중복 매핑 4개는 기존 즐겨찾기 ID를 현재 창구로 alias 처리.
- 현행 연결을 확정하지 못한 9개는 노출 보류. **폐지·전화 단절로 단정하지 않음.**
- 91개 항목의 제목·설명·팁·상세를 정리하고 한국어/영어/중국어/일본어 및 웹 FAQ·가이드에도 반영.
- 기존 storage key와 남아 있는 ID는 유지. 보류/알 수 없는 ID는 안전하게 건너뛰고 화면 즐겨찾기 개수에서는 제외. 이후 재검증 시 복구 가능.

## 주요 정정

| ID | 기존 | 수정 | 이유 | 공식 출처 |
|---|---|---|---|---|
| c6 | 무보험 차량 사고 피해 · 1544-0119 | 뺑소니·무보험 사고 피해 지원 · 1544-0049 | 1544-0119 해당 용도 공식 근거 없고 올바른 번호1544-0049 2개 공식 본문 확인. | [공식 1](https://tacss.or.kr/notification/board_view.jsp?no=132&page=pressrelease&pagenum=2&tname=tb_reporting) · [공식 2](https://www.korea.kr/news/policyNewsView.do?newsId=148931290) |
| l4 | 보이스피싱 신고 · 1398 | 보이스피싱·스미싱 신고 · 1394 | 1398은 권익위 부패·공익신고. 현재 공식피싱안심SOS1394본문/전화footer확인. 이전112단일신고안내보다 최신현행. 긴급 범죄위험112. 부패신고로title전환은 저장번호원래목적바꾸므로 비권고. | [공식 1](https://www.counterscam112.go.kr/board/CONTENT_000000000010.do) · [공식 2](https://www.korea.kr/multi/mediaNewsView.do?newsId=148972664&pWise=sub&pWiseSub=C4) · [공식 3](https://www.acrc.go.kr/board.es?bid=CDNS&mid=a30103000000) |
| l5 | 개인정보 침해 신고 · 1811-9000 | 개인정보 침해 상담·신고 · 118 | 1811-9000의 현재 개인정보신고기관 연계 미확인; 실제 공식118개인정보상담확인. 삭제·차단자동보장 제거. | [공식 1](https://www.kisa.kr/118) |
| f4 | 불법촬영 피해 지원 · 1899-0088 | 디지털성범죄 피해 지원 · 02-735-8994 | 현재중앙센터공식번호확인.1899-0088중앙센터아님.삭제성공·수사완료보장금지. | [공식 1](https://d4u.stop.or.kr/ko/main) |
| f8 | 노인학대 신고·상담 · 1389 | 노인학대 신고·상담 · 1577-1389 | 현행공식대표학대신고전화1577-1389.단축번호1389이전번호.긴급위험112. | [공식 1](https://noinboho1389.or.kr/) |
| w3 | 내일배움카드·직업교육 · 1644-8000 | 내일배움카드·직업훈련 · 1350 | 2026-01-16공식1350내일배움카드자격및고용24신청답변확인.1644-8000은한국산업인력공단대표번호여서목적오류. | [공식 1](https://1350.moel.go.kr/rtmview.do?id=1000314576&page=1&type=ALL) |
| w4 | 직장 내 괴롭힘·성희롱 · 1544-4140 | 직장 내 괴롭힘·노동 상담 · 1350 | 1544-4140최신공식번호확인불가.검증된고용노동1350대체권고이나원래기관동일성미확인;별도정정으로기록. 원번호 운영 확인 불가와 별개로, 공식 노동부 본문에서 직장 내 괴롭힘·성희롱 등의 상담 범위를 확인한 1350으로 정정. ID는 사용자 의도인 노동문제 상담을 유지. | [공식 1](https://1350.moel.go.kr/home/) · [공식 2](https://www.moel.go.kr/news/enews/report/enewsView.do?news_seq=16169) · [공식 3](https://1350.moel.go.kr/rtmview.do?id=1000322176&page=1&type=ALL) |

1339는 질병관리청의 감염병·질병 상담으로 정정하고 응급실·약국 검색 및 emergency 상황 매핑에서 제외했습니다. 129는 보건복지 상담으로 정정하고 국가가 반드시 치료비를 대신 지급한다는 단정을 제거했습니다. HUG와 우체국·K-water의 범위도 실제 기관 소관으로 제한했습니다.

## 목록 제외 및 호환 처리

| ID | 이전 번호 | 처리 | 현재 대체 / 이유 | 공식 출처 |
|---|---|---|---|---|
| e13 | 1393 | 현재 항목으로 연결 | e7 · 109 | [공식 1](https://www.129.go.kr/faq/faq06.do?searchConsultingKeyword=F01&sn=15221) · [공식 2](https://www.mohw.go.kr/menu.es?mid=a10716040000) |
| e11 | 1337 | 미확인·노출 보류 | 공식 군 홈페이지 접근 실패. 기존 군사안보지원사령부 기관명은 최신 기관으로 사용 불가. 과거 권익위 문서는 국군기무사령부 표기라 현재 증거 제외. | 현행 공식 근거 미확보 |
| e12 | 122 | 현재 항목으로 연결 | e2 · 119 | [공식 1](https://www.mois.go.kr/frt/sub/a06/b10/emergencycall/screen.do) |
| c2 | 1588-2100 | 현재 항목으로 연결 | c1 · 1588-2504 | [공식 1](https://www.nhbank.com/goSubPage.do?srchGb=KO_NHCP_09_07&srchSiteGb=KR) · [공식 2](https://www.exservice.co.kr/service/callcenter_new.php) · [공식 3](https://www.molit.go.kr/upload/portal/DextUpload/201501/20150113_175930_963.pdf) |
| h4 | 1670-1004 | 미확인·노출 보류 | 기존 번호 숨김 권고. ID를 무조건119로 바꾸면 기존 지역서비스 즐겨찾기를 다른 기관으로 바꾸는 혼동. 삭제+긴급119(e2) 안내 권장. 지역 공급사 목록 검증 전 새 번호 추정 금지. | [공식 1](https://www.mois.go.kr/frt/sub/a06/b10/emergencycall/screen.do) |
| l6 | 1544-0990 | 현재 항목으로 연결 | l11 · 1372 | [공식 1](https://www.kca.go.kr/odr/pg/ma/cnsutInfo1.do) |
| l8 | 1661-7600 | 미확인·노출 보류 | 정확한1661-7600공식기관현재연결근거없음.비공식blog제외.안전한대안110(정부민원)은 다른번호이므로자동치환보다격리. | 현행 공식 근거 미확보 |
| g13 | 043-120 | 미확인·노출 보류 | 공식충북도웹현재043-120통합콜센터본문미확인.지역번호+120자동조합금지.검색노출·타기관오래된목록만근거불가. | 현행 공식 근거 미확보 |
| g14 | 041-120 | 미확인·노출 보류 | 충남공식관광불편신고041+120표기만발견.도정민원콜센터전범위동일성불충분. | 현행 공식 근거 미확보 |
| g15 | 063-120 | 미확인·노출 보류 | 공식검색자동완성등만발견;최신기관서비스본문미확인. | 현행 공식 근거 미확보 |
| g16 | 061-120 | 미확인·노출 보류 | 타지자체2023전화목록만으로현재전남도통합콜센터확정못함. | 현행 공식 근거 미확보 |
| g17 | 054-120 | 미확인·노출 보류 | 공식경북도현행054-120전화·서비스본문미확인. | 현행 공식 근거 미확보 |
| org-ins-carrot-auto | 1566-0300 | 미확인·노출 보류 | 현행공식페이지제목 한화손보캐롯 확인.금감원2026-03-25자료2025-10합병 확인.본문0줄이라 합병후해당번호 사고/출동/시간 재확인불가;2024금감원자료 번호존재. | [공식 1](https://www.carrotins.com/) · [공식 2](https://kiri.or.kr/PDF/weeklytrend/20260406/trend20260406_7.pdf) · [공식 3](https://kiri.or.kr/PDF/weeklytrend/20240213/trend20240213_19.pdf) |

e13(1393)→e7(109), e12(122)→e2(119), c2(잘못된 농협 번호)→c1(1588-2504), l6→l11(1372). 해양 범죄 신고는 112이며 e12 alias는 해양 긴급 구조 의도를 기준으로 119에 연결합니다.

## 추가 확인 필요

- e11(1337), h4(1670-1004), l8(1661-7600), g13~g17의 120 안내, 합병 이후 캐롯 전용 1566-0300은 현행 공식 확인이 부족합니다. 보류 상태이며 전화 발신으로 임의 검증하지 않았습니다.
- w4의 원번호 1544-4140은 현행 확인 불가. 다만 같은 사용자 목적의 노동문제 상담은 고용노동부 공식 본문으로 1350이 확인돼 정정했습니다. 원래 기관과 동일하다는 주장은 하지 않습니다.
- 한화손보 1566-8000은 현재 기업이 게시한 앱 설명에서 사고접수·보상 업무를 확인했습니다. 최신 24시간·고장출동 ARS는 미확정이므로 해당 단정은 제거했습니다.
- DB·메리츠·예별·신한 등의 확인되지 않은 24시간 표기는 제거했습니다. 시간·요금 UNKNOWN은 원본 감사 JSON에서 확인할 수 있습니다.

## 지역번호·중복 후보·위젯

- 지역 120은 대규모 모델 변경 없이 공식 확인된 지역 카드만 유지하고 해당 지역 소관을 명시했습니다. 충북·충남·전북·전남·경북 등 미확인 카드는 보류했습니다.
- 한전123·환경128은 휴대전화에서 지역번호가 필요하므로 앱은 지역 선택 후, 웹은 검증된 지역번호 입력 후 전화앱을 엽니다. 임의 기본 지역은 없습니다.
- 위젯에서는 지역을 선택할 수 없으므로 123·128 직접 전화 항목은 제외했습니다. 앱 즐겨찾기에는 유지됩니다. 저장 지역을 지원하는 후속 모델 설계 전까지의 안전 조치입니다.
- 기존 위젯의 캐시·스냅샷은 **업데이트된 앱을 한 번 열고 즐겨찾기 로딩 완료/foreground 동기화** 시 재작성됩니다. 앱을 실행하지 않은 기존 네이티브 캐시를 원격으로 바꾸는 작업은 하지 않았습니다.
- 다음 중복 번호는 서로 다른 상담 분야/상황 카드로 유지했습니다(같은 기관임을 설명).

| 번호 | 유지 ID | 구분 |
|---|---|---|
| 119 | e2, c4 | 화재·구조·구급 신고 / 교통사고 구조·구급 |
| 112 | e3, c3 | 경찰 긴급신고 / 교통사고 긴급 신고 |
| 110 | c7, g1 | 교통 행정·민원 안내 / 정부 민원 안내 |
| 182 | c8, f9 | 경찰 유실물 문의 / 실종아동·실종자 안내 |
| 118 | l5, l9, d4 | 개인정보 침해 상담·신고 / 해킹·인터넷 침해 상담 / 불법스팸 신고·상담 |
| 1350 | w1, w3, w4 | 고용·노동 상담 / 내일배움카드·직업훈련 / 직장 내 괴롭힘·노동 상담 |

## 모든 항목의 적용 결과

| ID | 기존 제목 / 번호 | 현재 제목 / 번호 | 최초 판정 · 최종 처리 | 공식 출처 |
|---|---|---|---|---|
| e1 | 응급실 비용 없을 때 / 129 | 보건복지 상담 / 129 | VALID_BUT_COPY_FIX · correct-copy-and-details | [공식 1](https://129.go.kr/counsel/counsel01.do) |
| e2 | 화재·구급 / 119 | 화재·구조·구급 신고 / 119 | VALID_BUT_COPY_FIX · correct-copy-and-details | [공식 1](https://www.mois.go.kr/frt/sub/a06/b10/emergencycall/screen.do) · [공식 2](https://www.nfa.go.kr/nfa/news/pressrelease/press/?cntId=1851&mode=view) |
| e3 | 범죄·경찰 신고 / 112 | 경찰 긴급신고 / 112 | VALID_BUT_COPY_FIX · correct-copy-and-details | [공식 1](https://www.112.go.kr/) · [공식 2](https://www.mois.go.kr/frt/sub/a06/b10/emergencycall/screen.do) |
| e4 | 응급 병원·약국 안내 / 1339 | 질병관리청 1339 콜센터 / 1339 | VALID_BUT_COPY_FIX · correct-copy-and-details | [공식 1](https://www.kdca.go.kr/kdca/2777/subview.do) · [공식 2](https://www.kdca.go.kr/eng/4276/subview.do) |
| e5 | 범죄 피해 지원 / 1577-2584 | 검찰청 범죄피해자 지원 / 1577-2584 | VALID_BUT_COPY_FIX · correct-copy-and-details | [공식 1](https://www.spo.go.kr/site/spo/02/10211020100002018100812.jsp) |
| e6 | 해외 긴급상황 / 02-3210-0404 | 영사안전콜센터 / 02-3210-0404 | VALID_BUT_COPY_FIX · correct-copy-and-details | [공식 1](https://www.0404.go.kr/bbs/bbsPst/MST0000000000039/ATC0000000048212/detail) |
| e7 | 마음이 힘들 때 / 109 | 자살예방 상담 / 109 | VALID_BUT_COPY_FIX · correct-copy-and-details | [공식 1](https://www.129.go.kr/faq/faq06.do?searchConsultingKeyword=F01&sn=15221) · [공식 2](https://www.mohw.go.kr/menu.es?mid=a10716040000) |
| e13 | 자살예방 상담 / 1393 | 자살예방 상담 / 109 | OUTDATED · alias | [공식 1](https://www.129.go.kr/faq/faq06.do?searchConsultingKeyword=F01&sn=15221) · [공식 2](https://www.mohw.go.kr/menu.es?mid=a10716040000) |
| e8 | 간첩신고 / 111 | 국가정보원 안보 신고 / 111 | VALID_BUT_COPY_FIX · correct-copy-and-details | [공식 1](https://www.nis.go.kr/CM/1_7_2.do) |
| e9 | 방첩신고 / 113 | 경찰 방첩 신고 / 113 | VALID_BUT_COPY_FIX · correct-copy-and-details | [공식 1](https://www.korea.kr/news/policyNewsView.do?newsId=148951821) |
| e10 | 통합방위 주민신고 / 1338 | 군부대 주민 신고 / 1338 | VALID_BUT_COPY_FIX · correct-copy-and-details | [공식 1](https://www.ansan.go.kr/www/common/cntnts/selectContents.do?cntnts_id=C0001373) · [공식 2](https://note.gwgs.go.kr/board/notice/view.php?ntt_id=B000000077350Dr8jR1q) |
| e11 | 군사기밀·군 간첩신고 / 1337 | 노출 보류 | UNVERIFIED · hold-unverified | 현행 공식 근거 미확보 |
| e12 | 해양 긴급·해경 / 122 | 화재·구조·구급 신고 / 119 | OUTDATED · alias | [공식 1](https://www.mois.go.kr/frt/sub/a06/b10/emergencycall/screen.do) |
| e14 | 환경오염 신고 / 128 | 환경오염 신고 / 128 | VALID_BUT_COPY_FIX · correct-copy-and-details | [공식 1](https://me.go.kr/home/web/board/read.do?boardId=1840940&boardMasterId=1&menuId=286) · [공식 2](https://eng.me.go.kr/home/web/board/read.do?boardCategoryId=&boardId=1653650&boardMasterId=939&decorator=&maxIndexPages=10&maxPageItems=10&menuId=10598&orgCd=&pagerOffset=2300&searchKey=&searchValue=) |
| e15 | 식품안전 신고 / 1399 | 부정·불량식품 신고 / 1399 | VALID_BUT_COPY_FIX · correct-copy-and-details | [공식 1](https://www.foodsafetykorea.go.kr/portal/complain/complainIntro.do) |
| c1 | 고속도로 공공렉카 / 1588-2504 | 고속도로 긴급견인 안내 / 1588-2504 | VALID_BUT_COPY_FIX · correct-copy-and-details | [공식 1](https://www.exservice.co.kr/service/callcenter_new.php) · [공식 2](https://www.molit.go.kr/upload/portal/DextUpload/201501/20150113_175930_963.pdf) |
| c2 | 고속도로 긴급견인 / 1588-2100 | 고속도로 긴급견인 안내 / 1588-2504 | WRONG_NUMBER · alias | [공식 1](https://www.nhbank.com/goSubPage.do?srchGb=KO_NHCP_09_07&srchSiteGb=KR) · [공식 2](https://www.exservice.co.kr/service/callcenter_new.php) · [공식 3](https://www.molit.go.kr/upload/portal/DextUpload/201501/20150113_175930_963.pdf) |
| c3 | 교통사고 신고·사실확인 / 112 | 교통사고 긴급 신고 / 112 | VALID_BUT_COPY_FIX · correct-copy-and-details | [공식 1](https://www.112.go.kr/) · [공식 2](https://www.mois.go.kr/frt/sub/a06/b10/emergencycall/screen.do) |
| c4 | 교통사고 부상·구급 / 119 | 교통사고 구조·구급 / 119 | VALID_BUT_COPY_FIX · correct-copy-and-details | [공식 1](https://www.mois.go.kr/frt/sub/a06/b10/emergencycall/screen.do) · [공식 2](https://www.nfa.go.kr/nfa/news/pressrelease/press/?cntId=1851&mode=view) |
| c6 | 무보험 차량 사고 피해 / 1544-0119 | 뺑소니·무보험 사고 피해 지원 / 1544-0049 | WRONG_NUMBER · correct-number | [공식 1](https://tacss.or.kr/notification/board_view.jsp?no=132&page=pressrelease&pagenum=2&tname=tb_reporting) · [공식 2](https://www.korea.kr/news/policyNewsView.do?newsId=148931290) |
| c7 | 사고 후 행정·민원 안내 / 110 | 교통 행정·민원 안내 / 110 | VALID_BUT_COPY_FIX · correct-copy-and-details | [공식 1](https://www.110.go.kr/consult/manual.do) · [공식 2](https://www.110.go.kr/start.do) |
| c8 | 대중교통 분실물 / 182 | 경찰 유실물 문의 / 182 | VALID_BUT_COPY_FIX · correct-copy-and-details | [공식 1](https://www.law.go.kr/LSW/cgmExpcInfoP.do?cgmExpcDatSeq=384398&mode=2&ofiClsCd=350128) |
| c9 | 철도·KTX 고객센터 / 1544-7788 | 코레일 철도 고객센터 / 1544-7788 | VALID_BUT_COPY_FIX · correct-copy-and-details | [공식 1](https://www.korail.com/ticket/guest/notice/22481) · [공식 2](https://info.korail.com/info/selectBbsNttView.do?bbsNo=199&key=911&nttNo=3589) |
| h1 | 이사 후 주소 일괄변경 / 1588-1300 | 우체국 주거이전 우편 안내 / 1588-1300 | VALID_BUT_COPY_FIX · correct-copy-and-details | [공식 1](https://www.koreapost.go.kr/kpost/subIndex/225.do) |
| h2 | 층간소음 갈등 중재 / 1661-2642 | 층간소음 상담·측정 / 1661-2642 | VALID_BUT_COPY_FIX · correct-copy-and-details | [공식 1](https://namc.molit.go.kr/board/boardRead.do?boardGroup=faq&boardNum=248&menu=2&searchKeyWord=) |
| h3 | 전세사기 예방·상담 / 1566-9009 | HUG 전세보증 상담 / 1566-9009 | VALID_BUT_COPY_FIX · correct-copy-and-details | [공식 1](https://onestop.khug.or.kr/webView/webBiz/common/callCenterInfo) |
| h4 | 가스 누출 긴급 / 1670-1004 | 노출 보류 | UNVERIFIED · hold-unverified | [공식 1](https://www.mois.go.kr/frt/sub/a06/b10/emergencycall/screen.do) |
| h5 | 전기 고장·정전 / 123 | 한전 전기 고장·정전 신고 / 123 | VALID_BUT_COPY_FIX · correct-copy-and-details | [공식 1](https://www.kepco.co.kr/home/service/errorinquiry/conts.do) · [공식 2](https://www.kepco.co.kr/home/index.do) |
| h6 | 수도·수질 문의 / 1577-0600 | K-water 고객센터 / 1577-0600 | REGIONAL · correct-copy-and-details | [공식 1](https://www.kwater.or.kr/main.do) · [공식 2](https://www.110.go.kr/consult/manual.do) |
| h7 | 기상특보·날씨 안내 / 131 | 기상청 날씨 상담 / 131 | VALID_BUT_COPY_FIX · correct-copy-and-details | [공식 1](https://www.kma.go.kr/kma/citizen/minwon_03.jsp) |
| l1 | 무료 법률 상담 / 132 | 법률 상담 / 132 | VALID_BUT_COPY_FIX · correct-copy-and-details | [공식 1](https://www.klac.or.kr/legalstruct/telephoneConsultation.do) |
| l2 | 병원비 환급받기 / 1577-1000 | 건강보험·본인부담상한제 / 1577-1000 | VALID_BUT_COPY_FIX · correct-copy-and-details | [공식 1](https://www.nhis.or.kr/nhis/index.do) |
| l3 | 금융 소비자 보호 / 1332 | 금융 소비자 상담 / 1332 | VALID_BUT_COPY_FIX · correct-copy-and-details | [공식 1](https://www.klac.or.kr/legalstruct/telephoneConsultation.do) |
| l4 | 보이스피싱 신고 / 1398 | 보이스피싱·스미싱 신고 / 1394 | WRONG_NUMBER · correct-number | [공식 1](https://www.counterscam112.go.kr/board/CONTENT_000000000010.do) · [공식 2](https://www.korea.kr/multi/mediaNewsView.do?newsId=148972664&pWise=sub&pWiseSub=C4) · [공식 3](https://www.acrc.go.kr/board.es?bid=CDNS&mid=a30103000000) |
| l5 | 개인정보 침해 신고 / 1811-9000 | 개인정보 침해 상담·신고 / 118 | WRONG_NUMBER · correct-number | [공식 1](https://www.kisa.kr/118) |
| l9 | 사이버범죄·해킹 신고 / 118 | 해킹·인터넷 침해 상담 / 118 | VALID_BUT_COPY_FIX · correct-copy-and-details | [공식 1](https://www.kisa.kr/118) |
| l10 | 마약·검찰 범죄신고 / 1301 | 검찰 민원 상담 / 1301 | VALID_BUT_COPY_FIX · correct-copy-and-details | [공식 1](https://www.spo.go.kr/site/spo/06/10614020000002019093006.jsp) |
| d1 | 방송통신 민원 / 1335 | 과기정통부 민원 안내 / 1335 | VALID_BUT_COPY_FIX · correct-copy-and-details | [공식 1](https://www.emsit.go.kr/cp/ci/LstRelatdOrg.do) |
| d2 | 전화번호 안내 / 114 | 휴대폰 통신사 고객센터 / 114 | VALID_BUT_COPY_FIX · correct-copy-and-details | [공식 1](https://www.tworld.co.kr/web/info/refund) · [공식 2](https://www.lguplus.com/support) · [공식 3](https://www.ktcs.co.kr/biz114.do) · [공식 4](https://ktis.co.kr/directoryAssistance.kt) |
| d3 | 방송통신 심의 민원 / 1377 | 방송·통신 심의 신고 / 1377 | VALID_BUT_COPY_FIX · correct-copy-and-details | [공식 1](https://www.safenet.ne.kr/dsystem.do) |
| d4 | 불법스팸 신고 / 118 | 불법스팸 신고·상담 / 118 | VALID_BUT_COPY_FIX · correct-copy-and-details | [공식 1](https://www.kisa.kr/118) |
| l6 | 소비자 분쟁 조정 / 1544-0990 | 소비자 상담센터 / 1372 | OUTDATED · alias | [공식 1](https://www.kca.go.kr/odr/pg/ma/cnsutInfo1.do) |
| l7 | 세금 문의 (국세청) / 126 | 국세 상담 / 126 | VALID · correct-copy-and-details | [공식 1](https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7848) |
| l8 | 지방세 문의 / 1661-7600 | 노출 보류 | UNVERIFIED · hold-unverified | 현행 공식 근거 미확보 |
| l11 | 공정거래 상담 / 1372 | 소비자 상담센터 / 1372 | VALID_BUT_COPY_FIX · correct-copy-and-details | [공식 1](https://www.kca.go.kr/odr/pg/ma/cnsutInfo1.do) |
| l12 | 신용회복·채무조정 / 1600-5500 | 신용회복·채무조정 상담 / 1600-5500 | VALID_BUT_COPY_FIX · correct-copy-and-details | [공식 1](https://overseas.mofa.go.kr/us-atlanta-ko/brd/m_20614/view.do?seq=9) |
| l13 | 서민금융 상담 / 1397 | 서민금융 상담 / 1397 | VALID · correct-copy-and-details | [공식 1](https://www.kinfa.or.kr/main.do) |
| l14 | 인권 상담 / 1331 | 인권 상담 / 1331 | VALID · correct-copy-and-details | [공식 1](https://www.humanrights.go.kr/base/contents/view?contentsNo=15&menuLevel=2&menuNo=108) |
| f1 | 부모님 돌봄 상담 / 1661-2129 | 노인 돌봄 지원 문의 / 1661-2129 | VALID_BUT_COPY_FIX · correct-copy-and-details | [공식 1](https://www.1661-2129.or.kr/) |
| f2 | 학교폭력 신고 / 117 | 학교폭력 신고 / 117 | VALID_BUT_COPY_FIX · correct-copy-and-details | [공식 1](https://theyouthacademy.police.go.kr/bbs/view.do?bbsId=cardnews&pageNum=10&wr_id=160) |
| f3 | 여성긴급전화 / 1366 | 여성긴급전화 / 1366 | VALID_BUT_COPY_FIX · correct-copy-and-details | [공식 1](https://www.women1366.kr/?menuno=227) |
| f4 | 불법촬영 피해 지원 / 1899-0088 | 디지털성범죄 피해 지원 / 02-735-8994 | WRONG_NUMBER · correct-number | [공식 1](https://d4u.stop.or.kr/ko/main) |
| f5 | 외국인 종합 안내 / 1345 | 외국인 종합 안내 / 1345 | VALID · correct-copy-and-details | [공식 1](https://www.immigration.go.kr/moj/196/subview.do) |
| f6 | 청소년 상담 / 1388 | 청소년 상담 / 1388 | VALID_BUT_COPY_FIX · correct-copy-and-details | [공식 1](https://www.kyci.or.kr/userSite/sub02_1_cont.asp) |
| f7 | 국민연금 상담 / 1355 | 국민연금 상담 / 1355 | VALID · correct-copy-and-details | [공식 1](https://www.nps.or.kr/pbcpgdnc/ognzprsn/getOHAG0013M0List.do) |
| f8 | 노인학대 신고·상담 / 1389 | 노인학대 신고·상담 / 1577-1389 | OUTDATED · correct-number | [공식 1](https://noinboho1389.or.kr/) |
| f9 | 실종아동·실종자 / 182 | 실종아동·실종자 안내 / 182 | VALID · correct-copy-and-details | [공식 1](https://www.safe182.go.kr/cont/homeContents.do?contentsNm=182_miss_main) |
| w1 | 실업급여·고용지원금 / 1350 | 고용·노동 상담 / 1350 | VALID_BUT_COPY_FIX · correct-copy-and-details | [공식 1](https://1350.moel.go.kr/home/) |
| w2 | 산재·고용보험 / 1588-0075 | 산재·고용보험 상담 / 1588-0075 | VALID · correct-copy-and-details | [공식 1](https://www.kawf.kr/aei/empNoticeView.do?selIdx=19465) |
| w3 | 내일배움카드·직업교육 / 1644-8000 | 내일배움카드·직업훈련 / 1350 | WRONG_NUMBER · correct-number | [공식 1](https://1350.moel.go.kr/rtmview.do?id=1000314576&page=1&type=ALL) |
| w4 | 직장 내 괴롭힘·성희롱 / 1544-4140 | 직장 내 괴롭힘·노동 상담 / 1350 | UNVERIFIED · correct-number | [공식 1](https://1350.moel.go.kr/home/) · [공식 2](https://www.moel.go.kr/news/enews/report/enewsView.do?news_seq=16169) · [공식 3](https://1350.moel.go.kr/rtmview.do?id=1000322176&page=1&type=ALL) |
| g1 | 정부 민원 콜센터 / 110 | 정부 민원 안내 / 110 | VALID · correct-copy-and-details | [공식 1](https://www.110.go.kr/start.do) |
| g2 | 서울시 다산콜센터 / 02-120 | 서울시 다산콜센터 / 02-120 | REGIONAL · correct-copy-and-details | [공식 1](https://www.seoul.go.kr/seoul/seoul.do) |
| g4 | 경기도 콜센터 / 031-120 | 경기도 콜센터 / 031-120 | REGIONAL · correct-copy-and-details | [공식 1](https://www.gg.go.kr/) |
| g5 | 인천시 콜센터 / 032-120 | 인천시 미추홀콜센터 / 032-120 | REGIONAL · correct-copy-and-details | [공식 1](https://bizok.incheon.go.kr/open_content/manage/tel.jsp) |
| g6 | 부산시 민원120 / 051-120 | 부산시120바로콜센터 / 051-120 | REGIONAL · correct-copy-and-details | [공식 1](https://www.busan.go.kr/minwon/5) |
| g7 | 대구시 콜센터 / 053-120 | 대구시 달구벌콜센터 / 053-120 | REGIONAL · correct-copy-and-details | [공식 1](https://smart.daegu.go.kr/cllctr/cllCtrCnsTp.do) |
| g8 | 광주시 콜센터 / 062-120 | 빛고을콜센터 / 062-120 | REGIONAL · correct-copy-and-details | [공식 1](https://120.gwangju.go.kr/selectBoardList.do?bbsId=BFAQ) |
| g9 | 대전시 콜센터 / 042-120 | 대전시120콜센터 / 042-120 | REGIONAL · correct-copy-and-details | [공식 1](https://daejeon.go.kr/drh/DrhContentsHtmlView.do?menuSeq=1759) |
| g10 | 울산시 콜센터 / 052-120 | 울산시120민원센터 / 052-120 | REGIONAL · correct-copy-and-details | [공식 1](https://www.ulsan.go.kr/u/rep/contents.ulsan?mId=001001013000000000) |
| g11 | 세종시 민원콜센터 / 044-120 | 세종시 민원콜센터 / 044-120 | REGIONAL · correct-copy-and-details | [공식 1](https://bis.sejong.go.kr/ext/w/parkingInfo.view) · [공식 2](https://aichat.sejong.go.kr/) |
| g12 | 강원도 콜센터 / 033-120 | 강원특별자치도 콜센터 / 033-120 | REGIONAL · correct-copy-and-details | [공식 1](https://state.gwd.go.kr/portal/minwon/guide/callCenter) |
| g13 | 충청북도 콜센터 / 043-120 | 노출 보류 | UNVERIFIED · hold-unverified | 현행 공식 근거 미확보 |
| g14 | 충청남도 콜센터 / 041-120 | 노출 보류 | UNVERIFIED · hold-unverified | 현행 공식 근거 미확보 |
| g15 | 전북특별자치도 콜센터 / 063-120 | 노출 보류 | UNVERIFIED · hold-unverified | 현행 공식 근거 미확보 |
| g16 | 전라남도 콜센터 / 061-120 | 노출 보류 | UNVERIFIED · hold-unverified | 현행 공식 근거 미확보 |
| g17 | 경상북도 콜센터 / 054-120 | 노출 보류 | UNVERIFIED · hold-unverified | 현행 공식 근거 미확보 |
| g18 | 경상남도 콜센터 / 055-120 | 경상남도120콜센터 / 055-120 | REGIONAL · correct-copy-and-details | [공식 1](https://www.gyeongnam.go.kr/120/index.gyeong) |
| g19 | 제주특별자치도 콜센터 / 064-120 | 제주특별자치도 콜센터 / 064-120 | REGIONAL · correct-copy-and-details | [공식 1](https://parking.jeju.go.kr/main.cs) |
| g3 | 주민등록·가족관계 / 1588-2188 | 정부24 이용 안내 / 1588-2188 | VALID_BUT_COPY_FIX · correct-copy-and-details | [공식 1](https://plus.gov.kr/) |
| g20 | 관세·해외직구 통관 / 125 | 관세·해외직구 통관 / 125 | VALID · correct-copy-and-details | [공식 1](https://www.customs.go.kr/kcs/cm/cntnts/cntntsView.do?cntntsId=854&mi=2882) |
| g21 | 병무청 상담 / 1588-9090 | 병무청 상담 / 1588-9090 | VALID · correct-copy-and-details | [공식 1](https://www.mma.go.kr/minwon/index.do) |
| org-ins-samsung-auto | 삼성화재 자동차 사고·긴급출동 / 1588-5114 | 삼성화재 자동차 사고·긴급출동 / 1588-5114 | VALID · correct-copy-and-details | [공식 1](https://d.samsungfire.com/claim/submain.html) |
| org-ins-db-auto | DB손해보험 사고·긴급출동 / 1588-0100 | DB손해보험 사고·긴급출동 / 1588-0100 | VALID_BUT_COPY_FIX · correct-copy-and-details | [공식 1](https://www.directdb.co.kr/mainView.do?cmd=main) · [공식 2](https://kiri.or.kr/PDF/weeklytrend/20240213/trend20240213_19.pdf) |
| org-ins-kb-auto | KB손해보험 사고·긴급출동 / 1544-0114 | KB손해보험 사고·긴급출동 / 1544-0114 | VALID · correct-copy-and-details | [공식 1](https://www.kbinsure.co.kr/main.ec?jjout=Y) · [공식 2](https://carinfo.knia.or.kr/lmxsrv/cnswc/icnyCnswcList.do) |
| org-ins-hyundai-auto | 현대해상 자동차 사고·긴급출동 / 1588-5656 | 현대해상 자동차 사고·긴급출동 / 1588-5656 | VALID · correct-copy-and-details | [공식 1](https://cardirect-direct.hi.co.kr/service.do?m=483ee197fc) |
| org-ins-meritz-auto | 메리츠화재 자동차 사고·긴급출동 / 1566-7711 | 메리츠화재 자동차 사고·긴급출동 / 1566-7711 | VALID_BUT_COPY_FIX · correct-copy-and-details | [공식 1](https://store.meritzfire.com/main.do) · [공식 2](https://kiri.or.kr/PDF/weeklytrend/20240213/trend20240213_19.pdf) |
| org-ins-hanwha-auto | 한화손해보험 사고·긴급출동 / 1566-8000 | 한화손해보험 사고·보상 문의 / 1566-8000 | UNVERIFIED · correct-copy-and-details | [공식 1](https://carinfo.knia.or.kr/lmxsrv/cnswc/icnyCnswcList.do) · [공식 2](https://kiri.or.kr/PDF/weeklytrend/20240213/trend20240213_19.pdf) · [공식 3](https://play.google.com/store/apps/details?id=com.hanwha.hima) |
| org-ins-lotte-auto | 롯데손해보험 사고·긴급출동 / 1588-3344 | 롯데손해보험 사고·긴급출동 / 1588-3344 | VALID · correct-copy-and-details | [공식 1](https://www.lotteins.co.kr/web/C/D/I/popcdi010_ars.jsp) |
| org-ins-heungkuk-auto | 흥국화재 자동차 사고·긴급출동 / 1688-1688 | 흥국화재 자동차 사고·긴급출동 / 1688-1688 | VALID · correct-copy-and-details | [공식 1](https://m.heungkukfire.co.kr/servicecenter/uinf/CCSIN0301_M01/CCSIN0301_M01.do) |
| org-ins-mg-auto | MG손해보험 사고·긴급출동 / 1588-5959 | 예별손해보험 사고·긴급출동 / 1588-5959 | OUTDATED · correct-copy-and-details | [공식 1](https://www.yebyeol.co.kr/HP021250DM.scp?menuId=MN0603001) · [공식 2](https://www.fsc.go.kr/po010103/85232) · [공식 3](https://m.yebyeol.co.kr/RW121010MM.scp?menuId=MN5105002) |
| org-ins-axa-auto | AXA손해보험 사고·긴급출동 / 1566-1566 | AXA손해보험 사고·긴급출동 / 1566-1566 | VALID · correct-copy-and-details | [공식 1](https://www.axa.co.kr/cms/benefit/cyms0304/cyms030401/CMKBEI01M01_CMS001.html) |
| org-ins-hana-auto | 하나손해보험 사고·긴급출동 / 1566-3000 | 하나손해보험 사고·긴급출동 / 1566-3000 | VALID · correct-copy-and-details | [공식 1](https://www.hanainsure.co.kr/w/customer/homepageInfo/customerWork) |
| org-ins-carrot-auto | 캐롯손해보험 사고·긴급출동 / 1566-0300 | 노출 보류 | OUTDATED · hold-unverified | [공식 1](https://www.carrotins.com/) · [공식 2](https://kiri.or.kr/PDF/weeklytrend/20260406/trend20260406_7.pdf) · [공식 3](https://kiri.or.kr/PDF/weeklytrend/20240213/trend20240213_19.pdf) |
| org-card-hyundai-lost | 현대카드 도난·분실 신고 / 1577-6200 | 현대카드 도난·분실 신고 / 1577-6200 | VALID · correct-copy-and-details | [공식 1](https://mycompany.hyundaicard.com/cs/cl/CSCL1002.do?_method=l) |
| org-card-samsung-lost | 삼성카드 분실·한도승인 / 1588-8900 | 삼성카드 분실·한도승인 / 1588-8900 | VALID · correct-copy-and-details | [공식 1](https://www.samsungcard.com/personal/customer-service/ars/UHPPCC0221M0.jsp?click=gnb_customer_ars) |
| org-card-lotte-lost | 롯데카드 분실·한도승인 / 1588-8300 | 롯데카드 분실·승인 / 1588-8300 | VALID_BUT_COPY_FIX · correct-copy-and-details | [공식 1](https://mweb2.lottecard.co.kr/app/LPCSTEA_V100.lc) |
| org-card-shinhan-lost | 신한카드 분실·도난 신고 / 1544-7200 | 신한카드 분실·도난 신고 / 1544-7200 | VALID_BUT_COPY_FIX · correct-copy-and-details | [공식 1](https://www.shinhancard.com/conts/store/customor_center/ars_gu/cardLost.jsp) |
| org-card-kb-lost | KB국민카드 분실·가맹점승인 / 1588-1788 | KB국민카드 분실·가맹점승인 / 1588-1788 | VALID · correct-copy-and-details | [공식 1](https://card.kbcard.com/SVC/DVIEW/HSGMCXCRSCSC0030) |
| org-card-woori-lost | 우리카드 분실 신고 / 1588-5300 | 우리카드 분실 신고 / 1588-5300 | VALID · correct-copy-and-details | [공식 1](https://pc.wooricard.com/dcpc/yh1/cct/cct04/H1CCT204S06.do) |
| org-card-hana-lost | 하나카드 분실·도난 신고 / 1800-1111 | 하나카드 분실·도난 신고 / 1800-1111 | VALID_BUT_COPY_FIX · correct-copy-and-details | [공식 1](https://www.hanacard.co.kr/jsp/wcms/scd/sa/OSA10200000P.jsp) · [공식 2](https://m.hanacard.co.kr/MKCNSL6010M.web) |
| org-card-nh-lost | NH농협카드 분실·도난 신고 / 1644-4000 | NH농협카드 분실·도난 신고 / 1644-4000 | VALID · correct-copy-and-details | [공식 1](https://card.nonghyup.com/content/html/ip/ci/ipci1097c.html) |
| org-bank-kb-incident | KB국민은행 분실·사고 신고 / 1588-9999 | KB국민은행 분실·사고 신고 / 1588-9999 | VALID · correct-copy-and-details | [공식 1](https://obank.kbstar.com/quics?page=C028064) |
| org-bank-woori-incident | 우리은행 분실·금융사기 신고 / 1588-5000 | 우리은행 분실·금융사기 신고 / 1588-5000 | VALID · correct-copy-and-details | [공식 1](https://spot.wooribank.com/pot/Dream?withyou=CQACR0001) |

## 생성·수정 파일

- 공유 데이터: `packages/shared/src/{numbers,numberDetails,organizationContacts,contacts,search}.ts`.
- 모바일: `App.tsx`, `components/NumberCards.tsx`, `components/RegionalCallSheet.tsx`, `utils/{phoneCall,regionalDialing}.ts`, 즐겨찾기 hook, 기관 이미지 매핑, iOS/Android 위젯 동기화.
- 번역: 4개 언어의 numbers/details/ui 및 웹 web.json. `index.html`의 정적 안내와 웹 guide 관련 ID도 정정.
- 웹: 즐겨찾기 hook/count, 번호 카드·상세·페이지의 지역 전화 선택.
- 재오염 방지: 구 번역 생성/팁 합성 스크립트는 감사된 JSON 검증 전용으로 전환. 기존 미확인 팁 저장본도 정정.
- `scripts/validate-phone-data.cjs`, `scripts/test-phone-data.cjs`, `audit/corrections.json`, `audit/contact-audit.json`, 개별 근거 보고서와 본 문서.

## 검증 결과

- 정적 validator: 91개, 오류 0, 경고 0. ID·형식·중복·category·situation·상세·번역·tel 변환 확인.
- 오프라인 회귀 테스트 13그룹 통과: manifest 일치, 숫자 검색, 1339 오매핑 제거, 통합/보류 즐겨찾기, 다국어, 34개 지역 전화 조합, 실제 모바일/웹 호출 핸들러, 실제 iOS/Android 스냅샷 생성 코드.
- 모바일 TypeScript 및 웹 TypeScript 통과.
- 수정된 공유·웹 파일 ESLint: 오류 0, 기존 HomePage useMemo 의존성 경고 1. 기존 링크 리다이렉트의 조건부 hook 순서 문제도 보완.
- Vite production build/PWA 생성 통과(기존 번들 500kB 경고 있음).
- Expo iOS/Android export 통과. 이는 JS/자산 번들 생성이며 App Store/Play 네이티브 서명 빌드나 실제 위젯 렌더 검증은 아닙니다.
- 코드 리뷰에서 미확인 즐겨찾기 개수 오류와 iOS Modal 전환 충돌 가능성을 검출해 보완.
- 실제 기관 전화 발신, 실기기 OS 전화 UI, 네이티브 위젯 화면 렌더, Production 배포는 이번에 수행하지 않았습니다.

## 구조 개선 TODO

전수 근거 메타데이터는 `audit/contact-audit.json`에 둬 UI 타입의 대규모 migration을 피했습니다. 다음 단계에서는 공공·기업 공통 verification metadata, 지역별 발신 규칙, 120 그룹화, 마지막 확인일·확인 수준·재검증 주기를 모델로 분리하는 것이 좋습니다. 시간·요금은 추측 대신 nullable/unknown으로 유지해야 합니다.
