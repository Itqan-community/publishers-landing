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
      <RecitationsTopSection
        title={title}
        description={description}
        search={search}
        onSearchChange={setSearch}
        filterRiwaya={filterRiwaya}
        onFilterRiwayaChange={setFilterRiwaya}
        riwayaOptions={riwayaOptions}
      />
      <RecitationsListingSection
        mushafs={mushafs}
        search={search}
        filterRiwaya={filterRiwaya}
      />
    </>
  );
}
