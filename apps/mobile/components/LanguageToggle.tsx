import { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
  const [open, setOpen] = useState(false);

  const select = (code: AppLocale) => {
    setOpen(false);
    if (code !== locale) onChange(code);
  };

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={LOCALE_LABELS[locale]}
        accessibilityHint="Select language"
        style={[
          styles.trigger,
          {
            backgroundColor: colors.bg,
            borderColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.triggerLabel, { color: colors.textPrimary }]}>
          {LOCALE_LABELS[locale]}
        </Text>
        <Ionicons name="chevron-down" size={14} color={colors.textSecondary} />
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.backdrop}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setOpen(false)} />
          <View
            style={[
              styles.menu,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            {APP_LOCALES.map((code) => {
              const active = code === locale;
              return (
                <Pressable
                  key={code}
                  onPress={() => select(code)}
                  accessibilityRole="menuitem"
                  accessibilityState={{ selected: active }}
                  style={[
                    styles.option,
                    active && { backgroundColor: colors.accentMuted },
                  ]}
                >
                  <Text
                    style={[
                      styles.optionLabel,
                      { color: active ? colors.accent : colors.textPrimary },
                    ]}
                  >
                    {LOCALE_LABELS[code]}
                  </Text>
                  {active ? (
                    <Ionicons name="checkmark" size={16} color={colors.accent} />
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    minWidth: 96,
  },
  triggerLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  menu: {
    width: '100%',
    maxWidth: 280,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    paddingVertical: 4,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
});
