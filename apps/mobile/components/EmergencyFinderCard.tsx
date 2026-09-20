import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { AppStyles } from '../styles';
import type { ThemeColors } from '../theme';

export function EmergencyFinderCard({
  onPress,
  styles,
  colors,
}: {
  onPress: () => void;
  styles: AppStyles;
  colors: ThemeColors;
}) {
  const { t } = useTranslation();

  return (
    <Pressable
      style={styles.emergencyFinderCard}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={t('emergencyCard.title')}
    >
      <View style={styles.emergencyFinderIcon}>
        <Text style={styles.emergencyFinderEmoji} accessibilityElementsHidden>
          🏥
        </Text>
      </View>
      <View style={styles.emergencyFinderText}>
        <Text style={styles.emergencyFinderTitle}>{t('emergencyCard.title')}</Text>
        <Text style={styles.emergencyFinderDescription}>{t('emergencyCard.subtitle')}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
    </Pressable>
  );
}
