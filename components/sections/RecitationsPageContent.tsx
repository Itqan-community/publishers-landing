'use client';

import React, { useMemo, useState } from 'react';
import { RecitationsTopSection } from '@/components/sections/RecitationsTopSection';
import { RecitationsListingSection } from '@/components/sections/RecitationsListingSection';
import type { RecordedMushaf } from '@/types/tenant.types';

interface RecitationsPageContentProps {
  mushafs: RecordedMushaf[];
  title: string;
  description: string;
}

export function RecitationsPageContent({
  mushafs,
  title,
  description,
}: RecitationsPageContentProps) {
  const [search, setSearch] = useState('');
  const [filterRiwaya, setFilterRiwaya] = useState('');

  const riwayaOptions = useMemo(() => {
    const set = new Set<string>();
    mushafs.forEach((m) => {
      m.badges?.forEach((b) => {
        if (b.label) set.add(b.label);
      });
    });
    return Array.from(set);
  }, [mushafs]);

  return (
    <>
      {/* Top section has a shared background that also shows behind the (desktop) transparent header */}
      <div className="relative bg-[#f6f6f4] -mt-16 lg:-mt-[72px] pt-16 lg:pt-[72px]">
        {/* Background image layer with diagonal fade (top-start -> bottom-end) */}
        <div
          className="pointer-events-none absolute inset-0 bg-[url('/images/hero-bg.svg')] bg-no-repeat bg-right-top bg-cover opacity-100 [mask-image:linear-gradient(to_bottom_left,#000_0%,#000_24%,transparent_88%)] [-webkit-mask-image:linear-gradient(to_bottom_left,#000_0%,#000_24%,transparent_88%)]"
          aria-hidden="true"
        />

        <RecitationsTopSection
          title={title}
          description={description}
          search={search}
          onSearchChange={setSearch}
          filterRiwaya={filterRiwaya}
          onFilterRiwayaChange={setFilterRiwaya}
          riwayaOptions={riwayaOptions}
        />
      </div>
      <RecitationsListingSection
        mushafs={mushafs}
        search={search}
        filterRiwaya={filterRiwaya}
      />
    </>
  );
}
