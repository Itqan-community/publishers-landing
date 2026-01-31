import { cache } from 'react';
import { getBackendUrl, getApiHeaders, resolveImageUrl } from '@/lib/utils';
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
 */
export const getReciters = cache(async (tenantId: string): Promise<ReciterCardProps[]> => {
  try {
    const backendUrl = getBackendUrl();
    const apiUrl = `${backendUrl.replace(/\/$/, '')}/reciters`;
    
    console.log(`[getReciters] Fetching from: ${apiUrl}`);
    
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
        console.error(`[getReciters] API error: ${response.status} ${response.statusText}`);
        return [];
      }

      const data: PaginatedResponse<ReciterApiResponse> = await response.json();
      const backendUrl = getBackendUrl();

      // Map API response to ReciterCardProps; use image from API only (no mock paths)
      return data.results.map((reciter): ReciterCardProps => {
        const image =
          resolveImageUrl(reciter.image ?? reciter.avatar, backendUrl) ?? '';
        return {
          id: String(reciter.id),
          name: reciter.name,
          title: 'قارئ وإمام', // Default title, could come from API
          image,
          publisher: 'موقع دار الإسلام', // Default, could come from API
          publisherUrl: 'https://example.com', // Default, could come from API
          href: `/${tenantId}/reciters/${reciter.id}`,
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
    const backendUrl = getBackendUrl();
    const apiUrl = `${backendUrl.replace(/\/$/, '')}/reciters/`;
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

