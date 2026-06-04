<p align="center">
  <img src="public/icons/icon-192.png" width="96" height="96" alt="몇번이야 로고" />
</p>

<h1 align="center">몇번이야</h1>

<p align="center">
  <strong>진짜 쓸 일 생기는 번호 모음</strong><br />
  갑자기 응급실, 고속도로 사고, 전세사기… 있는지도 몰랐던 공공 전화번호 35개
</p>

<p align="center">
  <a href="https://whatnumber-mu.vercel.app"><strong>whatnumber-mu.vercel.app</strong></a>
  ·
  <a href="https://myeonbeoniya.kr">myeonbeoniya.kr</a> (커스텀 도메인 연결 예정)
</p>

---

## 소개

**몇번이야**는 한국 성인이 긴급·생활 상황에서 바로 쓸 수 있는 공공 전화번호를 모바일 퍼스트로 정리한 웹 앱입니다. 카카오톡 공유와 PWA 홈 화면 추가를 염두에 두고, 탭 한 번으로 `tel:` 연결까지 이어지도록 만들었습니다.

### 주요 기능

- **상황별 퀵 필터** — 응급, 차량 고장, 범죄 피해, 주거, 해외, 법률·금융
- **카테고리 칩** — 7개 분야 + 즐겨찾기
- **검색** — 제목·설명·번호 텍스트 검색 (검색 시 다른 필터 비활성)
- **즐겨찾기** — `localStorage`에 저장
- **카카오톡 / 네이티브 공유** — OG 메타·미리보기 이미지 포함
- **PWA** — 오프라인 캐시, 홈 화면 설치
- **테마** — 기본 다크(블랙), 헤더 버튼으로 라이트/다크 수동 전환 (`localStorage` 저장)

---

## 기술 스택

| 영역 | 선택 |
|------|------|
| 프레임워크 | React 19 + TypeScript |
| 빌드 | Vite 8 |
| 스타일 | CSS Modules (Tailwind 없음) |
| 라우팅 | react-router-dom v7 (확장 대비) |
| PWA | vite-plugin-pwa |
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

### 환경 변수

`.env.example`을 복사해 `.env`를 만듭니다.

```bash
cp .env.example .env
```

| 변수 | 설명 |
|------|------|
| `VITE_KAKAO_APP_KEY` | [카카오 개발자 콘솔](https://developers.kakao.com) JavaScript 앱 키 |
| `VITE_SITE_URL` | 배포 URL (기본: `https://myeonbeoniya.kr`) |

카카오 공유를 쓰려면 **플랫폼 → Web → 사이트 도메인**에 배포 URL을 등록해야 합니다.

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

---

## 프로젝트 구조

```
src/
├── data/numbers.ts      # 번호 데이터 · 카테고리 색상
├── hooks/useFavorites.ts
├── utils/kakao.ts
├── components/          # Header, SearchBar, NumberCard …
├── styles/              # global.css, variables.css
├── App.tsx
└── main.tsx

public/
├── icons/               # PWA 아이콘
├── og-image.png         # 카카오·SNS 미리보기
└── apple-touch-icon.png

scripts/generate-assets.mjs  # 아이콘·OG 이미지 생성
```

---

## 번호 데이터 수정

`src/data/numbers.ts`의 `NUMBERS` 배열을 편집하면 됩니다. 새 항목 추가 시 `id`, `cat`, `situation` 필드를 맞춰 주세요.

---

## 라이선스

MIT — 자유롭게 사용·수정·배포할 수 있습니다. 번호 정보의 정확성은 각 기관 공식 안내를 우선해 주세요.

---

<p align="center">
  Made with care for moments you really need a number.
</p>
