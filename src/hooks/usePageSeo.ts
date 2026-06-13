import { useEffect } from 'react';
import {
  DEFAULT_DESCRIPTION,
  absoluteUrl,
  buildTitle,
  getSiteUrl,
} from '../utils/seo';

export interface PageSeoOptions {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  type?: 'website' | 'article';
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function upsertLink(rel: string, href: string) {
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

export function usePageSeo({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  image,
  noIndex = false,
  type = 'website',
}: PageSeoOptions = {}) {
  useEffect(() => {
    const pageTitle = buildTitle(title);
    const url = absoluteUrl(path);
    const ogImage = image ?? `${getSiteUrl()}/og-image.png?v=3`;

    document.title = pageTitle;

    upsertMeta('name', 'description', description);
    upsertMeta('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');

    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:title', pageTitle);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:image', ogImage);
    upsertMeta('property', 'og:locale', 'ko_KR');
    upsertMeta('property', 'og:site_name', '몇번이야');

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', pageTitle);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', ogImage);

    upsertLink('canonical', url);
  }, [title, description, path, image, noIndex, type]);
}
