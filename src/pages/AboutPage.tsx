import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePageSeo } from '../hooks/usePageSeo';
import { Footer } from '../components/Footer';
import { PageTopBar } from '../components/PageTopBar';
import styles from '../styles/contentPage.module.css';

export function AboutPage() {
  const { t } = useTranslation();

  usePageSeo({
    title: t('about.pageTitle'),
    description: t('about.seoDescription'),
    path: '/about',
  });

  return (
    <div className="app">
      <PageTopBar title={t('about.pageTitle')} />
      <main className={styles.page}>
        <Link to="/" className={styles.back}>
          {t('about.backToNumbers')}
        </Link>

        <header className={styles.hero}>
          <p className={styles.eyebrow}>{t('about.eyebrow')}</p>
          <h1 className={styles.title}>{t('about.title')}</h1>
          <p className={styles.lead}>{t('about.lead')}</p>
        </header>

        <section className={styles.section}>
          <h2>{t('about.problemHeading')}</h2>
          <p>
            {t('about.problemP1Before')}{' '}
            <strong>{t('about.problemP1Strong')}</strong>
            {t('about.problemP1After')}
          </p>
          <p>{t('about.problemP2')}</p>
        </section>

        <section className={styles.section}>
          <h2>{t('about.selectionHeading')}</h2>
          <p>{t('about.selectionP1')}</p>
          <p>{t('about.selectionP2')}</p>
        </section>

        <section className={styles.section}>
          <h2>{t('about.contentHeading')}</h2>
          <p>
            {t('about.contentP1Before')}{' '}
            <Link to="/guide">{t('about.contentP1Link')}</Link>
            {t('about.contentP1After')}
          </p>
        </section>

        <section className={styles.section}>
          <h2>{t('about.opsHeading')}</h2>
          <p>
            {t('about.opsP1Before')}{' '}
            <Link to="/privacy">{t('about.opsP1Link')}</Link>
            {t('about.opsP1After')}
          </p>
          <p className={styles.updated}>{t('about.updated')}</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
