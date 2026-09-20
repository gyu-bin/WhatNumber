import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getNumberById } from '@whatnumber/shared';
import { localizeNumbers } from '../i18n';
import { useLocale } from '../hooks/useLocale';
import { numberPath } from '../utils/seo';
import styles from './PopularNumbersSection.module.css';

const POPULAR_IDS = ['e2', 'e3', 'e1', 'e4', 'e8', 'e9', 'c1', 'h3', 'l4'] as const;

export function PopularNumbersSection() {
  const { t } = useTranslation();
  const { locale } = useLocale();

  const items = useMemo(() => {
    const raw = POPULAR_IDS.map((id) => getNumberById(id)).filter(
      (item): item is NonNullable<typeof item> => item !== undefined,
    );
    return localizeNumbers(raw, locale);
  }, [locale]);

  return (
    <nav className={styles.section} aria-labelledby="popular-numbers-heading">
      <h2 id="popular-numbers-heading" className={styles.heading}>
        {t('popular.heading')}
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
