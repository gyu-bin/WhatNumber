import { useTranslation } from 'react-i18next';
import { SiteNav } from './SiteNav';
import styles from './Footer.module.css';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className={styles.footer}>
      <SiteNav />
      <p>{t('footer.disclaimer')}</p>
      <p className={styles.logoNote}>{t('footer.logoNote')}</p>
      <p className={styles.note}>{t('footer.favoritesNote')}</p>
    </footer>
  );
}
