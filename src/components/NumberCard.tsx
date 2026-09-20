import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { NumberItem } from '@whatnumber/shared';
import { iconBgColor, telHref } from '@whatnumber/shared';
import { numberPath } from '../utils/seo';
import styles from './NumberCard.module.css';

interface NumberCardProps {
  item: NumberItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export function NumberCard({
  item,
  isFavorite,
  onToggleFavorite,
}: NumberCardProps) {
  const { t } = useTranslation();

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite(item.id);
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Link
      to={numberPath(item.id)}
      className={styles.card}
      aria-label={t('card.viewA11y', { title: item.title, num: item.num })}
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
          aria-label={isFavorite ? t('favorites.remove') : t('favorites.add')}
        >
          {isFavorite ? '★' : '☆'}
        </button>
        <a
          href={telHref(item.num)}
          className={styles.num}
          onClick={handleCall}
          aria-label={t('card.callA11y', { num: item.num })}
        >
          {item.num}
        </a>
      </div>
    </Link>
  );
}
