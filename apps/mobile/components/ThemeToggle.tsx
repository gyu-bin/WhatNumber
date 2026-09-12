import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Theme, ThemeColors } from '../theme';

interface ThemeToggleProps {
  theme: Theme;
  colors: ThemeColors;
  onChange: (theme: Theme) => void;
}

export function ThemeToggle({ theme, colors, onChange }: ThemeToggleProps) {
  return (
    <View style={[styles.wrap, { backgroundColor: colors.bg, borderColor: colors.border }]} accessibilityRole="tablist">
      {(['light', 'dark'] as const).map((option) => {
        const selected = theme === option;
        return (
          <Pressable
            key={option}
            style={[styles.btn, selected && { backgroundColor: colors.accentMuted }]}
            onPress={() => onChange(option)}
            accessibilityLabel={`${option === 'light' ? '라이트' : '다크'} 모드`}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
          >
            <Text style={[styles.label, { color: selected ? colors.accent : colors.textTertiary }]}>
              {option === 'light' ? '라이트' : '다크'}
            </Text>
          </Pressable>
        );
      })}
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
    minWidth: 58,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
});
