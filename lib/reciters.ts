import { cache } from 'react';
import { getBackendUrl, getApiHeaders } from '@/lib/utils';
import type { ReciterCardProps } from '@/components/cards/ReciterCard';

/**
 * API response model for reciters endpoint
 * Based on API docs: GET /reciters/ returns paginated response
 */
interface ReciterApiResponse {
  id: number;
  name: string;
  recitations_count: number;
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
        return getMockReciters(tenantId);
      }

      const data: PaginatedResponse<ReciterApiResponse> = await response.json();

      // Map API response to ReciterCardProps
      return data.results.map((reciter): ReciterCardProps => {
        return {
          id: String(reciter.id),
          name: reciter.name,
          title: 'قارئ وإمام', // Default title, could come from API
          image: `/images/reciters/reciter-${reciter.id}.jpg`, // Fallback image path
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
      console.warn(`[getReciters] API unavailable (${apiUrl}), using mock data as fallback`);
    } else {
      // In production, log as error
      if (error instanceof Error) {
        console.error(`[getReciters] Error fetching from ${apiUrl}:`, error.message);
      } else {
        console.error(`[getReciters] Unknown error fetching from ${apiUrl}:`, error);
      }
    }
    
    // Return mock data as fallback
    return getMockReciters(tenantId);
  }
});

/**
 * Mock data fallback when API is unavailable
 */
function getMockReciters(tenantId: string): ReciterCardProps[] {
  return [
    {
      id: '1',
      name: 'الشيخ أحمد العبيدي',
      title: 'قارئ وإمام',
      image: '/images/reciters/reciter-1.jpg',
      publisher: 'موقع دار الإسلام',
      publisherUrl: 'https://example.com',
      href: `/${tenantId}/reciters/1`,
    },
    {
      id: '2',
      name: 'الشيخ سامي السلمي',
      title: 'قارئ وإمام',
      image: '/images/reciters/reciter-2.jpg',
      publisher: 'موقع دار الإسلام',
      publisherUrl: 'https://example.com',
      href: `/${tenantId}/reciters/2`,
    },
    {
      id: '3',
      name: 'الشيخ يوسف الدوسري',
      title: 'قارئ وإمام',
      image: '/images/reciters/reciter-3.jpg',
      publisher: 'موقع دار الإسلام',
      publisherUrl: 'https://example.com',
      href: `/${tenantId}/reciters/3`,
    },
    {
      id: '4',
      name: 'الشيخ ياسر الدوسري',
      title: 'قارئ وإمام',
      image: '/images/reciters/reciter-4.jpg',
      publisher: 'موقع دار الإسلام',
      publisherUrl: 'https://example.com',
      href: `/${tenantId}/reciters/4`,
    },
  ];
}

