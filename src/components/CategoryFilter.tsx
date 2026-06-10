import { CATEGORIES } from '@whatnumber/shared';
import styles from './CategoryFilter.module.css';

interface CategoryFilterProps {
  active: string;
  onSelect: (id: string) => void;
  disabled?: boolean;
  situationActive?: boolean;
  favoritesCount?: number;
}

const CHIPS = [
  CATEGORIES[0],
  { id: 'favorites', label: '즐겨찾기' },
  ...CATEGORIES.slice(1),
];

export function CategoryFilter({
  active,
  onSelect,
  disabled,
  situationActive = false,
  favoritesCount = 0,
}: CategoryFilterProps) {
  return (
    <div className={`${styles.wrap} ${disabled ? styles.disabled : ''}`}>
      <div className={styles.inner}>
        <div
          className={`${styles.scroll} scrollbar-hidden`}
          role="tablist"
          aria-label="카테고리"
        >
          {CHIPS.map((chip) => {
            const isFavChip = chip.id === 'favorites';
            const isActive = active === chip.id && !situationActive;
            const label = isFavChip
              ? favoritesCount > 0
                ? `⭐ ${favoritesCount}`
                : '⭐'
              : chip.label;

            return (
              <button
                key={chip.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={styles.chip}
                data-active={isActive || undefined}
                data-favorites={isFavChip || undefined}
                onClick={() => !disabled && onSelect(chip.id)}
                disabled={disabled}
                aria-label={isFavChip ? `즐겨찾기 ${favoritesCount}개` : chip.label}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
