import { Linking, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ThemeColors } from '../theme';
import { REGIONAL_AREA_CODES, regionalCallCopy, regionalTelHref } from '../utils/regionalDialing';

type RegionalCallProps = {
  number: string; locale: string; colors: ThemeColors; onClose: () => void;
};

export function RegionalCallContent({ number, locale, colors, onClose, onCancel = onClose }: RegionalCallProps & {
  onCancel?: () => void;
}) {
  const copy = regionalCallCopy(locale);
  return (
    <Pressable style={[styles.sheet, { backgroundColor: colors.surface }]} onPress={(event) => event.stopPropagation()}>
      <SafeAreaView edges={['bottom']} style={{ flexShrink: 1 }} accessibilityViewIsModal>
          <Text accessibilityRole="header" style={[styles.title, { color: colors.textPrimary }]}>{copy.title} · {number}</Text>
          <Text style={[styles.instruction, { color: colors.textSecondary }]}>{copy.instruction}</Text>
          <ScrollView>
            {REGIONAL_AREA_CODES.map((area) => (
              <Pressable key={area.code} accessibilityRole="button" style={styles.row} onPress={() => {
                const href = regionalTelHref(number, area.code);
                if (href) void Linking.openURL(href).catch(() => {});
                onClose();
              }}>
                <Text style={{ color: colors.textPrimary, fontSize: 17 }}>{area.labels[copy.index]} · {area.code}-{number}</Text>
              </Pressable>
            ))}
          </ScrollView>
          <Pressable accessibilityRole="button" onPress={onCancel} style={styles.row}>
            <Text style={{ color: colors.accent, textAlign: 'center', fontSize: 17 }}>{copy.cancel}</Text>
          </Pressable>
      </SafeAreaView>
    </Pressable>
  );
}

export function RegionalCallSheet(props: RegionalCallProps) {
  const copy = regionalCallCopy(props.locale);
  return (
    <Modal transparent visible animationType="slide" onRequestClose={props.onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={props.onClose} accessibilityLabel={copy.cancel} />
        <RegionalCallContent {...props} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: '#0008' },
  sheet: { maxHeight: '80%', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 24, paddingTop: 24 },
  title: { fontSize: 22, fontWeight: '700' },
  instruction: { fontSize: 15, lineHeight: 22, marginVertical: 12 },
  row: { paddingVertical: 15, minHeight: 48 },
});
