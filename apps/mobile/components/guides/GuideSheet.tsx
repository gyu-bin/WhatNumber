import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { Animated, AccessibilityInfo, Modal, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ThemeColors } from '../../theme';
import { useGuideCopy } from './copy';

export function GuideButton({ label, onPress, colors, secondary = false }: { label: string; onPress: () => void; colors: ThemeColors; secondary?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({ pressed }) => [s.button, { backgroundColor: secondary ? colors.tipBg : colors.accent, opacity: pressed ? 0.75 : 1 }]}><Text style={[s.buttonText, { color: secondary ? colors.textPrimary : '#fff' }]}>{label}</Text></Pressable>;
}
export function GuideModal({ children, colors, onBack, large = false }: { children: ReactNode; colors: ThemeColors; onBack: () => void; large?: boolean }) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then((reduced) => {
      if (active) Animated.timing(progress, { toValue: 1, duration: reduced ? 0 : 230, useNativeDriver: true }).start();
    }).catch(() => { if (active) progress.setValue(1); });
    return () => { active = false; };
  }, [progress]);
  return <Modal transparent visible animationType="none" onRequestClose={onBack} statusBarTranslucent>
    <View style={[s.overlay, { backgroundColor: colors.overlay }]}>
      <Animated.View accessibilityViewIsModal importantForAccessibility="yes" style={[s.panel, { backgroundColor: colors.surface, paddingTop: large ? 8 : 0, paddingBottom: Math.max(insets.bottom - 4, 6), maxHeight: height - insets.top - 12, ...(large ? { maxHeight: Math.min(height * 0.88, 740) } : {}), opacity: progress, transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }] }]}>{children}</Animated.View>
    </View>
  </Modal>;
}
export function GuideSheet({ colors, onClose, icon, title, body, children, actions }: { colors: ThemeColors; onClose: () => void; icon: keyof typeof Ionicons.glyphMap; title: string; body?: string; children?: ReactNode; actions: ReactNode }) {
  const copy = useGuideCopy();
  return <GuideModal colors={colors} onBack={onClose}>
    <View style={s.top}><View style={[s.handle, { backgroundColor: colors.divider }]} /><Pressable style={s.close} accessibilityRole="button" accessibilityLabel={copy.close} onPress={onClose}><Ionicons name="close" size={23} color={colors.textSecondary} /></Pressable></View>
    <ScrollView style={{ flexGrow: 0 }} contentContainerStyle={s.content}>
      <View style={[s.icon, { backgroundColor: colors.accentMuted }]}><Ionicons name={icon} size={32} color={colors.accent} /></View>
      <Text accessibilityRole="header" style={[s.title, { color: colors.textPrimary }]}>{title}</Text>
      {body ? <Text style={[s.body, { color: colors.textSecondary }]}>{body}</Text> : null}
      {children}
    </ScrollView>
    <View style={s.actions}>{actions}</View>
  </GuideModal>;
}
export const s = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' }, panel: { width: '100%', maxWidth: 600, alignSelf: 'center', borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden' },
  top: { minHeight: 44, alignItems: 'center' }, handle: { height: 4, width: 34, borderRadius: 4, marginTop: 10 }, close: { position: 'absolute', right: 12, top: 0, minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: 24, paddingBottom: 24 }, icon: { width: 68, height: 68, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 20 }, title: { fontSize: 23, fontWeight: '800', letterSpacing: -0.6, lineHeight: 32 }, body: { fontSize: 16, lineHeight: 25, marginTop: 12 }, actions: { gap: 10, paddingHorizontal: 24, paddingTop: 8 }, button: { minHeight: 48, paddingHorizontal: 16, paddingVertical: 13, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }, buttonText: { fontSize: 16, fontWeight: '700', textAlign: 'center' },
});
