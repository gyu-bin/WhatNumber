import { useEffect } from 'react';

const BASE = '몇번이야';

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    const prev = document.title;
    document.title = title ? `${title} | ${BASE}` : `${BASE} — 몰라서 못 쓴 번호들`;
    return () => {
      document.title = prev;
    };
  }, [title]);
}
