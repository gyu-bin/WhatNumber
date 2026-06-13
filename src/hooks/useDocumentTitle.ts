import { usePageSeo, type PageSeoOptions } from './usePageSeo';

/** @deprecated usePageSeo 사용 */
export function useDocumentTitle(title?: string) {
  const options: PageSeoOptions = title ? { title, path: window.location.pathname } : {};
  usePageSeo(options);
}
