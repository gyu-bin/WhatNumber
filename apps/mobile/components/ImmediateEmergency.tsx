import { Ionicons } from '@expo/vector-icons';
import { Linking, Pressable, Text, View } from 'react-native';
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
  const iconSize = getHomeDensity() === 'compact' ? 30 : 36;

  return (
    <View style={styles.immediateEmergency}>
      <Text style={styles.immediateEmergencyTitle}>지금 바로 필요한 번호</Text>
      <View style={styles.immediateEmergencyRow}>
        <Pressable
          style={[styles.immediateCard, styles.immediateCardFire]}
          onPress={() => onOpen(fireItem)}
          accessibilityRole="button"
          accessibilityLabel={`${fireItem.num} 소방 구급 상세`}
        >
          <View style={styles.immediateCardTop}>
            <NumberVisualIcon item={fireItem} size={iconSize} />
            <Text style={[styles.immediateCardNum, { color: colors.accent }]}>
              {fireItem.num}
            </Text>
          </View>
          <Text style={styles.immediateCardLabel}>소방·구급</Text>
          <Text style={styles.immediateCardDesc}>화재 · 구조 · 응급상황</Text>
          <Pressable
            style={[styles.immediateCallBtn, styles.immediateCallBtnOnFire]}
            onPress={() => void Linking.openURL(telHref(fireItem.num))}
            accessibilityRole="button"
            accessibilityLabel={`${fireItem.num} 전화`}
          >
            <Ionicons name="call" size={14} color={colors.accent} />
            <Text style={styles.immediateCallText}>전화</Text>
          </Pressable>
        </Pressable>

        <Pressable
          style={[styles.immediateCard, styles.immediateCardPolice]}
          onPress={() => onOpen(policeItem)}
          accessibilityRole="button"
          accessibilityLabel={`${policeItem.num} 경찰 상세`}
        >
          <View style={styles.immediateCardTop}>
            <NumberVisualIcon item={policeItem} size={iconSize} />
            <Text style={[styles.immediateCardNum, { color: colors.textPrimary }]}>
              {policeItem.num}
            </Text>
          </View>
          <Text style={styles.immediateCardLabel}>경찰</Text>
          <Text style={styles.immediateCardDesc}>범죄 · 신고 · 긴급상황</Text>
          <Pressable
            style={styles.immediateCallBtn}
            onPress={() => void Linking.openURL(telHref(policeItem.num))}
            accessibilityRole="button"
            accessibilityLabel={`${policeItem.num} 전화`}
          >
            <Ionicons name="call" size={14} color={colors.accent} />
            <Text style={styles.immediateCallText}>전화</Text>
          </Pressable>
        </Pressable>
      </View>
    </View>
  );
}
