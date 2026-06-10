import type { NumberItem } from '@whatnumber/shared';
import { iconBgColor, telHref } from '@whatnumber/shared';
import styles from './NumberCard.module.css';

interface NumberCardProps {
  item: NumberItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpen: (id: string) => void;
}

export function NumberCard({
  item,
  isFavorite,
  onToggleFavorite,
  onOpen,
}: NumberCardProps) {
  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(item.id);
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpen(item.id);
    }
  };

  return (
    <div
      className={styles.card}
      role="button"
      tabIndex={0}
      onClick={() => onOpen(item.id)}
      onKeyDown={handleKeyDown}
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
        <a
          href={telHref(item.num)}
          className={styles.num}
          onClick={handleCall}
          aria-label={`${item.num} 전화`}
        >
          {item.num}
        </a>
      </div>
    </div>
  );
}
