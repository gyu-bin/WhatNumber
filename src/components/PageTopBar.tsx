import { Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../hooks/useTheme';
import styles from './PageTopBar.module.css';

interface PageTopBarProps {
  title: string;
}

export function PageTopBar({ title }: PageTopBarProps) {
  const { theme, toggle } = useTheme();

  return (
    <header className={styles.bar}>
      <Link to="/" className={styles.brand}>
        몇번이야
      </Link>
      <span className={styles.title}>{title}</span>
      <ThemeToggle theme={theme} onToggle={toggle} />
    </header>
  );
}
