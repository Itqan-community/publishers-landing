import { cache } from 'react';
import type { RecordedMushaf } from '@/types/tenant.types';
import { getBackendUrl } from '@/lib/backend-url';
import { getApiHeaders, resolveImageUrl } from '@/lib/utils';
import { getTenantDomain } from '@/lib/tenant-domain';

/**
 * API response model for recitations endpoint
 * Based on API docs: GET /recitations/ returns paginated response
 */
interface RecitationApiResponse {
  id: number;
  name: string;
  description?: string;
  publisher?: {
    id: number;
    name: string;
  };
  reciter: {
    id: number;
    name: string;
    /** Reciter image URL from API (absolute or relative to backend). */
    image_url?: string;
    image?: string;
    avatar?: string;
  };
  riwayah: {
    id: number;
    name: string;
  };
  surahs_count: number;
  // Legacy fields that may still be present
  madd_level?: 'qasr' | 'twassut' | null;
  meem_behaviour?: 'silah' | 'skoun' | null;
  year?: number | null;
}

/**
 * Paginated API response wrapper
 */
interface PaginatedResponse<T> {
  results: T[];
  count: number;
}

/**
 * Query params for listing recitations (backend filtering).
 * Mirrors API: search, riwayah_id (array), optional pagination.
 */
export interface GetRecordedMushafsParams {
  search?: string;
  riwayah_id?: number[];
  page?: number;
  page_size?: number;
}

/**
 * Server-side data accessor for Recorded Mushafs.
 * Fetches from the backend API and maps to the UI model.
 * Pass search and riwayah_id for backend filtering (synced from URL).
 * @param basePath '' on custom domain, '/<tenantId>' on path-based; used for href.
 * @param callerPage Optional label for console logs (e.g. "qiraahs/[slug] page").
 */
/** No cache wrapper — listing must always reflect current API response. */
export async function getRecordedMushafs(
  tenantId: string,
  params?: GetRecordedMushafsParams,
  basePath?: string,
  callerPage?: string
): Promise<RecordedMushaf[]> {
  const caller = callerPage ? ` (called from: ${callerPage})` : '';
  const pathPrefix = basePath !== undefined ? basePath : `/${tenantId}`;
  try {
    const backendUrl = await getBackendUrl(tenantId);
    const tenantDomain = await getTenantDomain(tenantId);
    
    const searchParams = new URLSearchParams();
    if (params?.search?.trim()) searchParams.set('search', params.search.trim());
    if (params?.riwayah_id?.length) {
      params.riwayah_id.forEach((id) => searchParams.append('riwayah_id', String(id)));
    }
    const page = params?.page ?? 1;
    const pageSize = params?.page_size ?? 100;
    searchParams.set('page', String(page));
    searchParams.set('page_size', String(pageSize));
    const apiUrl = `${backendUrl}/recitations/?${searchParams.toString()}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: getApiHeaders(tenantDomain),
        signal: controller.signal,
        cache: 'no-store', // never cache — listing count must match API
      });
      
      clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`[getRecordedMushafs]${caller} API error: ${response.status} ${response.statusText}`);
      return [];
    }

    const data: PaginatedResponse<RecitationApiResponse> = await response.json();
    console.log(JSON.stringify({ api: 'getRecordedMushafs', url: apiUrl, calledFrom: callerPage ?? null, response: data }, null, 2));
    // One card per API result — no padding, no mock items, no duplication
    const results = Array.isArray(data.results) ? data.results : [];
    const OUTLINE_PALETTE = ['#2563eb', '#059669', '#7c3aed', '#dc2626', '#db2777'];

    return results.map((recitation, i): RecordedMushaf => {
      // Build badges from riwayah, madd_level, and meem_behaviour
      const badges: RecordedMushaf['badges'] = [];

      // Add riwayah badge (design uses "رواية X" in metadata)
      if (recitation.riwayah?.name) {
        badges.push({
          id: `riwayah-${recitation.riwayah.id}`,
          label: `رواية ${recitation.riwayah.name}`,
          icon: 'book',
          tone: 'green',
        });
      }

      // Add madd_level badge if present (e.g. التوسط)
      if (recitation.madd_level) {
        const maddLabels: Record<string, string> = {
          qasr: 'بالقصر',
          twassut: 'بالتوسط',
        };
        badges.push({
          id: `madd-${recitation.id}`,
          label: maddLabels[recitation.madd_level] || recitation.madd_level,
          icon: 'sparkle',
          tone: 'gold',
        });
      }

      // Mushaf details line (e.g. المصحف المرتل للشيخ يوسف الدوسري)
      const description = recitation.reciter?.name
        ? `المصحف المرتل ل${recitation.reciter.name}`
        : 'المصحف المرتل';

      // Use image_url / image / avatar from API only; no mock paths (empty = show person icon)
      const avatarImage =
        resolveImageUrl(
          recitation.reciter?.image_url ?? recitation.reciter?.image ?? recitation.reciter?.avatar,
          backendUrl
        ) ?? '';

      return {
        id: String(recitation.id),
        title: recitation.name || 'مصحف',
        description,
        riwayaLabel: recitation.riwayah?.name ? `رواية ${recitation.riwayah.name}` : undefined,
        reciter: {
          id: String(recitation.reciter?.id || ''),
          name: recitation.reciter?.name || 'غير معروف',
          avatarImage,
        },
        visuals: {
          topBackgroundColor: '#EEF9F2',
          outlineColor: OUTLINE_PALETTE[i % OUTLINE_PALETTE.length],
        },
        badges: badges.length > 0 ? badges : undefined,
        year: recitation.year ?? undefined,
        href: `${pathPrefix.replace(/\/$/, '')}/recitations/${recitation.id}`,
      };
    });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error(`[getRecordedMushafs]${caller} Request timeout for ${apiUrl}`);
        throw new Error(`API request timeout: ${apiUrl}`);
      }
      throw fetchError;
    }
  } catch (error) {
    const backendUrl = await getBackendUrl(tenantId);
    const apiUrl = `${backendUrl}/recitations/`;
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (isDevelopment) {
      // In development, use warn instead of error to reduce noise
      console.warn(`[getRecordedMushafs]${caller} API unavailable (${apiUrl}), returning empty array`);
    } else {
      // In production/staging, log as error and return empty array
      if (error instanceof Error) {
        console.error(`[getRecordedMushafs]${caller} Error fetching from ${apiUrl}:`, error.message);
      } else {
        console.error(`[getRecordedMushafs]${caller} Unknown error fetching from ${apiUrl}:`, error);
      }
    }
    return [];
  }
}

/**
 * Get a single recitation by ID.
 * @param tenantId - Tenant ID for backend URL (uses default tenant if omitted).
 */
export const getRecitationById = cache(async (
  recitationId: string | number,
  tenantId?: string
): Promise<RecitationApiResponse | null> => {
  try {
    const backendUrl = await getBackendUrl(tenantId);
    const tenantDomain = await getTenantDomain(tenantId || 'default');
    
    // Try query parameter format first (API might not support REST endpoint for single recitation)
    const apiUrl = `${backendUrl}/recitations/?id=${recitationId}`;
    
    // console.log(`[getRecitationById] Fetching from: ${apiUrl}`);
    // console.log(`[getRecitationById] Requested recitationId: ${recitationId} (type: ${typeof recitationId})`);
    
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
        console.error(`[getRecitationById] API error: ${response.status} ${response.statusText}`);
        return null;
      }

      const responseData = await response.json();
      
      // Handle both single object response and paginated response
      let recitation: RecitationApiResponse | null = null;
      
      if (Array.isArray(responseData)) {
        // If response is an array, find the matching ID
        recitation = responseData.find((r: RecitationApiResponse) => String(r.id) === String(recitationId)) || null;
      } else if (responseData.results && Array.isArray(responseData.results)) {
        // If response is paginated, find the matching ID in results; no fallback — wrong ID must 404
        recitation = responseData.results.find((r: RecitationApiResponse) => String(r.id) === String(recitationId)) || null;
      } else if (responseData.id) {
        // If response is a single object, verify ID matches
        if (String(responseData.id) === String(recitationId)) {
          recitation = responseData as RecitationApiResponse;
        }
      }
      
      /*
      console.log('========================================');
      console.log('[getRecitationById] API Response:');
      console.log('  - Requested recitationId:', recitationId);
      if (recitation) {
        console.log('  - Found recitation.id:', recitation.id);
        console.log('  - Found recitation.name:', recitation.name);
        console.log('  - IDs match:', String(recitation.id) === String(recitationId));
      } else {
        console.log('  - No recitation found matching ID:', recitationId);
      }
      console.log('========================================');
      */
      
      return recitation;
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error(`[getRecitationById] Request timeout for ${apiUrl}`);
        return null;
      }
      throw fetchError;
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`[getRecitationById] Error:`, error.message);
    } else {
      console.error(`[getRecitationById] Unknown error:`, error);
    }
    return null;
  }
});



