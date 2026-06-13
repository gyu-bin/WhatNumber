import { NUMBERS, type NumberItem } from '@whatnumber/shared';

export const SITE_NAME = '몇번이야';
export const DEFAULT_TITLE = `${SITE_NAME} — 몰라서 못 쓴 번호들`;
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
  return pageTitle ? `${pageTitle} | ${SITE_NAME}` : DEFAULT_TITLE;
}

export function numberPageTitle(item: NumberItem): string {
  return `${item.title} ${item.num}`;
}

export function numberPageDescription(item: NumberItem): string {
  return `${item.desc} · 전화 ${item.num}. ${item.tip ?? '몇번이야에서 상황별 공공 전화번호를 확인하세요.'}`;
}

export function guidePageDescription(summary: string): string {
  return summary.length > 155 ? `${summary.slice(0, 152)}…` : summary;
}

export function buildWebsiteJsonLd() {
  const url = absoluteUrl('/');
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url,
    description: DEFAULT_DESCRIPTION,
    inLanguage: 'ko-KR',
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url,
    },
  };
}

export function buildItemListJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: '공공 전화번호 목록',
    numberOfItems: NUMBERS.length,
    itemListElement: NUMBERS.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.title,
      url: absoluteUrl(numberPath(item.id)),
    })),
  };
}

export function buildNumberJsonLd(item: NumberItem) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: numberPageTitle(item),
    description: numberPageDescription(item),
    url: absoluteUrl(numberPath(item.id)),
    inLanguage: 'ko-KR',
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: absoluteUrl('/'),
    },
    about: {
      '@type': 'GovernmentService',
      name: item.title,
      description: item.desc,
      serviceType: item.cat,
      areaServed: {
        '@type': 'Country',
        name: '대한민국',
      },
      provider: {
        '@type': 'Organization',
        name: item.cat,
      },
    },
    mainEntity: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: item.num.replace(/-/g, ''),
      availableLanguage: 'Korean',
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
    inLanguage: 'ko-KR',
    dateModified: input.dateModified ?? new Date().toISOString().slice(0, 10),
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
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
