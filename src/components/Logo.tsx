import styles from './Logo.module.css';
import brandLogo from '../assets/logo-256.png';

interface LogoProps {
  size?: 'full' | 'compact';
  showSubtitle?: boolean;
}

export function Logo({ size = 'full', showSubtitle = false }: LogoProps) {
  const isFull = size === 'full';

  return (
    <div className={`${styles.logo} ${isFull ? styles.full : styles.compact}`}>
      <img
        className={styles.icon}
        src={brandLogo}
        alt=""
        width={isFull ? 58 : 34}
        height={isFull ? 58 : 34}
        decoding="async"
      />
      <div className={styles.text}>
        <span className={styles.wordmark}>몇번이야</span>
        {(isFull || showSubtitle) && (
          <span className={styles.sub}>진짜 쓸 일 생기는 번호 모음</span>
        )}
      </div>
    </div>
  );
}
