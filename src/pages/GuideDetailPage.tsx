import { Link, useParams } from 'react-router-dom';
import { getGuideBySlug } from '../content/guides';
import { getNumberById } from '@whatnumber/shared';
import { JsonLd } from '../components/JsonLd';
import { Footer } from '../components/Footer';
import { PageTopBar } from '../components/PageTopBar';
import { usePageSeo } from '../hooks/usePageSeo';
import { buildArticleJsonLd, guidePageDescription, numberPath } from '../utils/seo';
import styles from '../styles/contentPage.module.css';

export function GuideDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const guide = slug ? getGuideBySlug(slug) : undefined;

  usePageSeo(
    guide
      ? {
          title: guide.title,
          description: guidePageDescription(guide.summary),
          path: `/guide/${guide.slug}`,
          type: 'article',
        }
      : { title: '가이드를 찾을 수 없음', noIndex: true },
  );

  if (!guide) {
    return (
      <div className="app">
        <PageTopBar title="가이드" />
        <main className={styles.page}>
          <Link to="/guide" className={styles.back}>
            ← 가이드 목록
          </Link>
          <p>요청하신 가이드를 찾을 수 없습니다.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const articleJsonLd = buildArticleJsonLd({
    title: guide.title,
    description: guide.summary,
    path: `/guide/${guide.slug}`,
  });

  return (
    <div className="app">
      <JsonLd id="guide-article" data={articleJsonLd} />
      <PageTopBar title="상황별 가이드" />
      <main className={styles.page}>
        <Link to="/guide" className={styles.back}>
          ← 가이드 목록
        </Link>

        <header className={styles.hero}>
          <h1 className={styles.title}>{guide.title}</h1>
          <p className={styles.lead}>{guide.summary}</p>
        </header>

        {guide.sections.map((section) => (
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
          <h2>관련 번호</h2>
          <ul className={styles.relatedList}>
            {guide.relatedIds.map((id) => {
              const item = getNumberById(id);
              if (!item) return null;
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
