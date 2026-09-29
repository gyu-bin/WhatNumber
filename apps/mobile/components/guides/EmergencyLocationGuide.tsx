import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ThemeColors } from '../../theme';
import { GuideButton, GuideSheet } from './GuideSheet';
import { useGuideCopy } from './copy';
export function EmergencyLocationGuide({ colors, onClose, onContinue }: { colors: ThemeColors; onClose: () => void; onContinue: () => void }) {
  const c = useGuideCopy();
  return <GuideSheet colors={colors} onClose={onClose} icon="location" title={c.nearby} body={c.locationBody} actions={<><GuideButton colors={colors} label={c.find} onPress={onContinue} /><GuideButton secondary colors={colors} label={c.notNow} onPress={onClose} /></>}>
    <View style={{ gap: 12, marginTop: 24 }}>{c.checks.map((text) => <View key={text} style={{ flexDirection: 'row', gap: 10 }}><Ionicons name="checkmark-circle" size={20} color={colors.accent} /><Text style={{ flex: 1, color: colors.textSecondary, fontSize: 14, lineHeight: 21 }}>{text}</Text></View>)}</View>
  </GuideSheet>;
}
