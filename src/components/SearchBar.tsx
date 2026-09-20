import { useTranslation } from 'react-i18next';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  query: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function SearchBar({ query, onChange, disabled }: SearchBarProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.wrap}>
      <div className={`${styles.bar} ${disabled ? styles.disabled : ''}`}>
        <span className={styles.icon} aria-hidden>
          🔍
        </span>
        <input
          type="search"
          className={styles.input}
          placeholder={t('search.placeholder')}
          value={query}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          aria-label={t('search.a11y')}
        />
        {query && (
          <button
            type="button"
            className={styles.clear}
            onClick={() => onChange('')}
            aria-label={t('search.clearA11y')}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
