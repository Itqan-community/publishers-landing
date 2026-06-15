'use client';

import { Suspense, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { gaPageView, initGa } from '@/lib/analytics/ga';

interface GoogleAnalyticsProps {
  gaId: string;
  isProduction: boolean;
}

function GoogleAnalyticsTracker({ gaId, isProduction }: GoogleAnalyticsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    initGa({ measurementId: gaId, isProduction });
  }, [gaId, isProduction]);

  useEffect(() => {
    const search = searchParams?.toString();
    const path = search ? `${pathname}?${search}` : pathname;
    gaPageView(path, document.title);
  }, [pathname, searchParams]);

  return null;
}

/**
 * Per-tenant Google Analytics tracker.
 * Loads GA only in production with a valid measurement ID and sends manual SPA pageviews.
 */
export function GoogleAnalytics({ gaId, isProduction }: GoogleAnalyticsProps) {
  if (!gaId || gaId.startsWith('G-PLACEHOLDER')) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsTracker gaId={gaId} isProduction={isProduction} />
    </Suspense>
  );
}
