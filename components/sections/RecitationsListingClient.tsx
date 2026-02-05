'use client';

import React, { useEffect, useState } from 'react';
import { RecitationsPageContent } from '@/components/sections/RecitationsPageContent';
import { BouncingDots } from '@/components/ui/BouncingDots';
import type { RecordedMushaf } from '@/types/tenant.types';
import { LISTING_RIWAYAH_ID, type RiwayahOption } from '@/lib/listing-riwayah';
import {
  mapRecitationsApiToRecordedMushafs,
  type RecitationApiResponse,
} from '@/lib/map-recitations-api';

const API_HEADERS = {
  'Accept': 'application/json',
  'Accept-Language': 'ar',
};

interface RiwayahApiItem {
  id: number;
  name: string;
  recitations_count: number;
}

function mapRiwayahs(results: RiwayahApiItem[]): RiwayahOption[] {
  const list = Array.isArray(results) ? results : [];
  return list.map((r) => ({ id: r.id, label: `رواية ${r.name}` }));
}

interface RecitationsListingClientProps {
  tenantId: string;
  basePath: string;
  backendUrl: string;
  search: string;
  riwayahId: string;
  title: string;
  description: string;
}

export function RecitationsListingClient({
  tenantId,
  basePath,
  backendUrl,
  search,
  riwayahId,
  title,
  description,
}: RecitationsListingClientProps) {
  const [mushafs, setMushafs] = useState<RecordedMushaf[] | null>(null);
  const [riwayaOptions, setRiwayaOptions] = useState<RiwayahOption[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    // Clear list immediately when search/filter change so we show loading instead of stale data
    setMushafs(null);

    // basePath can be '' (custom domain) or '/tenant-id' (path-based)
    // Only fallback to /tenantId if basePath is undefined
    const pathPrefix = basePath !== undefined ? basePath : `/${tenantId}`;

    async function load() {
      // Direct backend call
      const recitationsParams = new URLSearchParams({ page: '1', page_size: '100' });
      if (search) recitationsParams.set('search', search);
      if (riwayahId) recitationsParams.set('riwayah_id', riwayahId);

      const recitationsUrl = `${backendUrl}/recitations/?${recitationsParams.toString()}`;
      const riwayahsUrl = `${backendUrl}/riwayahs/`;

      const headers: HeadersInit = {
        ...API_HEADERS,
      };

      try {
        const [recitationsRes, riwayahsRes] = await Promise.all([
          fetch(recitationsUrl, { headers }),
          fetch(riwayahsUrl, { headers }),
        ]);

        if (cancelled) return;

        if (!recitationsRes.ok) {
          setError(`Recitations: ${recitationsRes.status}`);
          return;
        }
        if (!riwayahsRes.ok) {
          setError(`Riwayahs: ${riwayahsRes.status}`);
          return;
        }

        const recitationsData = await recitationsRes.json();
        const riwayahsData = await riwayahsRes.json();

        // For direct calls, the backendUrl is what we used
        const results: RecitationApiResponse[] = Array.isArray(recitationsData.results)
          ? recitationsData.results
          : [];

        const mappedMushafs = mapRecitationsApiToRecordedMushafs(results, backendUrl, pathPrefix);
        const allRiwayahs = mapRiwayahs(riwayahsData.results ?? []);
        // Forced for now: only show riwayah ID 1 in listing filter
        const mappedRiwayahs = allRiwayahs.filter((o) => o.id === LISTING_RIWAYAH_ID);

        setMushafs(mappedMushafs);
        setRiwayaOptions(mappedRiwayahs);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load');
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [tenantId, basePath, backendUrl, search, riwayahId]);

  if (error) {
    return (
      <div className="py-12 text-center text-[18px] text-red-600" dir="rtl">
        {error}
      </div>
    );
  }

  if (mushafs === null || riwayaOptions === null) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center" aria-label="جاري التحميل">
        <BouncingDots className="scale-150" />
      </div>
    );
  }

  return (
    <RecitationsPageContent
      tenantId={tenantId}
      mushafs={mushafs}
      title={title}
      description={description}
      riwayaOptions={riwayaOptions}
      search={search}
      riwayahId={riwayahId}
    />
  );
}
