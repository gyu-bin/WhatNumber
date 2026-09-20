import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './IntroSection.module.css';

function IntroParagraph1() {
  const { t } = useTranslation();
  const paragraph = t('intro.paragraph1');
  const strong = t('intro.paragraph1Strong');
  if (!strong || !paragraph.includes(strong)) {
    return <p className={styles.text}>{paragraph}</p>;
  }
  const [before, after] = paragraph.split(strong);
  return (
    <p className={styles.text}>
      {before}
      <strong>{strong}</strong>
      {after}
    </p>
  );
}

export function IntroSection() {
  const { t } = useTranslation();

  return (
    <section className={styles.intro} aria-labelledby="intro-heading">
      <h2 id="intro-heading" className={styles.heading}>
        {t('intro.heading')}
      </h2>
      <IntroParagraph1 />
      <p className={styles.text}>
        {t('intro.paragraph2BeforeLink')}{' '}
        <Link to="/guide" className={styles.link}>
          {t('intro.paragraph2Link')}
        </Link>
        {t('intro.paragraph2AfterLink')}
      </p>
    </section>
  );
}
