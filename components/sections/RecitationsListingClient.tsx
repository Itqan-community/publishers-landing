'use client';

import React, { useEffect, useState } from 'react';
import { RecitationsPageContent } from '@/components/sections/RecitationsPageContent';
import { BouncingDots } from '@/components/ui/BouncingDots';
import type { RecordedMushaf } from '@/types/tenant.types';
import type { RiwayahOption } from '@/lib/riwayahs';
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
    const pathPrefix = basePath || `/${tenantId}`;

    async function load() {
      // Direct backend call
      const baseApi = backendUrl.replace(/\/$/, '');
      const recitationsParams = new URLSearchParams({ page: '1', page_size: '100' });
      if (search) recitationsParams.set('search', search);
      if (riwayahId) recitationsParams.set('riwayah_id', riwayahId);

      const recitationsUrl = `${baseApi}/recitations/?${recitationsParams.toString()}`;
      const riwayahsUrl = `${baseApi}/riwayahs/`;

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

        const mappedMushafs = mapRecitationsApiToRecordedMushafs(results, baseApi, pathPrefix);
        const mappedRiwayahs = mapRiwayahs(riwayahsData.results ?? []);

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
