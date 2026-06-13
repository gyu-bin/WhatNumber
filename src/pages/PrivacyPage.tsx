import { Link } from 'react-router-dom';
import { usePageSeo } from '../hooks/usePageSeo';
import { Footer } from '../components/Footer';
import { PageTopBar } from '../components/PageTopBar';
import styles from '../styles/contentPage.module.css';

export function PrivacyPage() {
  usePageSeo({
    title: '개인정보처리방침',
    description: '몇번이야 서비스의 개인정보 처리 방침과 데이터 보관 안내입니다.',
    path: '/privacy',
  });

  return (
    <div className="app">
      <PageTopBar title="개인정보처리방침" />
      <main className={styles.page}>
        <Link to="/" className={styles.back}>
          ← 번호 목록으로
        </Link>

        <header className={styles.hero}>
          <h1 className={styles.title}>개인정보처리방침</h1>
          <p className={styles.lead}>
            몇번이야(이하 “서비스”)는 이용자의 개인정보를 소중히 여기며,
            관련 법령을 준수합니다. 본 방침은 2026년 6월 10일부터 적용됩니다.
          </p>
        </header>

        <section className={styles.section}>
          <h2>1. 수집하는 정보</h2>
          <p>
            서비스는 회원가입 없이 이용할 수 있으며, 이름·이메일·전화번호 등
            개인을 직접 식별하는 정보를 서버에 저장하지 않습니다.
          </p>
          <ul>
            <li>
              <strong>즐겨찾기</strong>: 선택한 번호 ID 목록을 이용자 기기의
              브라우저 localStorage에만 저장합니다. 서버로 전송되지 않습니다.
            </li>
            <li>
              <strong>테마 설정</strong>: 라이트/다크 모드 선택을 localStorage에
              저장합니다.
            </li>
            <li>
              <strong>접속·이용 통계</strong>: Vercel Analytics를 통해
              익명화된 페이지 방문 통계(국가, 기기 유형, 참조 경로 등)가
              수집될 수 있습니다.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>2. 광고(Google AdSense)</h2>
          <p>
            서비스는 Google AdSense를 통해 광고를 게재할 수 있습니다. Google
            및 제휴 파트너는 쿠키, 광고 ID 등을 사용해 이용자의 관심사에 맞는
            광고를 표시하고, 광고 성과를 측정할 수 있습니다.
          </p>
          <ul>
            <li>
              Google 광고 설정에서 맞춤 광고를 끌 수 있습니다:{' '}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
              >
                google.com/settings/ads
              </a>
            </li>
            <li>
              Google의 광고·데이터 처리 방침:{' '}
              <a
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noopener noreferrer"
              >
                policies.google.com/technologies/ads
              </a>
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>3. 쿠키</h2>
          <p>
            서비스와 제3자(Google 등)는 기능 제공·통계·광고 목적으로 쿠키 및
            유사 기술을 사용할 수 있습니다. 브라우저 설정에서 쿠키 저장을
            거부하거나 삭제할 수 있으나, 일부 기능이 제한될 수 있습니다.
          </p>
        </section>

        <section className={styles.section}>
          <h2>4. 정보의 보관·파기</h2>
          <p>
            localStorage에 저장된 즐겨찾기·테마 설정은 이용자가 브라우저 데이터를
            삭제하거나 직접 초기화할 때까지 기기에 남습니다. 서비스 운영자는
            해당 데이터에 접근하지 않습니다.
          </p>
        </section>

        <section className={styles.section}>
          <h2>5. 이용자의 권리</h2>
          <p>
            즐겨찾기·테마는 브라우저 설정 또는 서비스 내 즐겨찾기 해제로
            언제든 삭제할 수 있습니다. AdSense·Analytics 관련 문의는 Google
            정책 페이지를 참고해 주세요.
          </p>
        </section>

        <section className={styles.section}>
          <h2>6. 방침 변경</h2>
          <p>
            본 방침이 변경되면 이 페이지에 게시합니다. 중요한 변경 시 서비스
            내 안내를 추가할 수 있습니다.
          </p>
          <p className={styles.updated}>시행일: 2026년 6월 10일</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
