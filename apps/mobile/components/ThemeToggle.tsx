import { Pressable, StyleSheet, Text } from 'react-native';
import type { Theme, ThemeColors } from '../theme';

interface ThemeToggleProps {
  theme: Theme;
  colors: ThemeColors;
  onToggle: () => void;
}

export function ThemeToggle({ theme, colors, onToggle }: ThemeToggleProps) {
  const isDark = theme === 'dark';

  return (
    <Pressable
      style={[styles.btn, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={onToggle}
      accessibilityLabel={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
      accessibilityRole="button"
    >
      <Text style={[styles.icon, { color: colors.textPrimary }]}>{isDark ? '☀️' : '🌙'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 16,
  },
});
