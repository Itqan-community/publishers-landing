'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/Button';
import { RecitationsPlayer } from '@/components/audio/AudioPlayer';
import type { RecitationItem } from '@/components/audio/AudioPlayer';
import { AvatarImage } from '@/components/ui/AvatarImage';
import { BouncingDots } from '@/components/ui/BouncingDots';
import { resolveImageUrl } from '@/lib/utils';
import {
  mapTracksApiToRecitationItems,
  type RecitationApiResponse,
  type TrackApiItem,
} from '@/lib/map-recitations-api';
import type { TenantConfig } from '@/types/tenant.types';

const API_HEADERS = { 'Accept': 'application/json', 'Accept-Language': 'ar' };

interface RecitationDetailClientProps {
  tenant: TenantConfig;
  tenantId: string;
  backendUrl: string;
  recitationId: string;
}

export function RecitationDetailClient({
  tenant,
  tenantId,
  backendUrl,
  recitationId,
}: RecitationDetailClientProps) {
  const [recitation, setRecitation] = useState<RecitationApiResponse | null>(null);
  const [reciterImage, setReciterImage] = useState<string>('');
  const [tracks, setTracks] = useState<RecitationItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const baseApi = backendUrl.replace(/\/$/, '');
      const recitationsUrl = `${baseApi}/recitations/?id=${encodeURIComponent(recitationId)}`;
      const headers: HeadersInit = { ...API_HEADERS, 'X-Tenant-Id': tenantId };

      try {
        const recitationsRes = await fetch(recitationsUrl, { headers });
        if (cancelled) return;
        if (!recitationsRes.ok) {
          setError(`Recitation: ${recitationsRes.status}`);
          return;
        }

        const recitationsData = await recitationsRes.json();
        // Use the passed backendUrl, no header needed

        let rec: RecitationApiResponse | null = null;
        if (Array.isArray(recitationsData.results) && recitationsData.results.length > 0) {
          rec = recitationsData.results.find(
            (r: RecitationApiResponse) => String(r.id) === String(recitationId)
          ) ?? recitationsData.results[0];
        } else if (recitationsData.id != null) {
          rec = recitationsData as RecitationApiResponse;
        }

        if (!rec) {
          setError('Not found');
          return;
        }

        setRecitation(rec);

        const reciterName = rec.reciter?.name || 'غير معروف';
        const resolvedImage =
          resolveImageUrl(rec.reciter?.image ?? rec.reciter?.avatar, baseApi) ?? '';
        setReciterImage(resolvedImage);
        const assetId = rec.id;

        const tracksUrl = `${baseApi}/recitation-tracks/${assetId}/`;
        const tracksRes = await fetch(tracksUrl, { headers });
        if (cancelled) return;
        if (!tracksRes.ok) {
          setTracks([]);
          return;
        }

        const tracksData = await tracksRes.json();
        const trackResults: TrackApiItem[] = Array.isArray(tracksData.results)
          ? tracksData.results
          : [];
        const mapped = mapTracksApiToRecitationItems(
          trackResults,
          reciterName,
          resolvedImage
        ).map((t) => ({ ...t, reciterName, image: resolvedImage })) as RecitationItem[];

        setTracks(mapped);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load');
      }
    }

    load();
    return () => { cancelled = true; };
  }, [tenantId, recitationId]);

  if (error) {
    return (
      <PageLayout tenant={tenant}>
        <div className="py-12 text-center text-[18px] text-red-600" dir="rtl">
          {error === 'Not found' ? 'غير موجود' : error}
        </div>
      </PageLayout>
    );
  }

  if (!recitation) {
    return (
      <PageLayout tenant={tenant}>
        <div className="flex min-h-[50vh] items-center justify-center" aria-label="جاري التحميل">
          <BouncingDots className="scale-150" />
        </div>
      </PageLayout>
    );
  }

  const reciterName = recitation.reciter?.name || 'غير معروف';

  return (
    <PageLayout tenant={tenant}>
      <div dir="rtl" className="bg-white">
        <div className="mx-auto max-w-[1200px] px-4 pb-16 pt-10 sm:px-6 lg:px-8">
          <section className="relative overflow-hidden rounded-[14px] border border-[#ebe8e8] bg-[#f6f6f4] px-6 py-6 shadow-sm">
            <div
              className="pointer-events-none absolute inset-0 bg-[url('/images/hero-bg.svg')] bg-no-repeat bg-right-top bg-cover opacity-100 [mask-image:linear-gradient(to_bottom_left,#000_0%,#000_24%,transparent_88%)] [-webkit-mask-image:linear-gradient(to_bottom_left,#000_0%,#000_24%,transparent_88%)]"
              aria-hidden
            />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-12">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
                <div className="relative h-[179px] w-[179px] shrink-0 overflow-hidden rounded-[24px] bg-white">
                  <AvatarImage
                    src={reciterImage || tracks[0]?.image}
                    alt={`صورة ${reciterName}`}
                    fill
                    className="object-cover"
                    priority
                    iconSize="h-24 w-24"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col items-start gap-6 justify-between h-full">
                  <div className="text-start">
                    <h1 className="text-[28px] font-semibold leading-tight text-black">
                      {reciterName}
                    </h1>
                    <p className="mt-2 text-[18px] leading-snug text-[#6a6a6a]">
                      {recitation.name || 'مصحف مرتل'}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    {recitation.riwayah?.name && (
                      <span className="rounded-[4px] bg-white px-[12px] py-[8px] text-[12px] font-[500] text-[#1f2a37]">
                        رواية {recitation.riwayah.name}
                      </span>
                    )}
                    {recitation.madd_level && (
                      <span className="rounded-[4px] bg-white px-[12px] py-[8px] text-[12px] font-[500] text-[#1f2a37]">
                        {recitation.madd_level === 'tawassut' ? 'التوسط' : recitation.madd_level === 'qasr' ? 'قصر' : recitation.madd_level}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-between gap-6 mt-auto items-start lg:items-end">
                <div className="flex flex-wrap items-center gap-3">
                  <Link href="https://api.cms.itqan.dev/docs/" target="_blank">
                    <Button
                      variant="secondary"
                      className="gap-2 bg-[#0d121c] text-white hover:bg-[#0a0f17]"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0" aria-hidden>
                        <g clipPath="url(#api-code-icon-clip)">
                          <path d="M17 8L18.8398 9.85008C19.6133 10.6279 20 11.0168 20 11.5C20 11.9832 19.6133 12.3721 18.8398 13.1499L17 15" stroke="#FAAF41" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M7 8L5.16019 9.85008C4.38673 10.6279 4 11.0168 4 11.5C4 11.9832 4.38673 12.3721 5.16019 13.1499L7 15" stroke="#FAAF41" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M14.5 4L9.5 20" stroke="#FAAF41" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                        <defs>
                          <clipPath id="api-code-icon-clip">
                            <rect width="24" height="24" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      API
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-10">
            <RecitationsPlayer
              recitations={tracks}
              defaultSelected={tracks[0]?.id}
              variant="details"
              listTitle="قائمة السور"
            />
          </section>
        </div>
      </div>
    </PageLayout>
  );
}
