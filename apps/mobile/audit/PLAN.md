# 전화번호 전수 재검증 계획

- 기준일: 2026-09-30
- 기준 브랜치: main `140c7f6c1a64308383e6def835978e4e52a9fe9f` (원격 main과 일치 확인)
- 원본: 공공 82개, 기업 22개, 합계 104개. 사용자가 직접 저장한 번호/동적 응급실 결과는 정적 연락처 감사에 포함하지 않음.

1. 공공·기업 연락처 및 상세 설명을 공식 페이지 본문과 대조한다. 확인되지 않은 번호/운영시간/요금은 추측하지 않는다.
2. 확인된 오류는 공유 원본·상세·검색 키워드·번역·상황 가이드에서 함께 고친다. ID는 유지하고 통합 번호의 구 ID는 호환 처리를 검토한다.
3. 중복은 같은 번호 자체가 아니라 실제 기관/서비스 중복 여부로 판단한다. 범위별 항목을 무조건 삭제하지 않는다.
4. 감사 결과와 출처를 UI 타입과 분리해 기록한다. regional/organization 범위와 unknown 필드를 명시한다.
5. 정적 데이터 검사, 검색 회귀, 구 ID 즐겨찾기, iOS/Android snapshot 생성, TypeScript와 웹/모바일 번들 빌드로 확인한다.

## 소비 경로

- Web 목록/상세/SEO: NUMBERS/getNumberById/getNumberDetail → 모바일의 동일 번역 JSON을 읽는 웹 i18n.
- Mobile 목록/카테고리/검색/상세: ALL_NUMBERS → localizeNumbers/localizeNumberDetail → shared search.
- Favorites: `favorites_v1`의 ID 배열. 존재하지 않는 ID는 현재 목록·위젯에서 건너뛴다.
- Widget: iOS/Android sync가 ALL_NUMBERS에서 ID를 찾아 현재 번호와 번역된 제목으로 snapshot을 생성한다.
- 상세/검색: NUMBER_DETAILS도 검색 blob에 포함하므로 부정확한 상세가 남으면 잘못된 검색 결과가 다시 노출된다.

## 초기 정적 검사

- duplicate ID/빈 필드/형식/카테고리/상황 오류: 0.
- 상세 누락: 통신 4개 및 기업 22개.
- 삭제된 c5 번역 잔재: 4개 언어의 numbers/details, 합계 8개.
- 번호 중복 후보: 119, 112, 110, 182, 118. 서비스 범위별 별도 노출 여부를 감사에서 판단한다.
