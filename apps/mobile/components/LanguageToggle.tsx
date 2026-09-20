import { Pressable, Text, View } from 'react-native';
import { APP_LOCALES, LOCALE_LABELS, type AppLocale } from '../i18n/types';
import type { ThemeColors } from '../theme';

export function LanguageToggle({
  locale,
  colors,
  onChange,
}: {
  locale: AppLocale;
  colors: ThemeColors;
  onChange: (locale: AppLocale) => void;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        justifyContent: 'flex-end',
        maxWidth: 200,
      }}
    >
      {APP_LOCALES.map((code) => {
        const active = code === locale;
        return (
          <Pressable
            key={code}
            onPress={() => onChange(code)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={LOCALE_LABELS[code]}
            style={{
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 8,
              backgroundColor: active ? colors.accent : colors.tipBg,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: '600',
                color: active ? '#FFFFFF' : colors.textSecondary,
              }}
            >
              {LOCALE_LABELS[code]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
