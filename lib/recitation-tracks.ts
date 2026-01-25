import { cache } from 'react';
import { getBackendUrl } from '@/lib/utils';
import type { RecitationItem } from '@/components/audio/AudioPlayer';

/**
 * API response model for recitation tracks endpoint
 * Based on PR #177, this returns individual audio tracks (recitation-track)
 */
interface RecitationTrackApiResponse {
  id: string;
  title?: string;
  surah_name?: string;
  surah_number?: number;
  reciter?: {
    id: string;
    name: string;
  };
  recitation?: {
    id: string;
    name: string;
  };
  duration?: string;
  audio_url?: string;
  thumbnail_url?: string;
  // Add other fields as needed based on actual API response
}

/**
 * Server-side data accessor for Featured Recitation Tracks.
 * Fetches from the backend API and maps to the UI model.
 * 
 * Note: This fetches individual tracks (recitation-track), not full recitations.
 */
export const getFeaturedRecitationTracks = cache(async (tenantId: string, limit: number = 5): Promise<RecitationItem[]> => {
  try {
    const backendUrl = getBackendUrl();
    const apiUrl = `${backendUrl.replace(/\/$/, '')}/recitation_track_list?limit=${limit}`;
    
    console.log(`[getFeaturedRecitationTracks] Fetching from: ${apiUrl}`);
    
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
        console.error(`[getFeaturedRecitationTracks] API error: ${response.status} ${response.statusText}`);
        return getMockRecitationTracks(tenantId);
      }

      const data: RecitationTrackApiResponse[] = await response.json();

      // Map API response to RecitationItem
      return data.map((track): RecitationItem => {
        // Build title from surah_name or title
        const title = track.surah_name || track.title || 'سورة';
        
        // Build surah info if available
        const surahInfo = track.surah_number 
          ? `${track.surah_number}. ${track.surah_name || ''}`
          : undefined;

        return {
          id: track.id,
          title,
          reciterName: track.reciter?.name || 'غير معروف',
          duration: track.duration || '0:00',
          audioUrl: track.audio_url || '',
          image: track.thumbnail_url || `/images/reciters/reciter-${track.reciter?.id || 'default'}.jpg`,
          surahInfo,
        };
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error(`[getFeaturedRecitationTracks] Request timeout for ${apiUrl}`);
        throw new Error(`API request timeout: ${apiUrl}`);
      }
      throw fetchError;
    }
  } catch (error) {
    const backendUrl = getBackendUrl();
    const apiUrl = `${backendUrl.replace(/\/$/, '')}/recitation_track_list`;
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (isDevelopment) {
      // In development, use warn instead of error to reduce noise
      console.warn(`[getFeaturedRecitationTracks] API unavailable (${apiUrl}), using mock data as fallback`);
    } else {
      // In production, log as error
      if (error instanceof Error) {
        console.error(`[getFeaturedRecitationTracks] Error fetching from ${apiUrl}:`, error.message);
      } else {
        console.error(`[getFeaturedRecitationTracks] Unknown error fetching from ${apiUrl}:`, error);
      }
    }
    
    // Return mock data as fallback
    return getMockRecitationTracks(tenantId);
  }
});

/**
 * Mock data fallback when API is unavailable
 */
function getMockRecitationTracks(tenantId: string): RecitationItem[] {
  return [
    {
      id: '1',
      title: 'سورة الكهف',
      reciterName: 'الشيخ أحمد العبيدي',
      duration: '12:32',
      audioUrl: 'https://example.com/audio/surah-kahf.mp3',
      image: '/images/reciters/reciter-1.jpg',
    },
    {
      id: '2',
      title: 'سورة الكهف',
      reciterName: 'الشيخ سامي السلمي',
      duration: '12:32',
      audioUrl: 'https://example.com/audio/surah-kahf-2.mp3',
      image: '/images/reciters/reciter-2.jpg',
    },
    {
      id: '3',
      title: 'سورة الكهف',
      reciterName: 'الشيخ يوسف الدوسري',
      duration: '12:32',
      audioUrl: 'https://example.com/audio/surah-kahf-3.mp3',
      image: '/images/reciters/reciter-3.jpg',
    },
    {
      id: '4',
      title: 'سورة الكهف',
      reciterName: 'الشيخ أحمد العبيدي',
      duration: '12:32',
      audioUrl: 'https://example.com/audio/surah-kahf-4.mp3',
      image: '/images/reciters/reciter-1.jpg',
    },
    {
      id: '5',
      title: 'سورة الكهف',
      reciterName: 'الشيخ يوسف الدوسري',
      duration: '12:32',
      audioUrl: 'https://example.com/audio/surah-kahf-5.mp3',
      image: '/images/reciters/reciter-3.jpg',
    },
  ];
}

