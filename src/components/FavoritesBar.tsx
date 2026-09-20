import { useTranslation } from 'react-i18next';
import styles from './FavoritesBar.module.css';

interface FavoritesBarProps {
  count: number;
  onOpen: () => void;
}

export function FavoritesBar({ count, onOpen }: FavoritesBarProps) {
  const { t } = useTranslation();

  if (count === 0) return null;

  return (
    <button type="button" className={styles.bar} onClick={onOpen}>
      <span className={styles.star} aria-hidden>
        ★
      </span>
      <span className={styles.text}>
        {t('favorites.barPrefix')}{' '}
        <strong>{t('favorites.barCount', { count })}</strong>
      </span>
      <span className={styles.action}>{t('favorites.viewAll')}</span>
    </button>
  );
}
