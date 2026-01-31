import { cache } from 'react';
import { getBackendUrl, getApiHeaders } from '@/lib/utils';

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

export interface RiwayahOption {
  id: number;
  label: string;
}

/**
 * Fetches riwayahs from the backend (GET /riwayahs/) and returns
 * dropdown options with id (for URL/API) and label (for display).
 * Cached and revalidated like other API data.
 */
export const getRiwayahs = cache(async (): Promise<RiwayahOption[]> => {
  try {
    const backendUrl = getBackendUrl();
    const apiUrl = `${backendUrl.replace(/\/$/, '')}/riwayahs/`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: getApiHeaders(),
        signal: controller.signal,
        next: { revalidate: 300 },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(`[getRiwayahs] API error: ${response.status} ${response.statusText}`);
        return [];
      }

      const data: RiwayahsPaginatedResponse = await response.json();
      const results = data.results ?? [];
      console.log('[getRiwayahs] Riwayahs from API:', results);
      return results.map((r) => ({ id: r.id, label: riwayahToLabel(r.name) }));
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (e) {
    console.error('[getRiwayahs] Failed to fetch riwayahs:', e);
    return [];
  }
});
