import { CATEGORIES } from '../data/numbers';
import styles from './CategoryFilter.module.css';

interface CategoryFilterProps {
  active: string;
  onSelect: (id: string) => void;
  disabled?: boolean;
}

const CHIPS = [
  ...CATEGORIES,
  { id: 'favorites', label: '⭐ 즐겨찾기' },
];

export function CategoryFilter({ active, onSelect, disabled }: CategoryFilterProps) {
  return (
    <div className={`${styles.wrap} ${disabled ? styles.disabled : ''}`}>
      <div className={`${styles.scroll} scrollbar-hidden`} role="tablist" aria-label="카테고리">
        {CHIPS.map((chip) => (
          <button
            key={chip.id}
            type="button"
            role="tab"
            aria-selected={active === chip.id}
            className={styles.chip}
            data-active={active === chip.id || undefined}
            onClick={() => !disabled && onSelect(chip.id)}
            disabled={disabled}
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  );
}
