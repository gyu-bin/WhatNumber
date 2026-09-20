import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './SiteNav.module.css';

const LINKS = [
  { to: '/', key: 'home' as const },
  { to: '/guide', key: 'guides' as const },
  { to: '/about', key: 'about' as const },
  { to: '/privacy', key: 'privacy' as const },
] as const;

export function SiteNav() {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  return (
    <nav className={styles.nav} aria-label={t('nav.siteMenu')}>
      {LINKS.map(({ to, key }) => {
        const active = to === '/' ? pathname === '/' : pathname.startsWith(to);
        return (
          <Link
            key={to}
            to={to}
            className={styles.link}
            data-active={active || undefined}
            aria-current={active ? 'page' : undefined}
          >
            {t(`nav.${key}`)}
          </Link>
        );
      })}
    </nav>
  );
}
