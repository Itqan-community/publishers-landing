'use client';

import { useEffect } from 'react';

export type DebugApiCall = { path: string; tenantId: string };

/**
 * When on localhost or staging, fetches backend config then re-requests the given
 * paths against the real backend URL so the Network tab shows the actual request
 * URL (e.g. https://staging.api.cms.itqan.dev/recitations/?id=123) for debugging.
 * In production, backend-config returns 403 and we do nothing (no backend URL exposed).
 */
export function DebugApiVisibility({ calls }: { calls: DebugApiCall[] }) {
  useEffect(() => {
    if (!calls.length) return;
    const tenantId = calls[0].tenantId;
    fetch(`/api/debug/backend-config?tenant=${encodeURIComponent(tenantId)}`)
      .then((res) => {
        if (!res.ok) return; // production: 403, do nothing
        return res.json();
      })
      .then((data: { backendBaseUrl?: string } | undefined) => {
        if (!data?.backendBaseUrl) return;
        const base = data.backendBaseUrl.replace(/\/$/, '');
        calls.forEach(({ path }) => {
          const url = `${base}/${path}`;
          fetch(url, { credentials: 'omit' }).catch(() => {
            // Ignore errors; we only care about request visibility in Network tab
          });
        });
      })
      .catch(() => {});
  }, [calls]);
  return null;
}
