import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GUIDES } from '../content/guides';
import { usePageSeo } from '../hooks/usePageSeo';
import { Footer } from '../components/Footer';
import { PageTopBar } from '../components/PageTopBar';
import styles from '../styles/contentPage.module.css';

export function GuideListPage() {
  const { t } = useTranslation();

  usePageSeo({
    title: t('guides.pageTitle'),
    description: t('guides.listSeoDescription'),
    path: '/guide',
  });

  return (
    <div className="app">
      <PageTopBar title={t('guides.pageTitle')} />
      <main className={styles.page}>
        <Link to="/" className={styles.back}>
          {t('guides.backToNumbers')}
        </Link>

        <header className={styles.hero}>
          <h1 className={styles.title}>{t('guides.listTitle')}</h1>
          <p className={styles.lead}>{t('guides.listLead')}</p>
        </header>

        <ul className={styles.cardList}>
          {GUIDES.map((guide) => (
            <li key={guide.slug}>
              <Link to={`/guide/${guide.slug}`} className={styles.cardLink}>
                <span className={styles.cardTitle}>
                  {t(`guides.items.${guide.slug}.title`)}
                </span>
                <span className={styles.cardDesc}>
                  {t(`guides.items.${guide.slug}.summary`)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  );
}
