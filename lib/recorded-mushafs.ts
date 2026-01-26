import { cache } from 'react';
import type { RecordedMushaf } from '@/types/tenant.types';
import { getBackendUrl } from '@/lib/utils';

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
 * Server-side data accessor for Recorded Mushafs.
 * Fetches from the backend API and maps to the UI model.
 */
export const getRecordedMushafs = cache(async (tenantId: string): Promise<RecordedMushaf[]> => {
  try {
    const backendUrl = getBackendUrl();
    // Ensure URL is properly formatted (no trailing slash, then add endpoint with trailing slash)
    const apiUrl = `${backendUrl.replace(/\/$/, '')}/recitations/`;
    
    console.log(`[getRecordedMushafs] Fetching from: ${apiUrl}`);
    
    // Add timeout and better error handling for server-side fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        signal: controller.signal,
        // Cache for 5 minutes, revalidate on demand
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

      // Use reciter ID to determine avatar image (fallback to default)
      const avatarImage = `/images/mushafs/mushaf-reciter-${recitation.reciter?.id || 'default'}.png`;

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
      console.warn(`[getRecordedMushafs] API unavailable (${apiUrl}), using mock data as fallback`);
      return getMockMushafs(tenantId);
    } else {
      // In production/staging, log as error and return empty array
      if (error instanceof Error) {
        console.error(`[getRecordedMushafs] Error fetching from ${apiUrl}:`, error.message);
      } else {
        console.error(`[getRecordedMushafs] Unknown error fetching from ${apiUrl}:`, error);
      }
      return [];
    }
  }
});

/**
 * Get a single recitation by ID
 */
export const getRecitationById = cache(async (recitationId: string | number): Promise<RecitationApiResponse | null> => {
  try {
    const backendUrl = getBackendUrl();
    const apiUrl = `${backendUrl.replace(/\/$/, '')}/recitations/?id=${recitationId}`;
    
    console.log(`[getRecitationById] Fetching from: ${apiUrl}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        signal: controller.signal,
        next: { revalidate: 300 },
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(`[getRecitationById] API error: ${response.status} ${response.statusText}`);
        return null;
      }

      const data: PaginatedResponse<RecitationApiResponse> = await response.json();
      
      console.log('========================================');
      console.log('[getRecitationById] API Response:');
      console.log('  - Requested recitationId:', recitationId);
      console.log('  - Results count:', data.results.length);
      if (data.results.length > 0) {
        console.log('  - Found recitation.id:', data.results[0].id);
        console.log('  - Found recitation.name:', data.results[0].name);
        console.log('  - IDs match:', String(data.results[0].id) === String(recitationId));
      }
      console.log('========================================');
      
      // Return the first result if found
      return data.results.length > 0 ? data.results[0] : null;
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

const MOCK_OUTLINE_PALETTE = ['#2563eb', '#059669', '#7c3aed', '#dc2626', '#db2777'];

/**
 * Mock data fallback for development when API is unavailable
 */
function getMockMushafs(tenantId: string): RecordedMushaf[] {
  return [
    {
      id: 'mushaf-1',
      title: 'مصحف الحرم المكي',
      description: 'المصحف المرتل لالشيخ أحمد العبيدي',
      reciter: {
        id: 'reciter-1',
        name: 'الشيخ أحمد العبيدي',
        avatarImage: '/images/mushafs/mushaf-reciter-1.png',
      },
      visuals: {
        topBackgroundColor: '#EEF9F2',
        outlineColor: MOCK_OUTLINE_PALETTE[0],
      },
      badges: [
        { id: 'b1', label: 'رواية حفص عن عاصم', icon: 'book', tone: 'green' },
        { id: 'b2', label: 'التوسط', icon: 'sparkle', tone: 'gold' },
      ],
      year: 1970,
      href: `/${tenantId}/recitations/1`,
    },
    {
      id: 'mushaf-2',
      title: 'مصحف الحرم المدني',
      description: 'المصحف المرتل لالشيخ سامي السلمي',
      reciter: {
        id: 'reciter-2',
        name: 'الشيخ سامي السلمي',
        avatarImage: '/images/mushafs/mushaf-reciter-2.png',
      },
      visuals: {
        topBackgroundColor: '#EEF9F2',
        outlineColor: MOCK_OUTLINE_PALETTE[1],
      },
      badges: [
        { id: 'b1', label: 'رواية حفص عن عاصم', icon: 'book', tone: 'green' },
        { id: 'b2', label: 'التوسط', icon: 'sparkle', tone: 'gold' },
      ],
      year: 1970,
      href: `/${tenantId}/recitations/2`,
    },
    {
      id: 'mushaf-3',
      title: 'مصحف برواية حفص',
      description: 'المصحف المرتل لالشيخ يوسف الدوسري',
      reciter: {
        id: 'reciter-3',
        name: 'الشيخ يوسف الدوسري',
        avatarImage: '/images/mushafs/mushaf-reciter-3.png',
      },
      visuals: {
        topBackgroundColor: '#EEF9F2',
        outlineColor: MOCK_OUTLINE_PALETTE[2],
      },
      badges: [
        { id: 'b1', label: 'رواية حفص عن عاصم', icon: 'book', tone: 'green' },
        { id: 'b2', label: 'التوسط', icon: 'sparkle', tone: 'gold' },
      ],
      year: 1970,
      href: `/${tenantId}/recitations/3`,
    },
    {
      id: 'mushaf-4',
      title: 'مصحف برواية ورش',
      description: 'المصحف المرتل لالشيخ ياسر الدوسري',
      reciter: {
        id: 'reciter-4',
        name: 'الشيخ ياسر الدوسري',
        avatarImage: '/images/mushafs/mushaf-reciter-4.png',
      },
      visuals: {
        topBackgroundColor: '#EEF9F2',
        outlineColor: MOCK_OUTLINE_PALETTE[3],
      },
      badges: [
        { id: 'b1', label: 'رواية ورش', icon: 'book', tone: 'green' },
        { id: 'b2', label: 'التوسط', icon: 'sparkle', tone: 'gold' },
      ],
      year: 1970,
      href: `/${tenantId}/recitations/4`,
    },
  ];
}


