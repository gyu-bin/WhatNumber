import type { Category, NumberItem } from '@whatnumber/shared';
import { CAT_COLOR } from '@whatnumber/shared';
import { useTranslation } from 'react-i18next';
import { NumberCard } from './NumberCard';
import styles from './NumberList.module.css';

interface NumberListProps {
  items: NumberItem[];
  groupByCategory: boolean;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  mode?: 'default' | 'favorites';
}

const CATEGORY_ORDER: Category[] = [
  '긴급/안전',
  '교통/차량',
  '주거/생활',
  '법률/금융',
  '가족/복지',
  '고용/노동',
  '민원/행정',
  '통신/디지털',
];

function CardGrid({
  items,
  isFavorite,
  onToggleFavorite,
}: {
  items: NumberItem[];
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
}) {
  return (
    <div className={styles.cardGrid}>
      {items.map((item) => (
        <NumberCard
          key={item.id}
          item={item}
          isFavorite={isFavorite(item.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}

export function NumberList({
  items,
  groupByCategory,
  isFavorite,
  onToggleFavorite,
  mode = 'default',
}: NumberListProps) {
  const { t } = useTranslation();

  if (items.length === 0) {
    if (mode === 'favorites') {
      return (
        <div className={styles.empty}>
          <p className={styles.emptyIcon} aria-hidden>
            ☆
          </p>
          <p className={styles.emptyTitle}>{t('favorites.emptyTitle')}</p>
          <p className={styles.emptyHint}>{t('favorites.emptyHint')}</p>
        </div>
      );
    }
    return (
      <div className={styles.empty}>
        <p>{t('list.empty')}</p>
      </div>
    );
  }

  if (!groupByCategory) {
    return (
      <section className={styles.section}>
        <div className={styles.panel}>
          {mode === 'favorites' && (
            <h2 className={styles.favHeader}>
              <span className={styles.favHeaderStar} aria-hidden>
                ★
              </span>
              {t('favorites.header', { count: items.length })}
            </h2>
          )}
          <CardGrid
            items={items}
            isFavorite={isFavorite}
            onToggleFavorite={onToggleFavorite}
          />
        </div>
      </section>
    );
  }

  const grouped = CATEGORY_ORDER.map((cat) => ({
    cat,
    items: items.filter((n) => n.cat === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <>
      {grouped.map(({ cat, items: groupItems }) => (
        <section key={cat} className={styles.section}>
          <div className={styles.panel}>
            <h2
              className={styles.catHeader}
              style={{ color: CAT_COLOR[cat] }}
            >
              {t(`categories.${cat}`)}
            </h2>
            <CardGrid
              items={groupItems}
              isFavorite={isFavorite}
              onToggleFavorite={onToggleFavorite}
            />
          </div>
        </section>
      ))}
    </>
  );
}
