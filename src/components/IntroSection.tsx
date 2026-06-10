import { Link } from 'react-router-dom';
import styles from './IntroSection.module.css';

export function IntroSection() {
  return (
    <section className={styles.intro} aria-labelledby="intro-heading">
      <h2 id="intro-heading" className={styles.heading}>
        왜 몇번이야인가요?
      </h2>
      <p className={styles.text}>
        응급실 비용 걱정으로 129를, 고속도로 사고 후 공공렉카 1588-2504를, 전세
        계약 전 1566-9009를 몰라 본 적 있나요? 몇번이야는 이런{' '}
        <strong>실제로 쓸 일이 생기는 공공 전화번호</strong>를 상황별로 정리한
        무료 안내 서비스입니다.
      </p>
      <p className={styles.text}>
        각 번호마다 언제 전화해야 하는지, 어떤 순서로 연락하면 되는지 설명
        글을 함께 제공합니다. 급할 때는 카드의 번호를 눌러 바로 전화하고, 미리
        읽어 두고 싶다면{' '}
        <Link to="/guide" className={styles.link}>
          상황별 가이드
        </Link>
        를 참고하세요.
      </p>
    </section>
  );
}
