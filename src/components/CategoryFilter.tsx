import { CATEGORIES } from '@whatnumber/shared';
import { useTranslation } from 'react-i18next';
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
  { id: 'favorites', label: 'favorites' },
  ...CATEGORIES.slice(1),
];

export function CategoryFilter({
  active,
  onSelect,
  disabled,
  situationActive = false,
  favoritesCount = 0,
}: CategoryFilterProps) {
  const { t } = useTranslation();

  return (
    <div className={`${styles.wrap} ${disabled ? styles.disabled : ''}`}>
      <div className={styles.inner}>
        <div
          className={`${styles.scroll} scrollbar-hidden`}
          role="tablist"
          aria-label={t('categories.filterA11y')}
        >
          {CHIPS.map((chip) => {
            const isFavChip = chip.id === 'favorites';
            const isActive = active === chip.id && !situationActive;
            const categoryLabel =
              chip.id === 'favorites'
                ? t('categories.favorites')
                : t(`categories.${chip.id}`);
            const label = isFavChip
              ? favoritesCount > 0
                ? `⭐ ${favoritesCount}`
                : '⭐'
              : categoryLabel;

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
                aria-label={
                  isFavChip
                    ? t('categories.favoritesA11y', { count: favoritesCount })
                    : categoryLabel
                }
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
