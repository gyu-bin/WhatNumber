const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://myeonbeoniya.kr';

declare global {
  interface Window {
    Kakao?: {
      isInitialized: () => boolean;
      init: (key: string) => void;
      Share: {
        sendDefault: (options: Record<string, unknown>) => void;
      };
    };
  }
}

export function initKakao(): void {
  const key = import.meta.env.VITE_KAKAO_APP_KEY;
  if (!key || !window.Kakao) return;
  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(key);
  }
}

export function shareToKakao(): void {
  const key = import.meta.env.VITE_KAKAO_APP_KEY;
  if (!key || !window.Kakao?.isInitialized()) {
    alert('카카오 공유는 앱 키 설정 후 사용할 수 있어요.');
    return;
  }

  window.Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title: '몰라서 못 쓴 번호들',
      description:
        '갑자기 응급실, 고속도로 사고, 전세사기... 진짜 쓸 일 생기는 번호 35개 모음',
      imageUrl: `${SITE_URL}/og-image.png`,
      link: {
        mobileWebUrl: SITE_URL,
        webUrl: SITE_URL,
      },
    },
    buttons: [
      {
        title: '번호 보러가기',
        link: {
          mobileWebUrl: SITE_URL,
          webUrl: SITE_URL,
        },
      },
    ],
  });
}

export async function shareNative(): Promise<void> {
  const shareData = {
    title: '몇번이야 — 몰라서 못 쓴 번호들',
    text: '갑자기 쓸 일 생기는 공공 전화번호 35개. 탭하면 바로 전화 연결.',
    url: SITE_URL,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch {
      /* user cancelled */
    }
    return;
  }

  try {
    await navigator.clipboard.writeText(SITE_URL);
    alert('링크가 복사됐어요!');
  } catch {
    alert(SITE_URL);
  }
}
