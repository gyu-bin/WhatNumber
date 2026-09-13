import { type ReactNode } from 'react';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import type { AppStyles } from '../styles';
import type { ThemeColors } from '../theme';

const ADS_SETTINGS_URL = 'https://www.google.com/settings/ads';
const ADS_POLICY_URL = 'https://policies.google.com/technologies/ads';

interface PrivacyScreenProps {
  styles: AppStyles;
  colors: ThemeColors;
  onBack: () => void;
}

function Section({
  title,
  children,
  styles,
}: {
  title: string;
  children: ReactNode;
  styles: AppStyles;
}) {
  return (
    <View style={styles.privacySection}>
      <Text style={styles.privacySectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Bullet({ text, styles }: { text: string; styles: AppStyles }) {
  return (
    <View style={styles.privacyBulletRow}>
      <Text style={styles.privacyBulletMark}>·</Text>
      <Text style={styles.privacyBody}>{text}</Text>
    </View>
  );
}

export function PrivacyScreen({ styles, colors, onBack }: PrivacyScreenProps) {
  return (
    <View style={styles.privacyWrap}>
      <View style={styles.privacyTopBar}>
        <Pressable
          onPress={onBack}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="설정으로 돌아가기"
          style={styles.privacyBackBtn}
        >
          <Text style={[styles.privacyBackText, { color: colors.textPrimary }]}>‹ 설정</Text>
        </Pressable>
        <Text style={styles.privacyTopTitle}>개인정보처리방침</Text>
        <View style={styles.privacyTopSpacer} />
      </View>

      <ScrollView
        style={styles.privacyScroll}
        contentContainerStyle={styles.privacyContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.privacyLead}>
          몇번이야(이하 “서비스”)는 이용자의 개인정보를 소중히 여기며, 관련 법령을
          준수합니다. 본 방침은 2026년 6월 10일부터 적용됩니다.
        </Text>

        <Section title="1. 수집하는 정보" styles={styles}>
          <Text style={styles.privacyBody}>
            서비스(웹·모바일 앱)는 회원가입 없이 이용할 수 있으며, 이름·이메일·전화번호 등
            개인을 직접 식별하는 정보를 서버에 저장하지 않습니다.
          </Text>
          <Bullet
            styles={styles}
            text="즐겨찾기: 선택한 번호 ID 목록을 이용자 기기에만 저장합니다. 웹은 브라우저 localStorage, 모바일 앱은 AsyncStorage를 사용하며 서버로 전송되지 않습니다."
          />
          <Bullet
            styles={styles}
            text="테마·보기 방식: 라이트/다크 모드와 리스트/카드 보기 선택을 기기 로컬 저장소에 저장합니다."
          />
          <Bullet
            styles={styles}
            text="내 주변 응급실: 응급실 찾기 화면에서 조회를 시작할 때만 현재 위치 권한을 요청합니다. 위치는 가까운 응급실을 조회하기 위해서만 사용하며, 앱은 위치 이력을 저장하거나 백그라운드에서 위치를 수집하지 않습니다."
          />
          <Bullet
            styles={styles}
            text="번호 추가 요청: 이용자가 메일 앱을 통해 요청을 보낼 때만 해당 메일 내용이 운영자 이메일로 전달됩니다."
          />
          <Bullet
            styles={styles}
            text="접속·이용 통계(웹): Vercel Analytics를 통해 익명화된 페이지 방문 통계(국가, 기기 유형, 참조 경로 등)가 수집될 수 있습니다."
          />
          <Bullet
            styles={styles}
            text="앱 업데이트(모바일): Expo EAS Update를 통해 앱 기능·화면 개선용 JavaScript 번들을 내려받을 수 있습니다. 이 과정에서 개인을 식별하는 정보는 수집하지 않습니다."
          />
        </Section>

        <Section title="2. 광고(Google AdSense · AdMob)" styles={styles}>
          <Text style={styles.privacyBody}>
            웹 서비스는 Google AdSense를, 모바일 앱은 Google AdMob을 통해 광고를
            게재할 수 있습니다. Google 및 제휴 파트너는 쿠키, 광고 ID 등을 사용해
            이용자의 관심사에 맞는 광고를 표시하고, 광고 성과를 측정할 수 있습니다.
            모바일 앱의 광고는 화면 하단 배너 형태로 표시될 수 있습니다.
          </Text>
          <Pressable onPress={() => void Linking.openURL(ADS_SETTINGS_URL)}>
            <Text style={styles.privacyLink}>Google 광고 설정 →</Text>
          </Pressable>
          <Pressable onPress={() => void Linking.openURL(ADS_POLICY_URL)}>
            <Text style={styles.privacyLink}>Google 광고·데이터 처리 방침 →</Text>
          </Pressable>
        </Section>

        <Section title="3. 쿠키" styles={styles}>
          <Text style={styles.privacyBody}>
            웹 서비스와 제3자(Google 등)는 기능 제공·통계·광고 목적으로 쿠키 및 유사
            기술을 사용할 수 있습니다. 브라우저 설정에서 쿠키 저장을 거부하거나
            삭제할 수 있으나, 일부 기능이 제한될 수 있습니다.
          </Text>
        </Section>

        <Section title="4. 정보의 보관·파기" styles={styles}>
          <Text style={styles.privacyBody}>
            기기에 저장된 즐겨찾기·테마·보기 방식 설정은 이용자가 앱/브라우저 데이터를
            삭제하거나 직접 초기화할 때까지 기기에 남습니다. 서비스 운영자는 해당
            데이터에 접근하지 않습니다.
          </Text>
        </Section>

        <Section title="5. 이용자의 권리" styles={styles}>
          <Text style={styles.privacyBody}>
            즐겨찾기·테마·보기 방식은 서비스 내 설정 변경 또는 기기/브라우저 데이터
            삭제로 언제든 지울 수 있습니다. AdSense·Analytics 관련 문의는 Google 정책
            페이지를 참고해 주세요.
          </Text>
        </Section>

        <Section title="6. 방침 변경" styles={styles}>
          <Text style={styles.privacyBody}>
            본 방침이 변경되면 이 화면과 웹 페이지에 게시합니다. 중요한 변경 시 서비스
            내 안내를 추가할 수 있습니다.
          </Text>
          <Text style={styles.privacyUpdated}>
            시행일: 2026년 6월 10일 · 앱 반영 개정: 2026년 9월 12일
          </Text>
        </Section>
      </ScrollView>
    </View>
  );
}
