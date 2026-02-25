/**
 * Qiraahs API — GET /tenant/qiraahs/ and merge with riwayahs for TenReadingsSection.
 * Server-only; used by Tahbeer template.
 */

import { cache } from 'react';
import { getBackendUrl } from '@/lib/backend-url';
import { getApiHeaders } from '@/lib/utils';
import { getTenantDomain } from '@/lib/tenant-domain';

/** API response for one qiraah (GET /qiraahs/). BE may add riwayahs tomorrow. */
export interface QiraahApiItem {
  id: number;
  name: string;
  slug: string;
  is_active: boolean;
  riwayahs_count?: number;
  recitations_count?: number;
  /** From API when BE adds it, or merged from GET /riwayahs/ today */
  riwayahs?: Array<{ id: number; name: string }>;
  /** Bio text for qiraah/imam (e.g. used in top section between quotes). */
  bio?: string | null;
}

interface QiraahOut {
  id: number;
  name: string;
  slug: string;
  is_active: boolean;
  riwayahs_count?: number;
  recitations_count?: number;
  riwayahs?: Array<{ id: number; name: string }>;
  bio?: string | null;
}

interface PagedQiraahOut {
  results: QiraahOut[];
  count: number;
}

interface RiwayahOut {
  id: number;
  name: string;
  slug: string;
  qiraah: { id: number; name: string; slug?: string };
  recitations_count?: number;
}

interface PagedRiwayahOut {
  results: RiwayahOut[];
  count: number;
}

/**
 * Fetches qiraahs and riwayahs, merges riwayahs into each qiraah.
 * Returns qiraahs with riwayahs attached (for TenReadingsSection).
 * @param callerPage Optional label for console logs (e.g. "TahbeerTemplate (home)")
 */
export const getQiraahs = cache(async (
  tenantId: string,
  callerPage?: string
): Promise<QiraahApiItem[]> => {
  const caller = callerPage ? ` (called from: ${callerPage})` : '';
  try {
    const backendUrl = await getBackendUrl(tenantId);
    const tenantDomain = await getTenantDomain(tenantId);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const qiraahsUrl = `${backendUrl}/qiraahs/?ordering=name&page_size=20`;
      const riwayahsUrl = `${backendUrl}/riwayahs/?page_size=20&ordering=name`;
      const [qiraahsRes, riwayahsRes] = await Promise.all([
        fetch(qiraahsUrl, {
          method: 'GET',
          headers: getApiHeaders(tenantDomain),
          signal: controller.signal,
          cache: 'no-store',
        }),
        fetch(riwayahsUrl, {
          method: 'GET',
          headers: getApiHeaders(tenantDomain),
          signal: controller.signal,
          cache: 'no-store',
        }),
      ]);

      clearTimeout(timeoutId);

      if (!qiraahsRes.ok) {
        console.error(`[getQiraahs]${caller} Qiraahs API error: ${qiraahsRes.status} ${qiraahsRes.statusText}`);
        return [];
      }

      const qiraahsData: PagedQiraahOut = await qiraahsRes.json();
      console.log(JSON.stringify({ api: 'getQiraahs', url: qiraahsUrl, calledFrom: callerPage ?? null, response: qiraahsData }, null, 2));
      const qiraahs = qiraahsData.results ?? [];

      const riwayahsByQiraahId = new Map<number, Array<{ id: number; name: string }>>();

      if (riwayahsRes.ok) {
        const riwayahsData: PagedRiwayahOut = await riwayahsRes.json();
        console.log(JSON.stringify({ api: 'getQiraahs (riwayahs)', url: riwayahsUrl, calledFrom: callerPage ?? null, response: riwayahsData }, null, 2));
        const riwayahs = riwayahsData.results ?? [];
        for (const r of riwayahs) {
          const qid = r.qiraah?.id;
          if (qid == null) continue;
          if (!riwayahsByQiraahId.has(qid)) {
            riwayahsByQiraahId.set(qid, []);
          }
          riwayahsByQiraahId.get(qid)!.push({ id: r.id, name: r.name });
        }
      }

      return qiraahs.map((q) => ({
        id: q.id,
        name: q.name,
        slug: q.slug,
        is_active: q.is_active,
        riwayahs_count: q.riwayahs_count,
        recitations_count: q.recitations_count,
        riwayahs: q.riwayahs ?? riwayahsByQiraahId.get(q.id) ?? [],
        bio: q.bio ?? undefined,
      }));
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (e) {
    console.error('[getQiraahs] Failed to fetch qiraahs:', e);
    return [];
  }
});

/**
 * Fetches a single qiraah by slug (GET /qiraahs/?slug=...).
 * If the API does not return riwayahs, fetches GET /riwayahs/?qiraah_id=... and merges.
 * Returns null when not found or on error.
 * @param callerPage Optional label for console logs (e.g. "qiraahs/[slug] page")
 */
export const getQiraahBySlug = cache(async (
  tenantId: string,
  slug: string,
  callerPage?: string
): Promise<QiraahApiItem | null> => {
  const caller = callerPage ? ` (called from: ${callerPage})` : '';
  if (!slug?.trim()) return null;
  try {
    const backendUrl = await getBackendUrl(tenantId);
    const tenantDomain = await getTenantDomain(tenantId);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const qiraahsUrl = `${backendUrl}/qiraahs/?slug=${encodeURIComponent(slug.trim())}&page_size=1`;
      const qiraahsRes = await fetch(qiraahsUrl, {
        method: 'GET',
        headers: getApiHeaders(tenantDomain),
        signal: controller.signal,
        cache: 'no-store',
      });
      clearTimeout(timeoutId);

      if (!qiraahsRes.ok) {
        console.error(`[getQiraahBySlug]${caller} Qiraahs API error: ${qiraahsRes.status} ${qiraahsRes.statusText}`);
        return null;
      }

      const qiraahsData: PagedQiraahOut = await qiraahsRes.json();
      console.log(JSON.stringify({ api: 'getQiraahBySlug', url: qiraahsUrl, calledFrom: callerPage ?? null, response: qiraahsData }, null, 2));
      const results = qiraahsData.results ?? [];
      const q = results[0];
      if (!q) return null;

      let riwayahs = q.riwayahs ?? [];
      if (riwayahs.length === 0) {
        const riwayahsUrl = `${backendUrl}/riwayahs/?qiraah_id=${q.id}&page_size=20&ordering=name`;
        const riwayahsRes = await fetch(riwayahsUrl, {
          method: 'GET',
          headers: getApiHeaders(tenantDomain),
          signal: controller.signal,
          cache: 'no-store',
        });
        if (riwayahsRes.ok) {
          const riwayahsData: PagedRiwayahOut = await riwayahsRes.json();
          console.log(JSON.stringify({ api: 'getQiraahBySlug (riwayahs)', url: riwayahsUrl, calledFrom: callerPage ?? null, response: riwayahsData }, null, 2));
          const list = riwayahsData.results ?? [];
          riwayahs = list.map((r) => ({ id: r.id, name: r.name }));
        }
      }

      return {
        id: q.id,
        name: q.name,
        slug: q.slug,
        is_active: q.is_active,
        riwayahs_count: q.riwayahs_count,
        recitations_count: q.recitations_count,
        riwayahs,
        bio: q.bio ?? undefined,
      };
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (e) {
    console.error('[getQiraahBySlug] Failed to fetch qiraah by slug:', e);
    return null;
  }
});
