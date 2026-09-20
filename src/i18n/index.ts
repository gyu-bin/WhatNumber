import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import type { NumberItem } from '@whatnumber/shared';
import { getNumberDetail } from '@whatnumber/shared';

import koWeb from './locales/ko/web.json';
import enWeb from './locales/en/web.json';
import zhWeb from './locales/zh/web.json';
import jaWeb from './locales/ja/web.json';

import koNumbers from '../../apps/mobile/i18n/locales/ko/numbers.json';
import enNumbers from '../../apps/mobile/i18n/locales/en/numbers.json';
import zhNumbers from '../../apps/mobile/i18n/locales/zh/numbers.json';
import jaNumbers from '../../apps/mobile/i18n/locales/ja/numbers.json';

import koDetails from '../../apps/mobile/i18n/locales/ko/details.json';
import enDetails from '../../apps/mobile/i18n/locales/en/details.json';
import zhDetails from '../../apps/mobile/i18n/locales/zh/details.json';
import jaDetails from '../../apps/mobile/i18n/locales/ja/details.json';

export const APP_LOCALES = ['ko', 'en', 'zh', 'ja'] as const;
export type AppLocale = (typeof APP_LOCALES)[number];
export const LOCALE_STORAGE_KEY = 'wn_web_locale_v1';
export const LOCALE_LABELS: Record<AppLocale, string> = {
  ko: '한국어',
  en: 'English',
  zh: '中文',
  ja: '日本語',
};

type NumberCopy = { title?: string; desc?: string; tip?: string };

const numberBundles: Record<AppLocale, Record<string, NumberCopy>> = {
  ko: koNumbers as Record<string, NumberCopy>,
  en: enNumbers as Record<string, NumberCopy>,
  zh: zhNumbers as Record<string, NumberCopy>,
  ja: jaNumbers as Record<string, NumberCopy>,
};

const detailBundles: Record<AppLocale, Record<string, string[]>> = {
  ko: koDetails as Record<string, string[]>,
  en: enDetails as Record<string, string[]>,
  zh: zhDetails as Record<string, string[]>,
  ja: jaDetails as Record<string, string[]>,
};

const initialLocale = detectInitialLocale();

void i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources: {
    ko: { web: koWeb },
    en: { web: enWeb },
    zh: { web: zhWeb },
    ja: { web: jaWeb },
  },
  lng: initialLocale,
  fallbackLng: ['en', 'ko'],
  defaultNS: 'web',
  ns: ['web'],
  interpolation: { escapeValue: false },
  returnNull: false,
});

document.documentElement.lang =
  initialLocale === 'zh' ? 'zh-Hans' : initialLocale;

function detectInitialLocale(): AppLocale {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored && (APP_LOCALES as readonly string[]).includes(stored)) {
      return stored as AppLocale;
    }
  } catch {
    /* ignore */
  }
  const nav = (navigator.language || 'ko').toLowerCase();
  if (nav.startsWith('zh')) return 'zh';
  if (nav.startsWith('ja')) return 'ja';
  if (nav.startsWith('en')) return 'en';
  if (nav.startsWith('ko')) return 'ko';
  return 'en';
}

export function getAppLocale(): AppLocale {
  const lng = (i18n.resolvedLanguage || i18n.language || 'ko').split('-')[0];
  if ((APP_LOCALES as readonly string[]).includes(lng)) return lng as AppLocale;
  return 'ko';
}

export async function changeAppLocale(locale: AppLocale): Promise<void> {
  await i18n.changeLanguage(locale);
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    /* ignore */
  }
  document.documentElement.lang = locale === 'zh' ? 'zh-Hans' : locale;
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
  const paras =
    detailBundles[locale]?.[id] ??
    detailBundles.en?.[id] ??
    detailBundles.ko?.[id] ??
    getNumberDetail(id);
  return paras?.length ? paras : undefined;
}

export default i18n;
