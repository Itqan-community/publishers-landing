'use client';

import { useEffect } from 'react';
import { onCLS, onINP, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals';

/**
 * Web Vitals tracker component
 * Monitors Core Web Vitals and sends them to analytics
 */
export function WebVitals() {
  useEffect(() => {
    function sendToAnalytics(metric: Metric) {
      // Only track in production
      if (process.env.NODE_ENV !== 'production') return;

      // Send to Google Analytics if available
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', metric.name, {
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          event_category: 'Web Vitals',
          event_label: metric.id,
          non_interaction: true,
        });
      }
    }

    // Track all Core Web Vitals
    // Note: INP replaced FID in web-vitals v3+
    onCLS(sendToAnalytics);
    onINP(sendToAnalytics);
    onFCP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
  }, []);

  return null;
}
