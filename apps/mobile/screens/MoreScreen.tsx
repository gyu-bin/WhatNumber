import Constants from 'expo-constants';
import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Image, Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { ThemeToggle } from '../components/ThemeToggle';
import { SITE_URL } from '../constants';
import type { AppStyles } from '../styles';
import type { Theme, ThemeColors } from '../theme';

interface MoreScreenProps {
  styles: AppStyles;
  colors: ThemeColors;
  theme: Theme;
  onChangeTheme: (theme: Theme) => void;
  onOpenRequest: () => void;
  onOpenFeedback: () => void;
  onOpenPrivacy: () => void;
}

export function MoreScreen({
  styles,
  colors,
  theme,
  onChangeTheme,
  onOpenRequest,
  onOpenFeedback,
  onOpenPrivacy,
}: MoreScreenProps) {
  const version = Constants.expoConfig?.version ?? '1.0.1';

  return (
    <ScrollView
      style={styles.moreScroll}
      contentContainerStyle={styles.moreContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.moreHero}>
        <View style={styles.moreHeroText}>
          <Text style={styles.moreTitle}>설정</Text>
          <Text style={styles.moreSubtitle}>앱을 더 편하게 사용할 수 있어요.</Text>
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

      <Text style={styles.moreSectionLabel}>화면</Text>
      <View style={styles.moreSection}>
        <View style={styles.moreRow}>
          <SettingIcon name="moon-outline" styles={styles} colors={colors} />
          <View style={styles.moreRowText}>
            <Text style={styles.moreRowTitle}>테마</Text>
            <Text style={styles.moreRowHint}>앱의 색상을 설정해요.</Text>
          </View>
          <ThemeToggle theme={theme} colors={colors} onChange={onChangeTheme} />
        </View>
      </View>

      <Text style={styles.moreSectionLabel}>번호</Text>
      <View style={styles.moreSection}>
        <Pressable style={styles.moreLinkRow} onPress={onOpenRequest}>
          <SettingIcon name="add" styles={styles} colors={colors} />
          <View style={styles.moreRowText}>
            <Text style={styles.moreRowTitle}>빠진 번호 요청</Text>
            <Text style={styles.moreRowHint}>추가가 필요한 번호를 보내주세요</Text>
          </View>
          <Text style={styles.moreChevron}>›</Text>
        </Pressable>
      </View>

      <Text style={styles.moreSectionLabel}>정보</Text>
      <View style={styles.moreSection}>
        <Pressable style={styles.moreLinkRow} onPress={onOpenPrivacy}>
          <SettingIcon name="shield-checkmark-outline" styles={styles} colors={colors} />
          <View style={styles.moreRowText}>
            <Text style={styles.moreRowTitle}>개인정보처리방침</Text>
            <Text style={styles.moreRowHint}>소중한 개인정보를 지켜요.</Text>
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
            <Text style={styles.moreRowTitle}>웹사이트</Text>
            <Text style={styles.moreRowHint}>더 많은 정보를 확인해보세요.</Text>
          </View>
          <Text style={styles.moreChevron}>›</Text>
        </Pressable>
      </View>

      <Pressable style={styles.feedbackCard} onPress={onOpenFeedback}>
        <SettingIcon name="chatbubble-ellipses-outline" styles={styles} colors={colors} />
        <View style={styles.moreRowText}>
          <Text style={styles.feedbackTitle}>더 나은 앱이 될 수 있도록</Text>
          <Text style={styles.feedbackHint}>소중한 의견을 기다리고 있어요.</Text>
        </View>
        <Text style={styles.moreChevron}>›</Text>
      </Pressable>

      <Text style={styles.moreMeta}>몇번이야? · v{version}{'\n'}필요한 번호, 바로.</Text>
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
    <View style={styles.moreRowIcon}>
      <Ionicons name={name} size={22} color={colors.accent} />
    </View>
  );
}
