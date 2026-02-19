import { cache } from 'react';
import { getBackendUrl } from '@/lib/backend-url';
import { getApiHeaders } from '@/lib/utils';
import { getTenantDomain } from '@/lib/tenant-domain';
import { LISTING_RIWAYAH_ID, type RiwayahOption } from '@/lib/listing-riwayah';

export type { RiwayahOption } from '@/lib/listing-riwayah';

/**
 * API response item for GET /riwayahs/
 * List riwayahs that have at least one READY recitation Asset.
 */
interface RiwayahApiItem {
  id: number;
  name: string;
  recitations_count: number;
}

interface RiwayahsPaginatedResponse {
  results: RiwayahApiItem[];
  count: number;
}

/**
 * Label format used in recitation badges and filter dropdown.
 * Must match RecordedMushaf badge label: "رواية {name}"
 */
export function riwayahToLabel(name: string): string {
  return `رواية ${name}`;
}

/**
 * Fetches riwayahs from the backend (GET /riwayahs/) and returns
 * dropdown options with id (for URL/API) and label (for display).
 * Cached and revalidated like other API data.
 * @param tenantId - Tenant ID for backend URL (uses default tenant if omitted).
 * @param callerPage Optional label for console logs (e.g. "recitations listing page").
 */
export const getRiwayahs = cache(async (tenantId?: string, callerPage?: string): Promise<RiwayahOption[]> => {
  const caller = callerPage ? ` (called from: ${callerPage})` : '';
  try {
    const backendUrl = await getBackendUrl(tenantId);
    const tenantDomain = await getTenantDomain(tenantId || 'default');
    const apiUrl = `${backendUrl}/riwayahs/`;


    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: getApiHeaders(tenantDomain),
        signal: controller.signal,
        cache: 'no-store',
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(`[getRiwayahs]${caller} API error: ${response.status} ${response.statusText}`);
        return [];
      }

      const data: RiwayahsPaginatedResponse = await response.json();
      console.log(JSON.stringify({ api: 'getRiwayahs', url: apiUrl, calledFrom: callerPage ?? null, response: data }, null, 2));
      const results = data.results ?? [];
      const options = results.map((r) => ({ id: r.id, label: riwayahToLabel(r.name) }));
      // Forced for now: only show riwayah ID 1 in listing filter
      return options.filter((o) => o.id === LISTING_RIWAYAH_ID);
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (e) {
    console.error('[getRiwayahs] Failed to fetch riwayahs:', e);
    return [];
  }
});
