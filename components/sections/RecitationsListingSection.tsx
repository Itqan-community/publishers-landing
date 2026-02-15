'use client';

import React, { useEffect, useState } from 'react';
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
  /** Mushafs already filtered by backend (search + riwayah_id). */
  mushafs: RecordedMushaf[];
}

export const RecitationsListingSection: React.FC<RecitationsListingSectionProps> = ({
  mushafs,
}) => {
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setDisplayCount(PAGE_SIZE);
  }, [mushafs]);

  const visible = mushafs.slice(0, displayCount);
  const hasMore = displayCount < mushafs.length;

  const loadMore = () => {
    setDisplayCount((c) => Math.min(c + PAGE_SIZE, mushafs.length));
  };

  return (
    <section className="bg-white pt-10 pb-16 md:pt-12 md:pb-20" dir="rtl">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((mushaf) => (
            <MushafCard key={mushaf.id} mushaf={mushaf} />
          ))}
        </div>

        {mushafs.length === 0 && (
          <p className="py-12 text-center text-lg text-[#6a6a6a]">
            لم يتم العثور على مصاحف تطابق البحث.
          </p>
        )}

        {hasMore && mushafs.length > 0 && (
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={loadMore}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#193624] px-6 text-md font-medium text-white hover:bg-[#102516] focus:outline-none focus:ring-2 focus:ring-[#193624] focus:ring-offset-2"
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
