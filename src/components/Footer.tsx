import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <p>
        번호는 주기적으로 업데이트됩니다 · 정확한 정보는 각 기관에서 확인하세요
      </p>
      <p className={styles.note}>즐겨찾기는 이 기기·브라우저에만 저장됩니다</p>
    </footer>
  );
}
