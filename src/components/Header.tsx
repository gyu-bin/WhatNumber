import { Logo } from './Logo';
import { shareNative, shareToKakao } from '../utils/kakao';
import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
        <Logo size="compact" />
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.shareBtn}
            onClick={() => void shareNative()}
            aria-label="링크 공유"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M18 8a3 3 0 1 0-2.83-4H14v2h1.17a1 1 0 1 1 0 2H14v2h1.17A3 3 0 0 0 18 8ZM6 16a3 3 0 1 0 2.83 4H10v-2H8.83a1 1 0 1 1 0-2H10v-2H8.83A3 3 0 0 0 6 16ZM16.59 7.41 7.41 16.59l1.42 1.42 9.18-9.18-1.42-1.42Z"
                fill="currentColor"
              />
            </svg>
          </button>
          <button
            type="button"
            className={styles.kakaoBtn}
            onClick={shareToKakao}
          >
            공유
          </button>
        </div>
      </div>
      <span className={styles.badge}>생활 꿀팁</span>
      <h1 className={styles.title}>몰라서 못 쓴 번호들</h1>
      <p className={styles.subtitle}>
        알면 진짜 써먹는 정보 · 번호 탭하면 전화 연결
      </p>
    </header>
  );
}
