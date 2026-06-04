import type { NumberItem } from '../data/numbers';
import { iconBgColor, telHref } from '../data/numbers';
import styles from './NumberCard.module.css';

interface NumberCardProps {
  item: NumberItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  isLast?: boolean;
}

export function NumberCard({
  item,
  isFavorite,
  onToggleFavorite,
  isLast,
}: NumberCardProps) {
  const href = telHref(item.num);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite(item.id);
  };

  return (
    <a
      href={href}
      className={`${styles.card} ${isLast ? styles.last : ''}`}
    >
      <div
        className={styles.iconWrap}
        style={{ background: iconBgColor(item.cat) }}
        aria-hidden
      >
        <span className={styles.icon}>{item.icon}</span>
      </div>
      <div className={styles.body}>
        <p className={styles.title}>{item.title}</p>
        <p className={styles.desc}>{item.desc}</p>
      </div>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.favorite}
          data-active={isFavorite || undefined}
          onClick={handleFavorite}
          aria-label={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
        >
          {isFavorite ? '★' : '☆'}
        </button>
        <span className={styles.num}>{item.num}</span>
      </div>
    </a>
  );
}
