'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { RecitationsTopSection } from '@/components/sections/RecitationsTopSection';
import { RecitationsListingSection } from '@/components/sections/RecitationsListingSection';
import { BouncingDots } from '@/components/ui/BouncingDots';
import type { RecordedMushaf } from '@/types/tenant.types';
import type { RiwayahOption } from '@/lib/riwayahs';

interface RecitationsPageContentProps {
  tenantId: string;
  mushafs: RecordedMushaf[];
  title: string;
  description: string;
  /** Riwaya dropdown options from API (GET /riwayahs/). */
  riwayaOptions: RiwayahOption[];
  /** Initial search from URL (source of truth). */
  search: string;
  /** Initial riwayah_id from URL (source of truth). */
  riwayahId: string;
}

export function RecitationsPageContent({
  tenantId,
  mushafs,
  title,
  description,
  riwayaOptions,
  search: searchFromUrl,
  riwayahId,
}: RecitationsPageContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [localSearch, setLocalSearch] = useState(searchFromUrl);

  useEffect(() => {
    setLocalSearch(searchFromUrl);
  }, [searchFromUrl]);

  const updateUrl = (updates: { search?: string; riwayah_id?: string }) => {
    const params = new URLSearchParams();
    const search = updates.search !== undefined ? updates.search : localSearch;
    const rid = updates.riwayah_id !== undefined ? updates.riwayah_id : riwayahId;
    if (search.trim()) params.set('search', search.trim());
    if (rid) params.set('riwayah_id', rid);
    const qs = params.toString();
    const href = qs ? `${pathname}?${qs}` : pathname;
    startTransition(() => {
      router.replace(href, { scroll: false });
    });
  };

  const onSearchSubmit = () => {
    updateUrl({ search: localSearch });
  };

  const onRiwayahChange = (newRiwayahId: string) => {
    updateUrl({ search: localSearch, riwayah_id: newRiwayahId });
  };

  return (
    <>
      {/* Loading overlay when filters trigger a new fetch (useTransition pending) */}
      {isPending && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-white/80 backdrop-blur-[2px]"
          aria-hidden={!isPending}
        >
          <BouncingDots className="scale-150" aria-label="جاري تحميل النتائج" />
        </div>
      )}

      {/* Top section has a shared background that also shows behind the (desktop) transparent header */}
      <div className="relative bg-[#f6f6f4] -mt-16 lg:-mt-[72px] pt-16 lg:pt-[72px]">
        <div
          className="pointer-events-none absolute inset-0 bg-[url('/images/hero-bg.svg')] bg-no-repeat bg-right-top bg-cover opacity-100 [mask-image:linear-gradient(to_bottom_left,#000_0%,#000_24%,transparent_88%)] [-webkit-mask-image:linear-gradient(to_bottom_left,#000_0%,#000_24%,transparent_88%)]"
          aria-hidden="true"
        />

        <RecitationsTopSection
          title={title}
          description={description}
          search={localSearch}
          onSearchChange={setLocalSearch}
          onSearchSubmit={onSearchSubmit}
          riwayahId={riwayahId}
          onRiwayahChange={onRiwayahChange}
          riwayaOptions={riwayaOptions}
        />
      </div>
      <RecitationsListingSection mushafs={mushafs} />
    </>
  );
}
