import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import type { Theme } from '../utils/theme';
import styles from './Header.module.css';

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
  onCopyLink: () => void;
}

export function Header({ theme, onToggleTheme, onCopyLink }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
        <Logo size="compact" />
        <div className={styles.actions}>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button
            type="button"
            className={styles.shareBtn}
            onClick={onCopyLink}
            aria-label="웹 주소 복사"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M8 4a2 2 0 0 0-2 2v2H5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-1h2a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.41l-4.83-4.84A2 2 0 0 0 12.17 3H8Zm0 2h4.17L18 9.83V16h-2v-2a3 3 0 0 0-3-3H8V6Zm-1 6a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-8Z"
                fill="currentColor"
              />
            </svg>
            링크
          </button>
        </div>
      </div>
      <span className={styles.badge}>생활 꿀팁</span>
      <h1 className={styles.title}>몰라서 못 쓴 번호들</h1>
      <p className={styles.subtitle}>
        카드 탭하면 상세 · 번호 탭하면 전화 연결
      </p>
    </header>
  );
}
