import { Link } from 'react-router-dom';
import { getNumberById } from '@whatnumber/shared';
import { numberPath } from '../utils/seo';
import styles from './PopularNumbersSection.module.css';

const POPULAR_IDS = ['e2', 'e3', 'e1', 'e4', 'e8', 'e9', 'c1', 'h3', 'l4'] as const;

export function PopularNumbersSection() {
  const items = POPULAR_IDS.map((id) => getNumberById(id)).filter(
    (item): item is NonNullable<typeof item> => item !== undefined,
  );

  return (
    <nav className={styles.section} aria-labelledby="popular-numbers-heading">
      <h2 id="popular-numbers-heading" className={styles.heading}>
        자주 찾는 공공 전화번호
      </h2>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id}>
            <Link to={numberPath(item.id)} className={styles.link}>
              {item.title} {item.num}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
