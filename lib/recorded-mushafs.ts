import { cache } from 'react';
import type { RecordedMushaf } from '@/types/tenant.types';
import { getBackendUrl } from '@/lib/utils';

/**
 * API response model for recitations endpoint
 */
interface RecitationApiResponse {
  id: string;
  name: string;
  reciter: {
    id: string;
    name: string;
  };
  riwayah: {
    id: string;
    name: string;
  };
  madd_level: 'qasr' | 'tawassut' | null;
  meem_behaviour: 'silah' | 'skoun' | null;
  year: number | null;
}

/**
 * Server-side data accessor for Recorded Mushafs.
 * Fetches from the backend API and maps to the UI model.
 */
export const getRecordedMushafs = cache(async (tenantId: string): Promise<RecordedMushaf[]> => {
  try {
    const backendUrl = getBackendUrl();
    // Ensure URL is properly formatted (no trailing slash, then add endpoint)
    const apiUrl = `${backendUrl.replace(/\/$/, '')}/recitations`;
    
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

    const data: RecitationApiResponse[] = await response.json();
    console.log(`[getRecordedMushafs] API response:`, data);

    // Map API response to RecordedMushaf model
    return data.map((recitation): RecordedMushaf => {
      // Build badges from riwayah, madd_level, and meem_behaviour
      const badges: RecordedMushaf['badges'] = [];

      // Add riwayah badge
      if (recitation.riwayah?.name) {
        badges.push({
          id: `riwayah-${recitation.riwayah.id}`,
          label: recitation.riwayah.name,
          icon: 'book',
          tone: 'green',
        });
      }

      // Add madd_level badge if present
      if (recitation.madd_level) {
        const maddLabels: Record<string, string> = {
          qasr: 'قصر',
          tawassut: 'توسط',
        };
        badges.push({
          id: `madd-${recitation.id}`,
          label: maddLabels[recitation.madd_level] || recitation.madd_level,
          icon: 'sparkle',
          tone: 'gold',
        });
      }

      // Build description from reciter name
      const description = recitation.reciter?.name
        ? `استمع للقرآن الكريم بصوت ${recitation.reciter.name}`
        : 'استمع للقرآن الكريم';

      // Use reciter ID to determine avatar image (fallback to default)
      // In production, this might come from the API or a CDN
      const avatarImage = `/images/mushafs/mushaf-reciter-${recitation.reciter?.id || 'default'}.png`;

      return {
        id: recitation.id,
        title: recitation.name || 'مصحف',
        description,
        riwayaLabel: recitation.riwayah?.name ? `برواية ${recitation.riwayah.name}` : undefined,
        reciter: {
          id: recitation.reciter?.id || '',
          name: recitation.reciter?.name || 'غير معروف',
          avatarImage,
        },
        visuals: {
          topBackgroundColor: '#EEF9F2', // Default color, could come from API later
        },
        badges: badges.length > 0 ? badges : undefined,
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
    const apiUrl = `${backendUrl.replace(/\/$/, '')}/recitations`;
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
 * Mock data fallback for development when API is unavailable
 */
function getMockMushafs(tenantId: string): RecordedMushaf[] {
  return [
    {
      id: 'mushaf-1',
      title: 'مصحف الحرم المكي',
      description: 'استمع للقرآن الكريم بصوت الشيخ أحمد العبيدي',
      reciter: {
        id: 'reciter-1',
        name: 'الشيخ أحمد العبيدي',
        avatarImage: '/images/mushafs/mushaf-reciter-1.png',
      },
      visuals: {
        topBackgroundColor: '#EEF9F2',
      },
      badges: [
        { id: 'b1', label: 'حفص', icon: 'book', tone: 'green' },
        { id: 'b2', label: 'جودة عالية', icon: 'sparkle', tone: 'gold' },
      ],
      href: `/${tenantId}/recitations/1`,
    },
    {
      id: 'mushaf-2',
      title: 'مصحف الحرم المدني',
      description: 'استمع للقرآن الكريم بصوت الشيخ سامي السلمي',
      reciter: {
        id: 'reciter-2',
        name: 'الشيخ سامي السلمي',
        avatarImage: '/images/mushafs/mushaf-reciter-2.png',
      },
      visuals: {
        topBackgroundColor: '#EEF9F2',
      },
      badges: [{ id: 'b1', label: 'حفص', icon: 'book', tone: 'green' }],
      href: `/${tenantId}/recitations/2`,
    },
    {
      id: 'mushaf-3',
      title: 'مصحف برواية حفص',
      description: 'استمع للقرآن الكريم بصوت الشيخ يوسف الدوسري',
      reciter: {
        id: 'reciter-3',
        name: 'الشيخ يوسف الدوسري',
        avatarImage: '/images/mushafs/mushaf-reciter-3.png',
      },
      visuals: {
        topBackgroundColor: '#EEF9F2',
      },
      badges: [{ id: 'b1', label: 'حفص', icon: 'book', tone: 'green' }],
      href: `/${tenantId}/recitations/3`,
    },
    {
      id: 'mushaf-4',
      title: 'مصحف برواية ورش',
      description: 'استمع للقرآن الكريم بصوت الشيخ ياسر الدوسري',
      reciter: {
        id: 'reciter-4',
        name: 'الشيخ ياسر الدوسري',
        avatarImage: '/images/mushafs/mushaf-reciter-4.png',
      },
      visuals: {
        topBackgroundColor: '#EEF9F2',
      },
      badges: [{ id: 'b1', label: 'ورش', icon: 'book', tone: 'green' }],
      href: `/${tenantId}/recitations/4`,
    },
  ];
}


