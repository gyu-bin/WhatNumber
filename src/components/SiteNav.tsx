import { Link, useLocation } from 'react-router-dom';
import styles from './SiteNav.module.css';

const LINKS = [
  { to: '/', label: '번호 목록' },
  { to: '/guide', label: '상황별 가이드' },
  { to: '/about', label: '서비스 소개' },
  { to: '/privacy', label: '개인정보처리방침' },
] as const;

export function SiteNav() {
  const { pathname } = useLocation();

  return (
    <nav className={styles.nav} aria-label="사이트 메뉴">
      {LINKS.map(({ to, label }) => {
        const active = to === '/' ? pathname === '/' : pathname.startsWith(to);
        return (
          <Link
            key={to}
            to={to}
            className={styles.link}
            data-active={active || undefined}
            aria-current={active ? 'page' : undefined}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
