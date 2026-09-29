import { Platform, Text, View } from 'react-native';
import type { ThemeColors } from '../../theme';
import { GuideButton, GuideSheet } from './GuideSheet';
import { useGuideCopy } from './copy';
export function WidgetHowToSheet({ colors, onClose }: { colors: ThemeColors; onClose: () => void }) {
  const c = useGuideCopy();
  const steps = Platform.OS === 'ios' ? c.iosSteps : c.androidSteps;
  return <GuideSheet colors={colors} onClose={onClose} icon="grid-outline" title={c.howToTitle} actions={<GuideButton colors={colors} label={c.done} onPress={onClose} />}>
    <View style={{ gap: 18, marginTop: 24 }}>{steps.map((step, i) => <View key={step} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}><View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: colors.accentMuted, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontWeight: '700', color: colors.accent }}>{i + 1}</Text></View><Text style={{ flex: 1, color: colors.textPrimary, fontSize: 16, lineHeight: 25 }}>{step}</Text></View>)}</View>
    <Text style={{ color: colors.textSecondary, fontSize: 13, lineHeight: 20, marginTop: 24 }}>{c.menuNote}</Text>
  </GuideSheet>;
}
