import { Analytics } from '@vercel/analytics/react';
import { useLocation } from 'react-router-dom';

/** Vercel 대시보드 → Analytics에서 방문·페이지뷰 집계 */
export function VercelAnalytics() {
  const { pathname, search } = useLocation();

  return <Analytics path={pathname + search} route={pathname} />;
}
