import { Link, useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getGuideBySlug } from '../content/guides';
import { getNumberById } from '@whatnumber/shared';
import { JsonLd } from '../components/JsonLd';
import { Footer } from '../components/Footer';
import { PageTopBar } from '../components/PageTopBar';
import { usePageSeo } from '../hooks/usePageSeo';
import { useLocale } from '../hooks/useLocale';
import { localizeNumber } from '../i18n';
import {
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  guidePageDescription,
  numberPath,
} from '../utils/seo';
import styles from '../styles/contentPage.module.css';

type GuideSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export function GuideDetailPage() {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const { slug } = useParams<{ slug: string }>();
  const guide = slug ? getGuideBySlug(slug) : undefined;

  const title = guide ? t(`guides.items.${guide.slug}.title`) : '';
  const summary = guide ? t(`guides.items.${guide.slug}.summary`) : '';
  const sections = useMemo(() => {
    if (!guide) return [] as GuideSection[];
    return t(`guides.items.${guide.slug}.sections`, {
      returnObjects: true,
    }) as GuideSection[];
  }, [guide, t, locale]);

  usePageSeo(
    guide
      ? {
          title,
          description: guidePageDescription(summary),
          path: `/guide/${guide.slug}`,
          type: 'article',
        }
      : { title: t('guides.notFoundTitle'), noIndex: true },
  );

  if (!guide) {
    return (
      <div className="app">
        <PageTopBar title={t('guides.notFoundPageTitle')} />
        <main className={styles.page}>
          <Link to="/guide" className={styles.back}>
            {t('guides.backToList')}
          </Link>
          <p>{t('guides.notFound')}</p>
        </main>
        <Footer />
      </div>
    );
  }

  const articleJsonLd = buildArticleJsonLd({
    title,
    description: summary,
    path: `/guide/${guide.slug}`,
  });
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: t('numberPage.breadcrumbHome'), path: '/' },
    { name: t('guides.breadcrumbGuides'), path: '/guide' },
    { name: title, path: `/guide/${guide.slug}` },
  ]);

  return (
    <div className="app">
      <JsonLd id="guide-article" data={articleJsonLd} />
      <JsonLd id="guide-breadcrumb" data={breadcrumbJsonLd} />
      <PageTopBar title={t('guides.pageTitle')} />
      <main className={styles.page}>
        <Link to="/guide" className={styles.back}>
          {t('guides.backToList')}
        </Link>

        <header className={styles.hero}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.lead}>{summary}</p>
        </header>

        {sections.map((section) => (
          <section key={section.heading} className={styles.section}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
            {section.bullets && (
              <ul>
                {section.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <div className={styles.related}>
          <h2>{t('guides.relatedNumbers')}</h2>
          <ul className={styles.relatedList}>
            {guide.relatedIds.map((id) => {
              const raw = getNumberById(id);
              if (!raw) return null;
              const item = localizeNumber(raw, locale);
              return (
                <li key={id}>
                  <Link to={numberPath(id)} className={styles.relatedLink}>
                    {item.title} ({item.num})
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}
