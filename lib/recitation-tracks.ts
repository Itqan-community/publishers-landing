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
 * API response model for recitation tracks by asset_id
 * Based on API docs: GET /recitation-tracks/{asset_id}/
 */
interface RecitationTrackByAssetApiResponse {
  surah_number: number;
  surah_name: string;
  surah_name_en: string;
  audio_url: string;
  duration_ms: number;
  size_bytes: number;
  revelation_order: number;
  revelation_place: 'Makkah' | 'Madinah';
  ayahs_count: number;
  ayahs_timings?: Array<{
    ayah_key: string;
    start_ms: number;
    end_ms: number;
    duration_ms: number;
  }>;
}

/**
 * Paginated API response wrapper
 */
interface PaginatedResponse<T> {
  results: T[];
  count: number;
}

/**
 * Format duration from milliseconds to MM:SS or HH:MM:SS
 */
function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Normalize audio URL - convert relative URLs to absolute if needed
 */
function normalizeAudioUrl(audioUrl: string | undefined, baseUrl?: string): string {
  if (!audioUrl || audioUrl.trim() === '') {
    return '';
  }

  const trimmed = audioUrl.trim();

  // If it's already an absolute URL, return it
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // If it's a relative URL starting with /, use the base URL
  if (trimmed.startsWith('/') && baseUrl) {
    try {
      const base = new URL(baseUrl);
      return new URL(trimmed, base.origin).href;
    } catch {
      // If baseUrl is invalid, just return the original
      return trimmed;
    }
  }

  // Return as-is (might be a relative path without leading /)
  return trimmed;
}

/**
 * Server-side data accessor for Featured Recitation Tracks.
 * 
 * NOTE: There is no dedicated endpoint for featured tracks in the API.
 * This function returns mock data for now. In the future, we could:
 * - Get the first recitation and use its tracks
 * - Or create a separate endpoint on the backend
 */
export const getFeaturedRecitationTracks = cache(async (tenantId: string, limit: number = 5): Promise<RecitationItem[]> => {
  // Since there's no /recitation_track_list endpoint, return mock data
  console.warn('[getFeaturedRecitationTracks] No API endpoint available - using mock data');
  return getMockRecitationTracks(tenantId);
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

/**
 * Server-side data accessor for Recitation Tracks by Asset ID.
 * Fetches tracks for a specific recitation from GET /recitation-tracks/{asset_id}/
 * 
 * @param assetId - The recitation asset ID
 * @param reciterName - Optional reciter name to include in the response (for display)
 * @param reciterImage - Optional reciter image URL to include in the response
 * @returns Array of RecitationItem objects representing the tracks
 */
export const getRecitationTracksByAssetId = cache(async (
  assetId: string | number,
  reciterName?: string,
  reciterImage?: string
): Promise<RecitationItem[]> => {
  try {
    const backendUrl = getBackendUrl();
    
    // Ensure assetId is properly converted to string for URL
    const assetIdStr = String(assetId);
    const apiUrl = `${backendUrl.replace(/\/$/, '')}/recitation-tracks/${assetIdStr}/`;
    
    console.log('========================================');
    console.log('[getRecitationTracksByAssetId] INPUT PARAMETERS:');
    console.log('  - assetId (raw):', assetId);
    console.log('  - assetId type:', typeof assetId);
    console.log('  - assetId (string):', assetIdStr);
    console.log('  - API URL:', apiUrl);
    console.log('  - reciterName:', reciterName);
    console.log('  - reciterImage:', reciterImage);
    console.log('========================================');
    
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
        console.error(`[getRecitationTracksByAssetId] API error: ${response.status} ${response.statusText}`);
        return [];
      }

      const data: PaginatedResponse<RecitationTrackByAssetApiResponse> = await response.json();
      
      // Log the full API response for debugging - THIS IS WHAT THE USER REQUESTED
      console.log('========================================');
      console.log('[getRecitationTracksByAssetId] FULL API RESPONSE FROM /recitation-tracks/{asset_id}/:');
      console.log('========================================');
      console.log(JSON.stringify(data, null, 2));
      console.log('========================================');
      console.log('[getRecitationTracksByAssetId] Response structure:', {
        hasResults: Array.isArray(data.results),
        count: data.count,
        resultsLength: data.results?.length || 0,
        firstResultKeys: data.results?.[0] ? Object.keys(data.results[0]) : [],
      });
      
      if (data.results && data.results.length > 0) {
        console.log('[getRecitationTracksByAssetId] First track FULL object:');
        console.log(JSON.stringify(data.results[0], null, 2));
        console.log('[getRecitationTracksByAssetId] First track audio_url value:', data.results[0].audio_url);
        console.log('[getRecitationTracksByAssetId] First track audio_url type:', typeof data.results[0].audio_url);
        console.log('[getRecitationTracksByAssetId] First track audio_url length:', data.results[0].audio_url?.length || 0);
      } else {
        console.warn('[getRecitationTracksByAssetId] No tracks in response!');
      }

      // Map API response to RecitationItem
      return data.results.map((track): RecitationItem => {
        // Build title from surah_name and surah_number
        const title = track.surah_number 
          ? `${track.surah_number}. ${track.surah_name}`
          : track.surah_name || 'سورة';
        
        // Build surah info with revelation place and ayahs count
        const surahInfo = track.ayahs_count 
          ? `${track.ayahs_count} آية • ${track.revelation_place === 'Makkah' ? 'مكية' : 'مدنية'}`
          : undefined;

        // Use audio_url directly - it's already an absolute URL from the API
        const audioUrl = track.audio_url || '';
        
        // Log audio URL processing for debugging
        console.log(`[getRecitationTracksByAssetId] Track ${track.surah_number} (${track.surah_name}):`, {
          audio_url: track.audio_url,
          audioUrl,
          hasAudioUrl: !!audioUrl,
          audioUrlType: typeof audioUrl,
          audioUrlLength: audioUrl.length,
        });
        
        if (!audioUrl) {
          console.warn(`[getRecitationTracksByAssetId] Empty audio_url for track ${track.surah_number} (${track.surah_name}) - track will not be playable`);
        }

        const mappedItem: RecitationItem = {
          id: `track-${track.surah_number}`,
          title,
          reciterName: reciterName || 'غير معروف',
          duration: formatDuration(track.duration_ms),
          audioUrl: audioUrl, // Use the absolute URL directly from API
          image: reciterImage || '/images/reciters/reciter-default.jpg',
          surahInfo,
        };
        
        console.log(`[getRecitationTracksByAssetId] Mapped item for track ${track.surah_number}:`, {
          id: mappedItem.id,
          title: mappedItem.title,
          audioUrl: mappedItem.audioUrl,
          duration: mappedItem.duration,
          reciterName: mappedItem.reciterName,
          hasAudioUrl: !!mappedItem.audioUrl,
          audioUrlStartsWithHttp: mappedItem.audioUrl?.startsWith('http'),
        });
        
        return mappedItem;
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error(`[getRecitationTracksByAssetId] Request timeout for ${apiUrl}`);
        throw new Error(`API request timeout: ${apiUrl}`);
      }
      throw fetchError;
    }
  } catch (error) {
    const backendUrl = getBackendUrl();
    const apiUrl = `${backendUrl.replace(/\/$/, '')}/recitation-tracks/${assetId}/`;
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (isDevelopment) {
      console.warn(`[getRecitationTracksByAssetId] API unavailable (${apiUrl}), returning empty array`);
    } else {
      if (error instanceof Error) {
        console.error(`[getRecitationTracksByAssetId] Error fetching from ${apiUrl}:`, error.message);
      } else {
        console.error(`[getRecitationTracksByAssetId] Unknown error fetching from ${apiUrl}:`, error);
      }
    }
    
    return [];
  }
});

