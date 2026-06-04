import styles from './FavoritesBar.module.css';

interface FavoritesBarProps {
  count: number;
  onOpen: () => void;
}

export function FavoritesBar({ count, onOpen }: FavoritesBarProps) {
  if (count === 0) return null;

  return (
    <button type="button" className={styles.bar} onClick={onOpen}>
      <span className={styles.star} aria-hidden>
        ★
      </span>
      <span className={styles.text}>
        내 즐겨찾기 <strong>{count}개</strong>
      </span>
      <span className={styles.action}>모아보기</span>
    </button>
  );
}
