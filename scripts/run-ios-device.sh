#!/usr/bin/env bash
# 실기기 개발 빌드 (EAS 크레딧 불필요)
# 사용: iPhone USB 연결 후 이 스크립트를 Terminal.app에서 실행
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MOBILE="$ROOT/apps/mobile"
CMAKE_BIN="$MOBILE/.tools/cmake/CMake.app/Contents/bin"

cd "$MOBILE"

if [[ ! -d ios ]]; then
  echo "→ expo prebuild"
  npx expo prebuild --platform ios
fi

if [[ ! -x "$CMAKE_BIN/cmake" ]]; then
  echo "→ downloading portable cmake"
  mkdir -p "$MOBILE/.tools"
  curl -L "https://github.com/Kitware/CMake/releases/download/v3.31.6/cmake-3.31.6-macos-universal.tar.gz" \
    -o "$MOBILE/.tools/cmake.tgz"
  tar -xzf "$MOBILE/.tools/cmake.tgz" -C "$MOBILE/.tools"
  mv "$MOBILE/.tools/cmake-3.31.6-macos-universal" "$MOBILE/.tools/cmake"
fi

export PATH="$CMAKE_BIN:$PATH"
echo "cmake: $(which cmake)"

VERSION="250829098.0.10"
HERMES_DIR="$ROOT/node_modules/react-native/sdks/hermes-engine/download/artifacts"
HERMES_TGZ="$HERMES_DIR/hermes-ios-${VERSION}-debug.tar.gz"
HERMES_URL="https://repo1.maven.org/maven2/com/facebook/hermes/hermes-ios/${VERSION}/hermes-ios-${VERSION}-hermes-ios-debug.tar.gz"

mkdir -p "$HERMES_DIR"
if [[ ! -f "$HERMES_TGZ" ]]; then
  echo "→ downloading Hermes prebuild"
  curl -L "$HERMES_URL" -o "$HERMES_TGZ"
fi
export HERMES_ENGINE_TARBALL_PATH="$HERMES_TGZ"

echo "→ pod install"
(
  cd ios
  pod install
)

# Safety net for Xcode 26: resource-bundle pods sometimes keep IPHONEOS_DEPLOYMENT_TARGET < 15
python3 - <<'PY'
from pathlib import Path
import re
path = Path("ios/Pods/Pods.xcodeproj/project.pbxproj")
if not path.exists():
    raise SystemExit(0)
text = path.read_text()
def bump(m):
    ver = m.group(1)
    parts = [int(x) for x in ver.split(".")]
    while len(parts) < 2:
        parts.append(0)
    if parts[0] < 16 or (parts[0] == 16 and parts[1] < 4):
        return "IPHONEOS_DEPLOYMENT_TARGET = 16.4;"
    return m.group(0)
new, n = re.subn(r"IPHONEOS_DEPLOYMENT_TARGET = ([0-9.]+);", bump, text)
path.write_text(new)
print(f"→ bumped {n} Pods deployment targets to >= 16.4")
PY

echo "→ build & install on device"
# 기기가 여러 대면 목록에서 선택됩니다
npx expo run:ios --device

echo ""
echo "설치 후:"
echo "1) 앱을 한 번 실행해 즐겨찾기를 추가"
echo "2) 홈 화면 길게 누르기 → 위젯 추가 → 몇번이야 → 즐겨찾기 전화"
echo "3) 기존 위젯이 있으면 제거 후 다시 추가"
