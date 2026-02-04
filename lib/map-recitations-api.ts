/**
 * Pure mapping from backend API shapes to UI types.
 * Safe to import from client (no server-only deps).
 */

import type { RecordedMushaf } from '@/types/tenant.types';
import { resolveImageUrl } from '@/lib/utils';

/** Matches RecitationItem from components/audio/AudioPlayer */
export interface RecitationItemMap {
  id: string;
  title: string;
  reciterName: string;
  duration: string;
  audioUrl: string;
  image?: string;
  surahInfo?: string;
}

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

export interface TrackApiItem {
  surah_number: number;
  surah_name: string;
  surah_name_en?: string;
  audio_url?: string;
  duration_ms: number;
  revelation_place?: 'Makkah' | 'Madinah';
  ayahs_count?: number;
}

export function mapTracksApiToRecitationItems(
  results: TrackApiItem[],
  reciterName: string,
  reciterImage: string
): RecitationItemMap[] {
  const list = Array.isArray(results) ? results : [];
  return list.map((track) => {
    const title =
      track.surah_name && track.surah_name.trim() !== ''
        ? track.surah_name
        : track.surah_name_en || 'سورة';
    const surahInfo =
      track.ayahs_count && track.revelation_place
        ? `${track.ayahs_count} آية • ${track.revelation_place === 'Makkah' ? 'مكية' : 'مدنية'}`
        : undefined;
    return {
      id: `track-${track.surah_number}`,
      title,
      reciterName: reciterName || 'غير معروف',
      duration: formatDuration(track.duration_ms),
      audioUrl: (track.audio_url || '').trim(),
      image: reciterImage || '',
      surahInfo,
    };
  });
}

export interface RecitationApiResponse {
  id: number;
  name: string;
  description?: string;
  reciter: {
    id: number;
    name: string;
    image?: string;
    avatar?: string;
  };
  riwayah: { id: number; name: string };
  surahs_count: number;
  madd_level?: 'qasr' | 'tawassut' | null;
  year?: number | null;
}

const OUTLINE_PALETTE = ['#2563eb', '#059669', '#7c3aed', '#dc2626', '#db2777'];

export function mapRecitationsApiToRecordedMushafs(
  results: RecitationApiResponse[],
  backendUrl: string,
  pathPrefix: string
): RecordedMushaf[] {
  const list = Array.isArray(results) ? results : [];
  return list.map((recitation, i): RecordedMushaf => {
    const badges: RecordedMushaf['badges'] = [];
    if (recitation.riwayah?.name) {
      badges.push({
        id: `riwayah-${recitation.riwayah.id}`,
        label: `رواية ${recitation.riwayah.name}`,
        icon: 'book',
        tone: 'green',
      });
    }
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
    const description = recitation.reciter?.name
      ? `المصحف المرتل ل${recitation.reciter.name}`
      : 'المصحف المرتل';
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
      href: `${pathPrefix}/recitations/${recitation.id}`,
    };
  });
}
