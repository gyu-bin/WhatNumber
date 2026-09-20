import { Ionicons } from '@expo/vector-icons';
import { Linking, Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { telHref, type NumberItem } from '@whatnumber/shared';
import { getHomeDensity } from '../layout';
import type { AppStyles } from '../styles';
import type { ThemeColors } from '../theme';
import { NumberVisualIcon } from './NumberVisualIcon';

export function ImmediateEmergency({
  fireItem,
  policeItem,
  styles,
  colors,
  onOpen,
}: {
  fireItem: NumberItem;
  policeItem: NumberItem;
  styles: AppStyles;
  colors: ThemeColors;
  onOpen: (item: NumberItem) => void;
}) {
  const { t } = useTranslation();
  const iconSize = getHomeDensity() === 'compact' ? 30 : 36;

  return (
    <View style={styles.immediateEmergency}>
      <Text style={styles.immediateEmergencyTitle}>{t('immediate.title')}</Text>
      <View style={styles.immediateEmergencyRow}>
        <Pressable
          style={[styles.immediateCard, styles.immediateCardFire]}
          onPress={() => onOpen(fireItem)}
          accessibilityRole="button"
          accessibilityLabel={`${fireItem.num} ${fireItem.title}`}
        >
          <View style={styles.immediateCardTop}>
            <NumberVisualIcon item={fireItem} size={iconSize} />
            <Text style={[styles.immediateCardNum, { color: colors.accent }]}>
              {fireItem.num}
            </Text>
          </View>
          <Text style={styles.immediateCardLabel}>{t('immediate.fireLabel')}</Text>
          <Text style={styles.immediateCardDesc}>{fireItem.desc}</Text>
          <Pressable
            style={[styles.immediateCallBtn, styles.immediateCallBtnOnFire]}
            onPress={() => void Linking.openURL(telHref(fireItem.num))}
            accessibilityRole="button"
            accessibilityLabel={`${fireItem.num} ${t('immediate.call')}`}
          >
            <Ionicons name="call" size={14} color={colors.accent} />
            <Text style={styles.immediateCallText}>{t('immediate.call')}</Text>
          </Pressable>
        </Pressable>

        <Pressable
          style={[styles.immediateCard, styles.immediateCardPolice]}
          onPress={() => onOpen(policeItem)}
          accessibilityRole="button"
          accessibilityLabel={`${policeItem.num} ${policeItem.title}`}
        >
          <View style={styles.immediateCardTop}>
            <NumberVisualIcon item={policeItem} size={iconSize} />
            <Text style={[styles.immediateCardNum, { color: colors.textPrimary }]}>
              {policeItem.num}
            </Text>
          </View>
          <Text style={styles.immediateCardLabel}>{t('immediate.policeLabel')}</Text>
          <Text style={styles.immediateCardDesc}>{policeItem.desc}</Text>
          <Pressable
            style={styles.immediateCallBtn}
            onPress={() => void Linking.openURL(telHref(policeItem.num))}
            accessibilityRole="button"
            accessibilityLabel={`${policeItem.num} ${t('immediate.call')}`}
          >
            <Ionicons name="call" size={14} color={colors.accent} />
            <Text style={styles.immediateCallText}>{t('immediate.call')}</Text>
          </Pressable>
        </Pressable>
      </View>
    </View>
  );
}
