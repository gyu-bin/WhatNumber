import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ThemeColors, ViewMode } from '../theme';

interface ViewModeToggleProps {
  mode: ViewMode;
  colors: ThemeColors;
  onChange: (mode: ViewMode) => void;
}

export function ViewModeToggle({ mode, colors, onChange }: ViewModeToggleProps) {
  return (
    <View style={[styles.wrap, { backgroundColor: colors.bg, borderColor: colors.border }]} accessibilityRole="tablist">
      <Pressable
        style={[styles.btn, mode === 'list' && { backgroundColor: colors.accentMuted }]}
        onPress={() => onChange('list')}
        accessibilityRole="tab"
        accessibilityState={{ selected: mode === 'list' }}
        accessibilityLabel="리스트 보기"
      >
        <Text
          style={[
            styles.label,
            { color: mode === 'list' ? colors.accent : colors.textTertiary },
          ]}
        >
          리스트
        </Text>
      </Pressable>
      <Pressable
        style={[styles.btn, mode === 'card' && { backgroundColor: colors.accentMuted }]}
        onPress={() => onChange('card')}
        accessibilityRole="tab"
        accessibilityState={{ selected: mode === 'card' }}
        accessibilityLabel="카드 보기"
      >
        <Text
          style={[
            styles.label,
            { color: mode === 'card' ? colors.accent : colors.textTertiary },
          ]}
        >
          카드
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 2,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  btn: {
    minWidth: 50,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
});
