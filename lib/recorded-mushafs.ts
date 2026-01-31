import { cache } from 'react';
import type { RecordedMushaf } from '@/types/tenant.types';
import { getBackendUrl, getApiHeaders, resolveImageUrl } from '@/lib/utils';

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
    /** Reciter avatar/image URL from API (absolute or relative to backend). */
    image?: string;
    avatar?: string;
  };
  riwayah: {
    id: number;
    name: string;
  };
  surahs_count: number;
  // Legacy fields that may still be present
  madd_level?: 'qasr' | 'tawassut' | null;
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
 */
export const getRecordedMushafs = cache(async (
  tenantId: string,
  params?: GetRecordedMushafsParams
): Promise<RecordedMushaf[]> => {
  try {
    const backendUrl = getBackendUrl();
    const baseUrl = `${backendUrl.replace(/\/$/, '')}/recitations/`;
    const searchParams = new URLSearchParams();
    if (params?.search?.trim()) searchParams.set('search', params.search.trim());
    if (params?.riwayah_id?.length) {
      params.riwayah_id.forEach((id) => searchParams.append('riwayah_id', String(id)));
    }
    const page = params?.page ?? 1;
    const pageSize = params?.page_size ?? 100;
    searchParams.set('page', String(page));
    searchParams.set('page_size', String(pageSize));
    const apiUrl = `${baseUrl}?${searchParams.toString()}`;

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
      console.error(`[getRecordedMushafs] API error: ${response.status} ${response.statusText}`);
      return [];
    }

    const data: PaginatedResponse<RecitationApiResponse> = await response.json();
    console.log(`[getRecordedMushafs] API response:`, data);

    // Outline colors per Figma: blue, green, purple, red, pink
    const OUTLINE_PALETTE = ['#2563eb', '#059669', '#7c3aed', '#dc2626', '#db2777'];

    // Map API response to RecordedMushaf model
    return data.results.map((recitation, i): RecordedMushaf => {
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
          qasr: 'قصر',
          tawassut: 'التوسط',
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

      // Use image/avatar from API only; no mock paths (empty = show person icon)
      const backendUrl = getBackendUrl();
      const avatarImage =
        resolveImageUrl(
          recitation.reciter?.image ?? recitation.reciter?.avatar,
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
        href: `/${tenantId}/recitations/${recitation.id}`,
      };
    });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error(`[getRecordedMushafs] Request timeout for ${apiUrl}`);
        throw new Error(`API request timeout: ${apiUrl}`);
      }
      throw fetchError;
    }
  } catch (error) {
    const backendUrl = getBackendUrl();
    const apiUrl = `${backendUrl.replace(/\/$/, '')}/recitations/`;
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (isDevelopment) {
      // In development, use warn instead of error to reduce noise
      console.warn(`[getRecordedMushafs] API unavailable (${apiUrl}), returning empty array`);
    } else {
      // In production/staging, log as error and return empty array
      if (error instanceof Error) {
        console.error(`[getRecordedMushafs] Error fetching from ${apiUrl}:`, error.message);
      } else {
        console.error(`[getRecordedMushafs] Unknown error fetching from ${apiUrl}:`, error);
      }
    }
    return [];
  }
});

/**
 * Get a single recitation by ID
 */
export const getRecitationById = cache(async (recitationId: string | number): Promise<RecitationApiResponse | null> => {
  try {
    const backendUrl = getBackendUrl();
    // Try query parameter format first (API might not support REST endpoint for single recitation)
    const apiUrl = `${backendUrl.replace(/\/$/, '')}/recitations/?id=${recitationId}`;
    
    console.log(`[getRecitationById] Fetching from: ${apiUrl}`);
    console.log(`[getRecitationById] Requested recitationId: ${recitationId} (type: ${typeof recitationId})`);
    
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
        // If response is paginated, find the matching ID in results
        recitation = responseData.results.find((r: RecitationApiResponse) => String(r.id) === String(recitationId)) || null;
        // If not found by ID match, fall back to first result (for backward compatibility)
        if (!recitation && responseData.results.length > 0) {
          recitation = responseData.results[0];
        }
      } else if (responseData.id) {
        // If response is a single object, verify ID matches
        if (String(responseData.id) === String(recitationId)) {
          recitation = responseData as RecitationApiResponse;
        }
      }
      
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



