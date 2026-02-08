'use client';

import React, { useEffect, useState } from 'react';
import { RecordedMushafsSection } from '@/components/sections/RecordedMushafsSection';
import { FeaturedRecitationsSection } from '@/components/sections/FeaturedRecitationsSection';
import { BouncingDots } from '@/components/ui/BouncingDots';
import type { RecordedMushaf } from '@/types/tenant.types';
import type { RecitationItem } from '@/components/audio/AudioPlayer';
import { resolveImageUrl } from '@/lib/utils';
import {
  mapRecitationsApiToRecordedMushafs,
  mapTracksApiToRecitationItems,
  type RecitationApiResponse,
  type TrackApiItem,
} from '@/lib/map-recitations-api';

const FEATURED_LIMIT = 5;

interface RecordedMushafsSectionClientProps {
  tenantId: string;
  basePath: string;
  backendUrl: string;
  tenantDomain: string; // NEW: For X-Tenant header authentication
  recordedTitle: string;
  recordedDescription: string;
  viewAllHref: string;
  featuredTitle: string;
  featuredDescription: string;
}

export function RecordedMushafsSectionClient({
  tenantId,
  basePath,
  backendUrl,
  tenantDomain,
  recordedTitle,
  recordedDescription,
  viewAllHref,
  featuredTitle,
  featuredDescription,
}: RecordedMushafsSectionClientProps) {
  const [mushafs, setMushafs] = useState<RecordedMushaf[] | null>(null);
  const [featuredTracks, setFeaturedTracks] = useState<RecitationItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const pathPrefix = basePath || `/${tenantId}`;
    const base = backendUrl.replace(/\/$/, '');

    async function load() {
      const recitationsUrl = `${base}/recitations/?page=1&page_size=100`;

      // Include X-Tenant header for backend authentication
      const headers: HeadersInit = {
        'Accept': 'application/json',
        'Accept-Language': 'ar',
        'X-Tenant': tenantDomain,
      };

      try {
        const recitationsRes = await fetch(recitationsUrl, {
          headers,
        });

        if (cancelled) return;
        if (!recitationsRes.ok) {
          setError(`Recitations: ${recitationsRes.status}`);
          return;
        }

        const recitationsData = await recitationsRes.json();
        const results: RecitationApiResponse[] = Array.isArray(recitationsData.results)
          ? recitationsData.results
          : [];
        const mappedMushafs = mapRecitationsApiToRecordedMushafs(results, base, pathPrefix);
        setMushafs(mappedMushafs);

        const firstId = mappedMushafs[0]?.id;
        if (!firstId) {
          setFeaturedTracks([]);
          return;
        }

        const firstRecitation = results[0];
        const reciterName = firstRecitation?.reciter?.name || 'غير معروف';
        const reciterImage =
          resolveImageUrl(
            firstRecitation?.reciter?.image ?? firstRecitation?.reciter?.avatar,
            base
          ) ?? '';

        const tracksUrl = `${base}/recitation-tracks/${firstId}/`;
        const tracksRes = await fetch(tracksUrl, { headers });
        if (cancelled) return;

        if (!tracksRes.ok) {
          setFeaturedTracks([]);
          return;
        }

        const tracksData = await tracksRes.json();
        const trackResults: TrackApiItem[] = Array.isArray(tracksData.results)
          ? tracksData.results
          : [];
        const mapped = mapTracksApiToRecitationItems(
          trackResults,
          reciterName,
          reciterImage
        ).map((t) => ({ ...t, reciterName, image: reciterImage })) as RecitationItem[];
        setFeaturedTracks(mapped.slice(0, FEATURED_LIMIT));
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load');
      }
    }

    load();
    return () => { cancelled = true; };
  }, [tenantId, basePath, backendUrl, tenantDomain]);

  if (error) {
    return (
      <div className="py-12 text-center text-[18px] text-red-600" dir="rtl">
        {error}
      </div>
    );
  }

  if (mushafs === null) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center py-20" aria-label="جاري التحميل">
        <BouncingDots className="scale-150" />
      </div>
    );
  }

  return (
    <>
      <RecordedMushafsSection
        id="recorded-mushafs"
        title={recordedTitle}
        description={recordedDescription}
        mushafs={mushafs}
        viewAllHref={viewAllHref}
      />
      <FeaturedRecitationsSection
        title={featuredTitle}
        description={featuredDescription}
        recitations={featuredTracks}
        viewAllHref={viewAllHref}
        detailsHrefBase={basePath || `/${tenantId}`}
      />
    </>
  );
}
