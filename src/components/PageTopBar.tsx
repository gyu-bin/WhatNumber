import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelect } from './LanguageSelect';
import { useLocale } from '../hooks/useLocale';
import { useTheme } from '../hooks/useTheme';
import styles from './PageTopBar.module.css';

interface PageTopBarProps {
  title: string;
}

export function PageTopBar({ title }: PageTopBarProps) {
  const { t } = useTranslation();
  const { theme, toggle } = useTheme();
  const { locale, setLocale } = useLocale();

  return (
    <header className={styles.bar}>
      <Link to="/" className={styles.brand}>
        {t('brand.name')}
      </Link>
      <span className={styles.title}>{title}</span>
      <div className={styles.actions}>
        <LanguageSelect locale={locale} onChange={setLocale} />
        <ThemeToggle theme={theme} onToggle={toggle} />
      </div>
    </header>
  );
}
