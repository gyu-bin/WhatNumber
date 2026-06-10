import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { Footer } from '../components/Footer';
import { PageTopBar } from '../components/PageTopBar';
import styles from '../styles/contentPage.module.css';

export function AboutPage() {
  useDocumentTitle('서비스 소개');

  return (
    <div className="app">
      <PageTopBar title="서비스 소개" />
      <main className={styles.page}>
        <Link to="/" className={styles.back}>
          ← 번호 목록으로
        </Link>

        <header className={styles.hero}>
          <p className={styles.eyebrow}>몇번이야</p>
          <h1 className={styles.title}>몰라서 못 쓴 번호들을 모았습니다</h1>
          <p className={styles.lead}>
            몇번이야는 한국에서 긴급·생활 상황에 실제로 필요한 공공 전화번호를
            상황별로 정리해 제공하는 무료 웹 서비스입니다.
          </p>
        </header>

        <section className={styles.section}>
          <h2>어떤 문제를 해결하나요?</h2>
          <p>
            119와 112는 많이 알지만, 응급실 비용 때문에 연락하는 129, 고속도로
            사고 후 공공렉카 1588-2504, 전세 계약 전 확인하는 1566-9009처럼{' '}
            <strong>알면 바로 도움이 되는 번호</strong>는 검색해도 잘 안
            나옵니다. 급한 순간 구글에 검색하기엔 시간이 부족하고, 여러
            정부·지자체 사이트를 돌아다니기도 어렵습니다.
          </p>
          <p>
            몇번이야는 이런 번호를 한곳에 모아, 상황 필터·검색·즐겨찾기로
            모바일에서 빠르게 찾고 탭 한 번으로 전화 연결할 수 있게
            만들었습니다.
          </p>
        </section>

        <section className={styles.section}>
          <h2>번호는 어떻게 선정하나요?</h2>
          <p>
            응급·교통·주거·법률·가족·고용·민원 등 실생활에서 실제 문의가
            많은 공공 기관·콜센터 번호를 우선합니다. 각 항목에는 운영 주체가
            공개한 안내를 바탕으로, 언제 전화해야 하는지에 대한 설명을
            덧붙였습니다.
          </p>
          <p>
            번호·제도는 바뀔 수 있습니다. 중요한 결정(전세 계약, 법률 조치
            등)은 반드시 해당 기관 공식 안내로 다시 확인하세요.
          </p>
        </section>

        <section className={styles.section}>
          <h2>콘텐츠와 가이드</h2>
          <p>
            단순 번호 나열을 넘어,{' '}
            <Link to="/guide">상황별 가이드</Link>에서 교통사고 대응 순서,
            보이스피싱 대처, 응급실 비용 문제 등을 글로 정리해 두었습니다. 각
            번호 상세 화면에서도 해당 번호를 써야 하는 구체적인 상황을
            설명합니다.
          </p>
        </section>

        <section className={styles.section}>
          <h2>운영·문의</h2>
          <p>
            몇번이야는 개인이 운영하는 비영리 성격의 정보 서비스입니다.
            데이터 처리 방침은{' '}
            <Link to="/privacy">개인정보처리방침</Link>을 참고해 주세요.
          </p>
          <p className={styles.updated}>최종 업데이트: 2026년 6월</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
