'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { MushafCard } from '@/components/cards/MushafCard';
import type { RecordedMushaf } from '@/types/tenant.types';

const PAGE_SIZE = 12;

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 2l1.6 6.1L20 10l-6.4 1.9L12 18l-1.6-6.1L4 10l6.4-1.9L12 2z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface RecitationsListingSectionProps {
  mushafs: RecordedMushaf[];
  search: string;
  filterRiwaya: string;
}

export const RecitationsListingSection: React.FC<RecitationsListingSectionProps> = ({
  mushafs,
  search,
  filterRiwaya,
}) => {
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setDisplayCount(PAGE_SIZE);
  }, [search, filterRiwaya]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return mushafs.filter((m) => {
      const matchSearch =
        !q ||
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.reciter.name.toLowerCase().includes(q);
      const matchRiwaya =
        !filterRiwaya || m.badges?.some((b) => b.label === filterRiwaya);
      return matchSearch && matchRiwaya;
    });
  }, [mushafs, search, filterRiwaya]);

  const visible = filtered.slice(0, displayCount);
  const hasMore = displayCount < filtered.length;

  const loadMore = () => {
    setDisplayCount((c) => Math.min(c + PAGE_SIZE, filtered.length));
  };

  return (
    <section className="bg-white pt-10 pb-16 md:pt-12 md:pb-20" dir="rtl">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((mushaf) => (
            <MushafCard key={mushaf.id} mushaf={mushaf} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="py-12 text-center text-[18px] text-[#6a6a6a]">
            لم يتم العثور على مصاحف تطابق البحث.
          </p>
        )}

        {hasMore && filtered.length > 0 && (
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={loadMore}
              className="inline-flex h-[48px] items-center justify-center gap-2 rounded-[10px] bg-[#193624] px-6 text-[16px] font-medium text-white hover:bg-[#102516] focus:outline-none focus:ring-2 focus:ring-[#193624] focus:ring-offset-2"
            >
              <SparkleIcon className="h-5 w-5 text-white" />
              عرض المزيد
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
