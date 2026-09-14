<p align="center">
  <img src="public/icons/icon-192.png" width="96" height="96" alt="몇번이야 로고" />
</p>

<h1 align="center">몇번이야</h1>

<p align="center">
  <strong>진짜 쓸 일 생기는 전화번호 모음</strong><br />
  갑자기 응급실, 고속도로 사고, 전세사기… 있는지도 몰랐던 공공·생활 전화번호를 모았습니다
</p>

<p align="center">
  <a href="https://whatnumber-mu.vercel.app"><strong>whatnumber-mu.vercel.app</strong></a>
  ·
  <a href="https://whatnumber.kr">whatnumber.kr</a> (커스텀 도메인 연결 예정)
</p>

---

## 소개

**몇번이야**는 한국 성인이 긴급·생활 상황에서 바로 쓸 수 있는 전화번호를 모바일 퍼스트로 정리한 웹·앱 서비스입니다. 탭 한 번으로 `tel:` 연결까지 이어지도록 만들었습니다.

### 주요 기능

- **상황별 퀵 필터** — 응급, 차량 고장, 범죄 피해, 주거, 해외, 법률·금융
- **카테고리** — 긴급/안전, 교통/차량, 주거/생활, 법률/금융, 가족/복지, 고용/노동, 민원/행정, 통신/디지털
- **검색** — 제목·설명·번호 텍스트 검색
- **즐겨찾기** — 웹은 `localStorage`, 앱은 AsyncStorage (+ 홈 화면 위젯)
- **공유** — 링크 복사·시스템 공유, OG 메타·미리보기 이미지
- **PWA** — 오프라인 캐시, 홈 화면 설치
- **테마** — 라이트/다크 (`localStorage` / AsyncStorage)
- **모바일** — 내 주변 응급실(네이버 지도), AdMob 배너, EAS OTA

---

## 기술 스택

| 영역 | 선택 |
|------|------|
| 웹 | React 19 + TypeScript, Vite 8, CSS Modules, react-router-dom v7 |
| PWA | vite-plugin-pwa |
| 모바일 | Expo (Dev Client / EAS Build / OTA) |
| 공용 데이터 | `packages/shared` |
| 배포 | [Vercel](https://vercel.com) |

---

## 로컬 실행

```bash
git clone https://github.com/gyu-bin/WhatNumber.git
cd WhatNumber
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 을 엽니다.

모바일:

```bash
npm run mobile
# 네이버 지도 등 네이티브 모듈은 Dev Client 필요
# cd apps/mobile && EXPO_NO_UPDATES=1 npx expo run:ios
```

### 환경 변수

`.env.example`을 복사해 `.env`를 만듭니다.

```bash
cp .env.example .env
```

| 변수 | 설명 |
|------|------|
| `VITE_SITE_URL` | 배포 URL (기본: `https://whatnumber-mu.vercel.app`) |
| `VITE_ADSENSE_PUBLISHER_ID` | AdSense 게시자 ID |
| `VITE_NUMBER_REQUEST_API_URL` | 번호 요청 API (선택) |
| `RESEND_API_KEY` | 번호 요청/피드백 메일 발송 (Vercel 서버 전용) |
| `NEMC_EMERGENCY_API_KEY` | 응급실 공공 API 키 (Vercel 서버 전용) |
| `EXPO_PUBLIC_EMERGENCY_API_BASE_URL` | 모바일 응급실 API 베이스 URL |
| `EXPO_PUBLIC_NUMBER_REQUEST_API_URL` | 모바일 번호 요청 API URL |

---

## 빌드 & 배포

```bash
npm run build    # OG·아이콘 자동 생성 포함
npm run preview  # 프로덕션 미리보기
```

### Vercel

```bash
vercel --prod
```

`vercel.json`에 SPA rewrite가 설정되어 있습니다.

### AdSense `ads.txt` / AdMob `app-ads.txt`

웹은 `ads.txt`, 앱(AdMob)은 `app-ads.txt`가 필요합니다. 둘 다 같은 게시자 한 줄입니다.

1. [AdSense](https://www.google.com/adsense/) / [AdMob](https://admob.google.com) → 계정 설정의 게시자 ID `pub-`… 확인  
2. 프로젝트 루트 `.env`:

   ```env
   VITE_ADSENSE_PUBLISHER_ID=pub-여기16자리
   ```

3. 생성 후 배포:

   ```bash
   npm run generate-ads-txt
   vercel --prod
   ```

4. 확인:
   - `https://whatnumber-mu.vercel.app/ads.txt`
   - `https://whatnumber-mu.vercel.app/app-ads.txt`

5. 스토어에 개발자 웹사이트 URL을 **정확히 그 도메인**으로 넣어야 AdMob이 크롤합니다.

---

## 프로젝트 구조

```
src/                     # 웹 앱
apps/mobile/             # Expo 네이티브 앱
packages/shared/         # 웹·앱 공용 번호/검색 로직
api/                     # Vercel Functions (emergency, number-request)
public/                  # PWA 아이콘, ads.txt, OG
```

네이티브 앱 빌드·OTA·스토어 Data Safety 체크는 [`apps/mobile/README.md`](apps/mobile/README.md)를 참고하세요.

---

## 번호 데이터 수정

`packages/shared/src/numbers.ts` (및 기업 연락처는 `organizationContacts.ts`)를 편집하면 됩니다.
새 항목 추가 시 `id`, `cat`, `situation` 필드를 맞춰 주세요.

---

## 라이선스

MIT — 자유롭게 사용·수정·배포할 수 있습니다. 번호 정보의 정확성은 각 기관 공식 안내를 우선해 주세요.

---

<p align="center">
  Made with care for moments you really need a number.
</p>
