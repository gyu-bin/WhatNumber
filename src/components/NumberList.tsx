import type { Category, NumberItem } from '../data/numbers';
import { CAT_COLOR } from '../data/numbers';
import { NumberCard } from './NumberCard';
import styles from './NumberList.module.css';

interface NumberListProps {
  items: NumberItem[];
  groupByCategory: boolean;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
}

const CATEGORY_ORDER: Category[] = [
  '긴급/안전',
  '교통/차량',
  '주거/생활',
  '법률/금융',
  '가족/복지',
  '고용/노동',
  '민원/행정',
];

export function NumberList({
  items,
  groupByCategory,
  isFavorite,
  onToggleFavorite,
}: NumberListProps) {
  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <p>해당하는 번호가 없어요</p>
      </div>
    );
  }

  if (!groupByCategory) {
    return (
      <section className={styles.section}>
        <div className={styles.cardWrap}>
          {items.map((item, i) => (
            <NumberCard
              key={item.id}
              item={item}
              isFavorite={isFavorite(item.id)}
              onToggleFavorite={onToggleFavorite}
              isLast={i === items.length - 1}
            />
          ))}
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
          <div className={styles.cardWrap}>
            <h2
              className={styles.catHeader}
              style={{ color: CAT_COLOR[cat] }}
            >
              {cat}
            </h2>
            {groupItems.map((item, i) => (
              <NumberCard
                key={item.id}
                item={item}
                isFavorite={isFavorite(item.id)}
                onToggleFavorite={onToggleFavorite}
                isLast={i === groupItems.length - 1}
              />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
