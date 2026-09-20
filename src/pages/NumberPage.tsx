import { Link, Navigate, useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CAT_COLOR,
  getNumberById,
  iconBgColor,
  telHref,
} from '@whatnumber/shared';
import { JsonLd } from '../components/JsonLd';
import { Footer } from '../components/Footer';
import { PageTopBar } from '../components/PageTopBar';
import { usePageSeo } from '../hooks/usePageSeo';
import { useLocale } from '../hooks/useLocale';
import { localizeNumber, localizeNumberDetail } from '../i18n';
import {
  buildBreadcrumbJsonLd,
  buildNumberJsonLd,
  numberPageDescription,
  numberPageTitle,
  numberPath,
} from '../utils/seo';
import styles from '../styles/contentPage.module.css';
import detailStyles from '../components/NumberDetail.module.css';

export function NumberPage() {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const { id } = useParams<{ id: string }>();
  const rawItem = id ? getNumberById(id) : undefined;
  const item = useMemo(
    () => (rawItem ? localizeNumber(rawItem, locale) : undefined),
    [rawItem, locale],
  );

  usePageSeo(
    item
      ? {
          title: numberPageTitle(item),
          description: numberPageDescription(item),
          path: numberPath(item.id),
        }
      : { title: t('numberPage.notFoundTitle'), noIndex: true },
  );

  if (!id) {
    return <Navigate to="/" replace />;
  }

  if (!item || !rawItem) {
    return (
      <div className="app">
        <PageTopBar title={t('numberPage.pageTitle')} />
        <main className={styles.page}>
          <Link to="/" className={styles.back}>
            {t('numberPage.backToNumbers')}
          </Link>
          <p>{t('numberPage.notFound')}</p>
        </main>
        <Footer />
      </div>
    );
  }

  const detail = localizeNumberDetail(item.id, locale) ?? [];
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: t('numberPage.breadcrumbHome'), path: '/' },
    { name: t(`categories.${item.cat}`), path: '/' },
    { name: item.title, path: numberPath(item.id) },
  ]);

  return (
    <div className="app">
      <JsonLd id="number" data={buildNumberJsonLd(rawItem)} />
      <JsonLd id="breadcrumb" data={breadcrumb} />

      <PageTopBar title={t(`categories.${item.cat}`)} />
      <main className={styles.page}>
        <Link to="/" className={styles.back}>
          {t('numberPage.backToNumbers')}
        </Link>

        <header className={styles.hero}>
          <div
            className={detailStyles.iconWrap}
            style={{ background: iconBgColor(item.cat), width: 56, height: 56 }}
            aria-hidden
          >
            <span style={{ fontSize: 28 }}>{item.icon}</span>
          </div>
          <p className={styles.eyebrow} style={{ color: CAT_COLOR[item.cat] }}>
            {t(`categories.${item.cat}`)}
          </p>
          <h1 className={styles.title}>{item.title}</h1>
          <p className={styles.lead}>{item.desc}</p>
          <a href={telHref(item.num)} className={styles.callLink}>
            {t('detail.call', { num: item.num })}
          </a>
        </header>

        {detail.length > 0 && (
          <section className={styles.section}>
            <h2>{t('detail.learnMore')}</h2>
            {detail.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </section>
        )}

        {item.situation.length > 0 && (
          <section className={styles.section}>
            <h2>{t('detail.situationsHeading')}</h2>
            <ul>
              {item.situation.map((sit) => (
                <li key={sit}>{t(`situationLabels.${sit}`)}</li>
              ))}
            </ul>
          </section>
        )}

        {item.tip && (
          <section className={styles.section}>
            <h2>{t('detail.tipHeading')}</h2>
            <p>{item.tip}</p>
          </section>
        )}

        <section className={styles.section}>
          <h2>{t('detail.findMoreHeading')}</h2>
          <p>
            {t('detail.findMoreBodyBefore')}
            <Link to="/">{t('detail.findMoreLink')}</Link>
            {t('detail.findMoreBodyAfter')}
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
