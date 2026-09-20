import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { Theme, ThemeColors } from '../theme';

interface ThemeToggleProps {
  theme: Theme;
  colors: ThemeColors;
  onChange: (theme: Theme) => void;
}

export function ThemeToggle({ theme, colors, onChange }: ThemeToggleProps) {
  const { t } = useTranslation();

  return (
    <View
      style={[styles.wrap, { backgroundColor: colors.bg, borderColor: colors.border }]}
      accessibilityRole="tablist"
    >
      {(['light', 'dark'] as const).map((option) => {
        const selected = theme === option;
        const label = option === 'light' ? t('settings.themeLight') : t('settings.themeDark');
        return (
          <Pressable
            key={option}
            style={[styles.btn, selected && { backgroundColor: colors.accentMuted }]}
            onPress={() => onChange(option)}
            accessibilityLabel={label}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
          >
            <Text style={[styles.label, { color: selected ? colors.accent : colors.textTertiary }]}>
              {label}
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
