import { Link } from 'react-router-dom';
import { GUIDES } from '../content/guides';
import { usePageSeo } from '../hooks/usePageSeo';
import { Footer } from '../components/Footer';
import { PageTopBar } from '../components/PageTopBar';
import styles from '../styles/contentPage.module.css';

export function GuideListPage() {
  usePageSeo({
    title: '상황별 가이드',
    description:
      '응급·교통사고·전세·보이스피싱 등 상황별로 어떤 번호를 어떤 순서로 연락해야 하는지 정리한 가이드입니다.',
    path: '/guide',
  });

  return (
    <div className="app">
      <PageTopBar title="상황별 가이드" />
      <main className={styles.page}>
        <Link to="/" className={styles.back}>
          ← 번호 목록으로
        </Link>

        <header className={styles.hero}>
          <h1 className={styles.title}>상황별 대응 가이드</h1>
          <p className={styles.lead}>
            긴급 상황·교통사고·전세·보이스피싱 등 실제로 자주 겪는 상황마다
            어떤 번호를 어떤 순서로 연락해야 하는지 정리했습니다. 각 가이드
            하단에서 관련 번호로 바로 이동할 수 있습니다.
          </p>
        </header>

        <ul className={styles.cardList}>
          {GUIDES.map((guide) => (
            <li key={guide.slug}>
              <Link to={`/guide/${guide.slug}`} className={styles.cardLink}>
                <span className={styles.cardTitle}>{guide.title}</span>
                <span className={styles.cardDesc}>{guide.summary}</span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  );
}
