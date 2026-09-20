import Constants from 'expo-constants';
import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Image, Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LanguageToggle } from '../components/LanguageToggle';
import { ThemeToggle } from '../components/ThemeToggle';
import { SITE_URL } from '../constants';
import type { AppLocale } from '../i18n/types';
import type { AppStyles } from '../styles';
import type { Theme, ThemeColors } from '../theme';

interface MoreScreenProps {
  styles: AppStyles;
  colors: ThemeColors;
  theme: Theme;
  locale: AppLocale;
  onChangeTheme: (theme: Theme) => void;
  onChangeLocale: (locale: AppLocale) => void;
  onOpenRequest: () => void;
  onOpenFeedback: () => void;
  onOpenPrivacy: () => void;
}

export function MoreScreen({
  styles,
  colors,
  theme,
  locale,
  onChangeTheme,
  onChangeLocale,
  onOpenRequest,
  onOpenFeedback,
  onOpenPrivacy,
}: MoreScreenProps) {
  const { t } = useTranslation();
  const version = Constants.expoConfig?.version ?? '1.0.1';

  return (
    <ScrollView
      style={styles.moreScroll}
      contentContainerStyle={styles.moreContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.moreHero}>
        <View style={styles.moreHeroText}>
          <Text style={styles.moreTitle}>{t('settings.title')}</Text>
          <Text style={styles.moreSubtitle}>{t('settings.subtitle')}</Text>
        </View>
        <Image
          source={
            theme === 'dark'
              ? require('../assets/brand/icon-dark.png')
              : require('../assets/brand/logo-256.png')
          }
          style={styles.moreHeroGraphic}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
        />
      </View>

      <Text style={styles.moreSectionLabel}>{t('settings.sectionDisplay')}</Text>
      <View style={styles.moreSection}>
        <View style={styles.moreRow}>
          <SettingIcon name="moon-outline" styles={styles} colors={colors} />
          <View style={styles.moreRowText}>
            <Text style={styles.moreRowTitle}>{t('settings.theme')}</Text>
            <Text style={styles.moreRowHint}>{t('settings.themeHint')}</Text>
          </View>
          <ThemeToggle theme={theme} colors={colors} onChange={onChangeTheme} />
        </View>
        <View style={styles.moreRowDivider} />
        <View style={styles.moreRow}>
          <SettingIcon name="language-outline" styles={styles} colors={colors} />
          <View style={styles.moreRowText}>
            <Text style={styles.moreRowTitle}>{t('settings.language')}</Text>
            <Text style={styles.moreRowHint}>{t('settings.languageHint')}</Text>
          </View>
          <LanguageToggle locale={locale} colors={colors} onChange={onChangeLocale} />
        </View>
      </View>

      <Text style={styles.moreSectionLabel}>{t('settings.sectionNumbers')}</Text>
      <View style={styles.moreSection}>
        <Pressable style={styles.moreLinkRow} onPress={onOpenRequest}>
          <SettingIcon name="add" styles={styles} colors={colors} />
          <View style={styles.moreRowText}>
            <Text style={styles.moreRowTitle}>{t('settings.requestTitle')}</Text>
            <Text style={styles.moreRowHint}>{t('settings.requestHint')}</Text>
          </View>
          <Text style={styles.moreChevron}>›</Text>
        </Pressable>
      </View>

      <Text style={styles.moreSectionLabel}>{t('settings.sectionInfo')}</Text>
      <View style={styles.moreSection}>
        <Pressable style={styles.moreLinkRow} onPress={onOpenPrivacy}>
          <SettingIcon name="shield-checkmark-outline" styles={styles} colors={colors} />
          <View style={styles.moreRowText}>
            <Text style={styles.moreRowTitle}>{t('settings.privacyTitle')}</Text>
            <Text style={styles.moreRowHint}>{t('settings.privacyHint')}</Text>
          </View>
          <Text style={styles.moreChevron}>›</Text>
        </Pressable>
        <View style={styles.moreRowDivider} />
        <Pressable
          style={styles.moreLinkRow}
          onPress={() => void Linking.openURL(SITE_URL)}
        >
          <SettingIcon name="open-outline" styles={styles} colors={colors} />
          <View style={styles.moreRowText}>
            <Text style={styles.moreRowTitle}>{t('settings.websiteTitle')}</Text>
            <Text style={styles.moreRowHint}>{t('settings.websiteHint')}</Text>
          </View>
          <Text style={styles.moreChevron}>›</Text>
        </Pressable>
      </View>

      <Pressable style={styles.feedbackCard} onPress={onOpenFeedback}>
        <SettingIcon name="chatbubble-ellipses-outline" styles={styles} colors={colors} />
        <View style={styles.moreRowText}>
          <Text style={styles.feedbackTitle}>{t('settings.feedbackTitle')}</Text>
          <Text style={styles.feedbackHint}>{t('settings.feedbackHint')}</Text>
        </View>
        <Text style={styles.moreChevron}>›</Text>
      </Pressable>

      <Text style={styles.moreMeta}>{t('settings.meta', { version })}</Text>
    </ScrollView>
  );
}

function SettingIcon({
  name,
  styles,
  colors,
}: {
  name: ComponentProps<typeof Ionicons>['name'];
  styles: AppStyles;
  colors: ThemeColors;
}) {
  return (
    <View style={styles.iconWrap}>
      <Ionicons name={name} size={18} color={colors.accent} />
    </View>
  );
}
