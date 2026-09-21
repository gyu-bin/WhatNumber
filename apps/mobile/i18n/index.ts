import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { NativeModules, Platform } from 'react-native';
import type { NumberItem } from '@whatnumber/shared';
import { APP_LOCALES, type AppLocale } from './types';

/**
 * Avoid `expo-localization` here.
 * App Store 1.0.0 was built without that native module; importing it in an OTA
 * bundle crashes before first paint and expo-updates silently rolls back.
 */
function readDeviceLanguageTag(): string {
  try {
    if (Platform.OS === 'ios') {
      const settings = NativeModules.SettingsManager?.settings;
      const appleLocale =
        (typeof settings?.AppleLocale === 'string' && settings.AppleLocale) ||
        (Array.isArray(settings?.AppleLanguages) && settings.AppleLanguages[0]) ||
        '';
      if (appleLocale) return String(appleLocale);
    }
    const androidLocale = NativeModules.I18nManager?.localeIdentifier;
    if (typeof androidLocale === 'string' && androidLocale) return androidLocale;
  } catch {
    /* keep fallback */
  }
  return 'ko';
}

import koUi from './locales/ko/ui.json';
import enUi from './locales/en/ui.json';
import zhUi from './locales/zh/ui.json';
import jaUi from './locales/ja/ui.json';
import koNumbers from './locales/ko/numbers.json';
import enNumbers from './locales/en/numbers.json';
import zhNumbers from './locales/zh/numbers.json';
import jaNumbers from './locales/ja/numbers.json';
import koDetails from './locales/ko/details.json';
import enDetails from './locales/en/details.json';
import zhDetails from './locales/zh/details.json';
import jaDetails from './locales/ja/details.json';
import { getNumberDetail } from '@whatnumber/shared';

type NumberCopy = { title?: string; desc?: string; tip?: string };
type DetailBundle = Record<string, string[]>;

const numberBundles: Record<AppLocale, Record<string, NumberCopy>> = {
  ko: koNumbers as Record<string, NumberCopy>,
  en: enNumbers as Record<string, NumberCopy>,
  zh: zhNumbers as Record<string, NumberCopy>,
  ja: jaNumbers as Record<string, NumberCopy>,
};

const detailBundles: Record<AppLocale, DetailBundle> = {
  ko: koDetails as DetailBundle,
  en: enDetails as DetailBundle,
  zh: zhDetails as DetailBundle,
  ja: jaDetails as DetailBundle,
};

void i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources: {
    ko: { ui: koUi },
    en: { ui: enUi },
    zh: { ui: zhUi },
    ja: { ui: jaUi },
  },
  lng: 'ko',
  fallbackLng: ['en', 'ko'],
  defaultNS: 'ui',
  ns: ['ui'],
  interpolation: { escapeValue: false },
  returnNull: false,
});

export function detectDeviceLocale(): AppLocale {
  const tag = readDeviceLanguageTag().toLowerCase().replace('_', '-');
  const code = tag.split('-')[0] || 'ko';
  if (code === 'zh' || tag.startsWith('zh')) return 'zh';
  if (code === 'ja') return 'ja';
  if (code === 'en') return 'en';
  if (code === 'ko') return 'ko';
  return 'en';
}

export function getAppLocale(): AppLocale {
  const lng = (i18n.resolvedLanguage || i18n.language || 'ko').split('-')[0];
  if ((APP_LOCALES as readonly string[]).includes(lng)) return lng as AppLocale;
  return 'ko';
}

export async function changeAppLocale(locale: AppLocale): Promise<void> {
  if (i18n.language === locale) return;
  await i18n.changeLanguage(locale);
}

export function localizeNumber(
  item: NumberItem,
  locale: AppLocale = getAppLocale(),
): NumberItem {
  const copy =
    numberBundles[locale]?.[item.id] ??
    numberBundles.en?.[item.id] ??
    numberBundles.ko?.[item.id];
  if (!copy) return item;
  return {
    ...item,
    title: copy.title?.trim() || item.title,
    desc: copy.desc?.trim() || item.desc,
    tip: copy.tip?.trim() || item.tip,
  };
}

export function localizeNumbers(
  items: NumberItem[],
  locale?: AppLocale,
): NumberItem[] {
  return items.map((item) => localizeNumber(item, locale));
}

export function localizeNumberDetail(
  id: string,
  locale: AppLocale = getAppLocale(),
): string[] | undefined {
  const localized =
    detailBundles[locale]?.[id] ??
    detailBundles.en?.[id] ??
    detailBundles.ko?.[id];
  if (localized?.length) return localized;
  const fallback = getNumberDetail(id);
  return fallback.length > 0 ? fallback : undefined;
}

export default i18n;
