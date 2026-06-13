import { Link, Navigate, useParams } from 'react-router-dom';
import {
  CAT_COLOR,
  SITUATION_LABELS,
  getNumberById,
  iconBgColor,
  telHref,
} from '@whatnumber/shared';
import { getNumberArticle } from '../content/numberArticles';
import { JsonLd } from '../components/JsonLd';
import { Footer } from '../components/Footer';
import { PageTopBar } from '../components/PageTopBar';
import { usePageSeo } from '../hooks/usePageSeo';
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
  const { id } = useParams<{ id: string }>();
  const item = id ? getNumberById(id) : undefined;

  usePageSeo(
    item
      ? {
          title: numberPageTitle(item),
          description: numberPageDescription(item),
          path: numberPath(item.id),
        }
      : { title: '번호를 찾을 수 없음', noIndex: true },
  );

  if (!id) {
    return <Navigate to="/" replace />;
  }

  if (!item) {
    return (
      <div className="app">
        <PageTopBar title="번호 안내" />
        <main className={styles.page}>
          <Link to="/" className={styles.back}>
            ← 번호 목록으로
          </Link>
          <p>요청하신 번호를 찾을 수 없습니다.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const article = getNumberArticle(item.id);
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: '홈', path: '/' },
    { name: item.cat, path: '/' },
    { name: item.title, path: numberPath(item.id) },
  ]);

  return (
    <div className="app">
      <JsonLd id="number" data={buildNumberJsonLd(item)} />
      <JsonLd id="breadcrumb" data={breadcrumb} />

      <PageTopBar title={item.cat} />
      <main className={styles.page}>
        <Link to="/" className={styles.back}>
          ← 번호 목록으로
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
            {item.cat}
          </p>
          <h1 className={styles.title}>{item.title}</h1>
          <p className={styles.lead}>{item.desc}</p>
          <a href={telHref(item.num)} className={styles.callLink}>
            {item.num} 전화하기
          </a>
        </header>

        {item.situation.length > 0 && (
          <section className={styles.section}>
            <h2>이런 상황에 쓰세요</h2>
            <ul>
              {item.situation.map((sit) => (
                <li key={sit}>{SITUATION_LABELS[sit]}</li>
              ))}
            </ul>
          </section>
        )}

        {item.tip && (
          <section className={styles.section}>
            <h2>꿀팁</h2>
            <p>{item.tip}</p>
          </section>
        )}

        {article && (
          <section className={styles.section}>
            <h2>자세히 알아보기</h2>
            {article.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </section>
        )}

        <section className={styles.section}>
          <h2>다른 번호 찾기</h2>
          <p>
            <Link to="/">몇번이야 홈</Link>에서 상황별·카테고리별로 더 많은 공공
            전화번호를 검색할 수 있습니다.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
