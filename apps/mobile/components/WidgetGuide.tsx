import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Modal, Platform, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import type { AppStyles } from '../styles';
import type { ThemeColors } from '../theme';

interface WidgetGuideBannerProps {
  styles: AppStyles;
  colors: ThemeColors;
  onPress: () => void;
}

export function WidgetGuideBanner({ styles, colors, onPress }: WidgetGuideBannerProps) {
  const { t } = useTranslation();

  return (
    <Pressable
      style={styles.widgetBanner}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={t('home.widgetBannerA11y')}
    >
      <View style={styles.widgetBannerIcon}>
        <Ionicons name="grid" size={16} color={colors.accent} />
      </View>
      <Text style={styles.widgetBannerText}>{t('home.widgetBanner')}</Text>
      <Text style={styles.widgetBannerChevron}>›</Text>
    </Pressable>
  );
}

interface WidgetGuideSheetProps {
  visible: boolean;
  onClose: () => void;
  styles: AppStyles;
  colors: ThemeColors;
}

export function WidgetGuideSheet({
  visible,
  onClose,
  styles,
  colors,
}: WidgetGuideSheetProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [showHowTo, setShowHowTo] = useState(false);
  const stepsKey =
    Platform.OS === 'ios' ? 'home.widgetHowToIos' : 'home.widgetHowToAndroid';
  const steps = t(stepsKey, { returnObjects: true });
  const stepList = Array.isArray(steps) ? (steps as string[]) : [];
  const sheetBottomPad = Math.max(insets.bottom, Platform.OS === 'android' ? 16 : 12);

  useEffect(() => {
    if (!visible) setShowHowTo(false);
  }, [visible]);

  const close = () => {
    setShowHowTo(false);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={close}>
      <Pressable style={styles.overlay} onPress={close}>
        <Pressable
          style={[styles.sheet, { paddingBottom: sheetBottomPad + 8 }]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.handle} />
          <Pressable
            style={styles.widgetSheetClose}
            onPress={close}
            accessibilityLabel={t('common.close')}
            hitSlop={12}
          >
            <Ionicons name="close" size={22} color={colors.textSecondary} />
          </Pressable>

          <View style={styles.widgetSheetIcon}>
            <Ionicons name="grid" size={28} color={colors.accent} />
          </View>
          <Text style={styles.widgetSheetTitle}>{t('home.widgetSheetTitle')}</Text>
          <Text style={styles.widgetSheetBody}>{t('home.widgetSheetBody')}</Text>

          {showHowTo ? (
            <View style={styles.widgetHowToBox}>
              {stepList.map((step, index) => (
                <View key={step} style={styles.widgetHowToRow}>
                  <Text style={styles.widgetHowToIndex}>{index + 1}</Text>
                  <Text style={styles.widgetHowToText}>{step}</Text>
                </View>
              ))}
            </View>
          ) : null}

          <Pressable
            style={[styles.primaryBtn, styles.widgetSheetCta]}
            onPress={() => setShowHowTo((prev) => !prev)}
          >
            <Text style={styles.primaryBtnText}>
              {showHowTo ? t('home.widgetHowToHide') : t('home.widgetHowToShow')}
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
