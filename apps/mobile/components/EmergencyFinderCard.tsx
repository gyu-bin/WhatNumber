import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
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
  return (
    <Pressable
      style={styles.emergencyFinderCard}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="내 주변 응급실 찾기"
      accessibilityHint="가까운 응급의료기관 화면으로 이동합니다"
    >
      <View style={styles.emergencyFinderIcon}>
        <Text style={styles.emergencyFinderEmoji} accessibilityElementsHidden>
          🏥
        </Text>
      </View>
      <View style={styles.emergencyFinderText}>
        <Text style={styles.emergencyFinderTitle}>내 주변 응급실 찾기</Text>
        <Text style={styles.emergencyFinderDescription}>
          현재 위치 기준 가까운 응급의료기관 확인
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
    </Pressable>
  );
}
