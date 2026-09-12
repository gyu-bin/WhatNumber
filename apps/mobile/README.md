# 몇번이야 — 모바일 (Expo)

Expo SDK 56 + EAS Build / EAS Update(OTA) 구성입니다.

## 사전 준비

```bash
# 저장소 루트
npm install

# Expo 로그인 (최초 1회)
eas login
```

## 로컬 실행

```bash
# 저장소 루트
npm run mobile
```

Expo Go로 실행됩니다. 터미널에서 `i`(iOS) / `a`(Android)를 누르세요.

### 코드사이닝 ENOENT 가 뜨면

1. 서버를 끄고 (`Ctrl+C`)
2. 캐시 삭제 후 재시작:

```bash
rm -rf ~/.expo/codesigning/890993d6-97dd-477a-833c-05a7531eb8c0
cd apps/mobile
EXPO_NO_UPDATES=1 npx expo start --go -c
```

로컬 스크립트는 `EXPO_NO_UPDATES=1`로 OTA 서명을 끕니다. EAS 빌드/OTA에는 영향 없습니다.

## EAS 프로젝트

이미 연결됨:

- Expo: https://expo.dev/accounts/rbqls6651/projects/whatnumber
- Project ID: `890993d6-97dd-477a-833c-05a7531eb8c0`
- Update URL: `https://u.expo.dev/890993d6-97dd-477a-833c-05a7531eb8c0`
- Slug: `whatnumber`

다른 계정으로 재연결할 때만:

```bash
cd apps/mobile
eas init --force
eas update:configure
```

## 빌드 프로필

| 프로필 | 용도 | 채널 |
|--------|------|------|
| `development` | Dev Client (시뮬레이터/내부) | `development` |
| `preview` | 내부 배포 APK/IPA | `preview` |
| `production` | 스토어 제출 | `production` |

```bash
# 루트에서
npm run mobile:build:preview -- --platform android
npm run mobile:build:prod -- --platform all
```

## OTA (EAS Update)

JS/에셋만 바뀐 경우 스토어 재심사 없이 배포합니다.
네이티브 모듈·권한·`version`(runtime) 변경 시에는 **새 빌드**가 필요합니다.

```bash
npm run mobile:update:preview -- --message "미리보기 수정"
npm run mobile:update:prod -- --message "긴급 번호 설명 수정"
```

런타임 정책은 `appVersion`입니다. `version`(예: 1.0.0)이 같은 빌드끼리만 OTA를 받습니다.

## 스토어 제출

```bash
npm run mobile:submit -- --platform ios
npm run mobile:submit -- --platform android
```

- 개인정보처리방침: https://whatnumber-mu.vercel.app/privacy
- Bundle ID / package: `kr.whatnumber.app`

## 아이콘 · 스플래시

브랜드 에셋은 루트에서 재생성할 수 있습니다.

```bash
npm run generate-mobile-assets
```

| 파일 | 용도 |
|------|------|
| `assets/icon.png` | iOS / 기본 앱 아이콘 (1024) |
| `assets/android-icon-*.png` | Android Adaptive Icon |
| `assets/splash-icon.png` | 스플래시 (배경 `#111110`) |
| `assets/favicon.png` | 웹 파비콘 |

## 번들 ID

- iOS: `kr.whatnumber.app`
- Android: `kr.whatnumber.app`
- URL scheme: `whatnumber://`
