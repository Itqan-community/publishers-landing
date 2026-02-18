import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { RecordedMushaf } from '@/types/tenant.types';

const TAHBEER_MUSHAF_ICON = '/icons/big-mushaf-tahbeer.svg';

export interface TahbeerMushafCardProps {
  mushaf: RecordedMushaf;
}

/**
 * Tahbeer recitation/mushaf card per Figma (Ta7beer – Copy, node 4024:721).
 * Light beige palette, large brownish icon, title + description + small 32px CTA.
 * Used only for tenant tahbeer; Saudi Center keeps MushafCard.
 */
export const TahbeerMushafCard: React.FC<TahbeerMushafCardProps> = ({ mushaf }) => {
  const { title, description, href } = mushaf;

  return (
    <article
      className="flex w-full flex-col overflow-hidden rounded-[12px] border border-[#ebe8e8] bg-[#FDFDFC] text-right"
      dir="rtl"
    >
      {/* Top section – large brownish icon on light beige (#F9F5F3) */}
      <div className="flex min-h-[200px] flex-shrink-0 items-center justify-center rounded-t-[12px] bg-[#F9F5F3] py-8">
        <div className="relative h-[140px] w-[136px]" aria-hidden="true">
          <Image
            src={TAHBEER_MUSHAF_ICON}
            alt=""
            fill
            className="object-contain"
            sizes="140px"
            aria-hidden
          />
        </div>
      </div>
      {/* Bottom section – content (white) */}
      <div className="flex flex-1 flex-col gap-2 bg-white px-4 py-4">
        <h3 className="text-[20px] font-semibold leading-snug text-[#000000]">
          {title}
        </h3>
        <p className="line-clamp-3 text-[13px] font-normal leading-[20px] text-[#7B7B7B]">
          {description}
        </p>
        <div className="mt-2">
          <Link
            href={href}
            className="inline-flex h-8 items-center justify-center rounded-[6px] bg-[#B58A65] px-4 text-sm font-medium text-white hover:bg-[#9e7957] focus:outline-none focus:ring-2 focus:ring-[#B58A65] focus:ring-offset-2"
          >
            تصفح المصحف
          </Link>
        </div>
      </div>
    </article>
  );
};
