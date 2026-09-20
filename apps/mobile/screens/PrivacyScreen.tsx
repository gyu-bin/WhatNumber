import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PRIVACY_POLICY_URL } from '../constants';
import type { AppStyles } from '../styles';
import type { ThemeColors } from '../theme';

interface PrivacyScreenProps {
  styles: AppStyles;
  colors: ThemeColors;
  onBack: () => void;
}

export function PrivacyScreen({ styles, colors, onBack }: PrivacyScreenProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.privacyWrap}>
      <View style={styles.privacyTopBar}>
        <Pressable
          onPress={onBack}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={t('privacy.back')}
          style={styles.privacyBackBtn}
        >
          <Text style={[styles.privacyBackText, { color: colors.textPrimary }]}>
            {t('privacy.back')}
          </Text>
        </Pressable>
        <Text style={styles.privacyTopTitle}>{t('privacy.title')}</Text>
        <View style={styles.privacyTopSpacer} />
      </View>

      <ScrollView
        style={styles.privacyScroll}
        contentContainerStyle={styles.privacyContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.privacyLead}>{t('privacy.lead')}</Text>
        <Pressable onPress={() => void Linking.openURL(PRIVACY_POLICY_URL)}>
          <Text style={styles.privacyLink}>{t('privacy.openWeb')} →</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
