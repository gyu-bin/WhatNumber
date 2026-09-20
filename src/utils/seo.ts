import { NUMBERS, type NumberItem } from '@whatnumber/shared';
import i18n, { localizeNumber, localizeNumberDetail } from '../i18n';

export function getSiteName(): string {
  return i18n.t('brand.name');
}

export function getDefaultTitle(): string {
  return i18n.t('seo.defaultTitle');
}

export function getDefaultDescription(): string {
  return i18n.t('seo.defaultDescription');
}

/** @deprecated use getSiteName() */
export const SITE_NAME = '몇번이야';
/** @deprecated use getDefaultTitle() */
export const DEFAULT_TITLE = '몇번이야 — 몰라서 못 쓴 번호들';
/** @deprecated use getDefaultDescription() */
export const DEFAULT_DESCRIPTION =
  '갑자기 응급실, 고속도로 사고, 전세사기, 보이스피싱… 있는지도 몰랐던 공공 전화번호를 상황별로 정리. 탭하면 바로 전화 연결.';

export function getSiteUrl(): string {
  const url =
    typeof window !== 'undefined'
      ? window.location.origin
      : import.meta.env.VITE_SITE_URL || 'https://whatnumber-mu.vercel.app';
  return url.replace(/\/$/, '');
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}`;
}

export function numberPath(id: string): string {
  return `/n/${id}`;
}

export function buildTitle(pageTitle?: string): string {
  return pageTitle ? `${pageTitle} | ${getSiteName()}` : getDefaultTitle();
}

export function numberPageTitle(item: NumberItem): string {
  const localized = localizeNumber(item);
  return `${localized.title} ${localized.num}`;
}

export function numberPageDescription(item: NumberItem): string {
  const localized = localizeNumber(item);
  const detail = localizeNumberDetail(item.id)?.[0];
  const extra =
    detail ?? localized.tip ?? i18n.t('seo.numberFallback');
  return `${localized.desc} · ${i18n.t('seo.phoneLabel')} ${localized.num}. ${extra}`;
}

export function guidePageDescription(summary: string): string {
  return summary.length > 155 ? `${summary.slice(0, 152)}…` : summary;
}

export function buildWebsiteJsonLd() {
  const url = absoluteUrl('/');
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: getSiteName(),
    alternateName: i18n.t('seo.alternateName'),
    url,
    description: getDefaultDescription(),
    inLanguage: i18n.t('seo.htmlLang'),
    publisher: {
      '@type': 'Organization',
      name: getSiteName(),
      url,
    },
  };
}

export function buildItemListJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: i18n.t('seo.itemListName'),
    numberOfItems: NUMBERS.length,
    itemListElement: NUMBERS.map((item, index) => {
      const localized = localizeNumber(item);
      return {
        '@type': 'ListItem',
        position: index + 1,
        name: localized.title,
        url: absoluteUrl(numberPath(item.id)),
      };
    }),
  };
}

export function buildNumberJsonLd(item: NumberItem) {
  const localized = localizeNumber(item);
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: numberPageTitle(localized),
    description: numberPageDescription(localized),
    url: absoluteUrl(numberPath(item.id)),
    inLanguage: i18n.t('seo.htmlLang'),
    isPartOf: {
      '@type': 'WebSite',
      name: getSiteName(),
      url: absoluteUrl('/'),
    },
    about: {
      '@type': 'GovernmentService',
      name: localized.title,
      description: localized.desc,
      serviceType: i18n.t(`categories.${item.cat}`),
      areaServed: {
        '@type': 'Country',
        name: i18n.t('seo.country'),
      },
      provider: {
        '@type': 'Organization',
        name: i18n.t(`categories.${item.cat}`),
      },
    },
    mainEntity: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: item.num.replace(/-/g, ''),
      availableLanguage: ['Korean', 'English', 'Chinese', 'Japanese'],
    },
  };
}

export function buildBreadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildArticleJsonLd(input: {
  title: string;
  description: string;
  path: string;
  dateModified?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.title,
    description: input.description,
    url: absoluteUrl(input.path),
    inLanguage: i18n.t('seo.htmlLang'),
    dateModified: input.dateModified ?? new Date().toISOString().slice(0, 10),
    author: {
      '@type': 'Organization',
      name: getSiteName(),
    },
    publisher: {
      '@type': 'Organization',
      name: getSiteName(),
      url: absoluteUrl('/'),
    },
  };
}

export function buildFaqJsonLd(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
