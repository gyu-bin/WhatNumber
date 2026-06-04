import styles from './SearchBar.module.css';

interface SearchBarProps {
  query: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function SearchBar({ query, onChange, disabled }: SearchBarProps) {
  return (
    <div className={styles.wrap}>
      <div className={`${styles.bar} ${disabled ? styles.disabled : ''}`}>
        <span className={styles.icon} aria-hidden>
          🔍
        </span>
        <input
          type="search"
          className={styles.input}
          placeholder="번호 이름이나 상황을 검색하세요"
          value={query}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          aria-label="번호 검색"
        />
        {query && (
          <button
            type="button"
            className={styles.clear}
            onClick={() => onChange('')}
            aria-label="검색어 지우기"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
