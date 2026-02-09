import { cache } from 'react';
import { getBackendUrl } from '@/lib/backend-url';
import { getApiHeaders, resolveImageUrl } from '@/lib/utils';
import { getTenantDomain } from '@/lib/tenant-domain';
import type { ReciterCardProps } from '@/components/cards/ReciterCard';

/**
 * API response model for reciters endpoint
 * Based on API docs: GET /reciters/ returns paginated response
 */
interface ReciterApiResponse {
  id: number;
  name: string;
  recitations_count: number;
  /** Reciter image URL from API (absolute or relative to backend). */
  image?: string;
  avatar?: string;
}

/**
 * Paginated API response wrapper
 */
interface PaginatedResponse<T> {
  results: T[];
  count: number;
}

/**
 * Server-side data accessor for Reciters.
 * Fetches from the backend API and maps to the UI model.
 * @param basePath '' on custom domain, '/<tenantId>' on path-based; used for href.
 */
export const getReciters = cache(async (
  tenantId: string,
  basePath?: string
): Promise<ReciterCardProps[]> => {
  const pathPrefix = basePath !== undefined ? basePath : `/${tenantId}`;
  try {
    const backendUrl = await getBackendUrl(tenantId);
    const tenantDomain = await getTenantDomain(tenantId);
    const apiUrl = `${backendUrl}/reciters`;
    
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
        console.error(`[getReciters] API error: ${response.status} ${response.statusText}`);
        return [];
      }

      const data: PaginatedResponse<ReciterApiResponse> = await response.json();
      const backendUrlForImages = await getBackendUrl(tenantId);

      // Map API response to ReciterCardProps; use image from API only (no mock paths)
      return data.results.map((reciter): ReciterCardProps => {
        const image =
          resolveImageUrl(reciter.image ?? reciter.avatar, backendUrlForImages) ?? '';
        return {
          id: String(reciter.id),
          name: reciter.name,
          title: 'قارئ وإمام', // Default title, could come from API
          image,
          publisher: 'موقع دار الإسلام', // Default, could come from API
          publisherUrl: 'https://example.com', // Default, could come from API
          href: `${pathPrefix}/reciters/${reciter.id}`,
        };
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error(`[getReciters] Request timeout for ${apiUrl}`);
        throw new Error(`API request timeout: ${apiUrl}`);
      }
      throw fetchError;
    }
  } catch (error) {
    const backendUrl = await getBackendUrl(tenantId);
    const apiUrl = `${backendUrl}/reciters/`;

    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (isDevelopment) {
      // In development, use warn instead of error to reduce noise
      console.warn(`[getReciters] API unavailable (${apiUrl}), returning empty array`);
    } else {
      // In production, log as error
      if (error instanceof Error) {
        console.error(`[getReciters] Error fetching from ${apiUrl}:`, error.message);
      } else {
        console.error(`[getReciters] Unknown error fetching from ${apiUrl}:`, error);
      }
    }
    
    return [];
  }
});

