import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { RecordedMushaf } from '@/types/tenant.types';

const TAHBEER_MUSHAF_ICON = '/icons/big-mushaf-tahbeer.svg';
/** Saudi listing asset — green strokes (#193624); used only with `appearance="green"`. */
const GREEN_MUSHAF_ICON = '/icons/big-mushaf.svg';

export interface TahbeerMushafCardProps {
  mushaf: RecordedMushaf;
  /**
   * `green` — same Tahbeer card; mint top band + green mushaf icon (`big-mushaf.svg`) (مصحف الجمع).
   */
  appearance?: 'default' | 'green';
}

/**
 * Tahbeer recitation/mushaf card per Figma (Ta7beer – Copy, node 4024:721).
 * Light beige palette, large brownish icon, title + description + small 32px CTA.
 * Used only for tenant tahbeer; Saudi Center keeps MushafCard.
 */
export const TahbeerMushafCard: React.FC<TahbeerMushafCardProps> = ({
  mushaf,
  appearance = 'default',
}) => {
  const { title, href } = mushaf;
  const isGreen = appearance === 'green';

  return (
    <article
      className={`flex h-[stretch] w-full flex-col overflow-hidden rounded-[12px] border bg-[#FDFDFC] text-right ${
        isGreen ? 'border-[#cfe8d8]' : 'border-[#ebe8e8]'
      }`}
      dir="rtl"
    >
      <div
        className={`flex min-h-[200px] shrink-0 items-center justify-center rounded-t-[12px] py-8 ${
          isGreen ? 'bg-[#EEF9F2]' : 'bg-[#F9F5F3]'
        }`}
      >
        <div className="relative h-[140px] w-[136px] -scale-x-100" aria-hidden="true">
          <Image
            src={isGreen ? GREEN_MUSHAF_ICON : TAHBEER_MUSHAF_ICON}
            alt=""
            fill
            className="object-contain"
            sizes="140px"
            aria-hidden
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 bg-white px-4 py-4">
        <h3 className="mb-2 text-[20px] font-medium leading-snug text-[#000000]">{title}</h3>
        <div className="mt-auto">
          <Link
            href={href}
            className={
              isGreen
                ? 'inline-flex h-8 items-center justify-center rounded-[6px] bg-[#193624] px-4 text-sm font-medium text-white hover:bg-[#234d36] focus:outline-none focus:ring-2 focus:ring-[#193624] focus:ring-offset-2'
                : 'inline-flex h-8 items-center justify-center rounded-[6px] bg-[#B58A65] px-4 text-sm font-medium text-white hover:bg-[#9e7957] focus:outline-none focus:ring-2 focus:ring-[#B58A65] focus:ring-offset-2'
            }
          >
            تصفح المصحف
          </Link>
        </div>
      </div>
    </article>
  );
};
