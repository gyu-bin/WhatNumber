import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePageSeo } from '../hooks/usePageSeo';
import { Footer } from '../components/Footer';
import { PageTopBar } from '../components/PageTopBar';
import styles from '../styles/contentPage.module.css';

type PrivacyListItem = { title: string; body: string };
type PrivacyLink = { before: string; label: string; href: string };

const PRIVACY_SECTION_ORDER = [
  'collect',
  'ads',
  'cookies',
  'retention',
  'rights',
  'changes',
] as const;

export function PrivacyPage() {
  const { t } = useTranslation();

  usePageSeo({
    title: t('privacy.pageTitle'),
    description: t('privacy.seoDescription'),
    path: '/privacy',
  });

  return (
    <div className="app">
      <PageTopBar title={t('privacy.pageTitle')} />
      <main className={styles.page}>
        <Link to="/" className={styles.back}>
          {t('privacy.backToNumbers')}
        </Link>

        <header className={styles.hero}>
          <h1 className={styles.title}>{t('privacy.title')}</h1>
          <p className={styles.lead}>{t('privacy.lead')}</p>
        </header>

        {PRIVACY_SECTION_ORDER.map((key) => {
          const base = `privacy.sections.${key}`;
          const heading = t(`${base}.heading`);

          if (key === 'collect') {
            const items = t(`${base}.items`, { returnObjects: true }) as PrivacyListItem[];
            return (
              <section key={key} className={styles.section}>
                <h2>{heading}</h2>
                <p>{t(`${base}.intro`)}</p>
                <ul>
                  {items.map((item) => (
                    <li key={item.title}>
                      <strong>{item.title}</strong>: {item.body}
                    </li>
                  ))}
                </ul>
              </section>
            );
          }

          if (key === 'ads') {
            const links = t(`${base}.links`, { returnObjects: true }) as PrivacyLink[];
            return (
              <section key={key} className={styles.section}>
                <h2>{heading}</h2>
                <p>{t(`${base}.body`)}</p>
                <ul>
                  {links.map((link) => (
                    <li key={link.href}>
                      {link.before}{' '}
                      <a href={link.href} target="_blank" rel="noopener noreferrer">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            );
          }

          if (key === 'changes') {
            return (
              <section key={key} className={styles.section}>
                <h2>{heading}</h2>
                <p>{t(`${base}.body`)}</p>
                <p className={styles.updated}>{t(`${base}.updated`)}</p>
              </section>
            );
          }

          return (
            <section key={key} className={styles.section}>
              <h2>{heading}</h2>
              <p>{t(`${base}.body`)}</p>
            </section>
          );
        })}
      </main>
      <Footer />
    </div>
  );
}
