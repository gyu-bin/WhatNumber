import styles from './Logo.module.css';

interface LogoProps {
  size?: 'full' | 'compact';
}

export function Logo({ size = 'full' }: LogoProps) {
  const isFull = size === 'full';

  return (
    <div className={`${styles.logo} ${isFull ? styles.full : styles.compact}`}>
      <div className={styles.icon} aria-hidden>
        <span>?</span>
      </div>
      <div className={styles.text}>
        <span className={styles.wordmark}>몇번이야</span>
        {isFull && (
          <span className={styles.sub}>진짜 쓸 일 생기는 번호 모음</span>
        )}
      </div>
    </div>
  );
}
