'use client';

import React from 'react';
import { Carousel } from '@/components/ui/Carousel';
import { TahbeerMushafCard } from '@/components/cards/TahbeerMushafCard';
import type { RecordedMushaf } from '@/types/tenant.types';

export interface TahbeerRiwayahCarouselSectionProps {
  id?: string;
  riwayahTitle: string;
  reciterName: string;
  reciterBio: string;
  mushafs: RecordedMushaf[];
  mushafAppearance?: 'default' | 'green';
}

/**
 * Tahbeer riwayah listing block (Figma nodes 4024:367 / 4024:713).
 * Header: riwayah title (39px semibold) + reciter name (19px semibold) + reciter bio (19px light).
 * Carousel of TahbeerMushafCard (same pattern as RecordedMushafsSection).
 */
export const TahbeerRiwayahCarouselSection: React.FC<TahbeerRiwayahCarouselSectionProps> = ({
  id,
  riwayahTitle,
  reciterName: _reciterName,
  reciterBio,
  mushafs,
  mushafAppearance = 'default',
}) => {
  return (
    <section
      id={id}
      className={`py-10 sm:py-14 md:py-16 lg:py-20 bg-white ${id ? 'scroll-mt-20' : ''}`}
      dir="rtl"
    >
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Mobile: stacked; lg+: title + description on one row (≈120px gap) */}
        <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-[30px] flex flex-col gap-4 text-start lg:flex-row lg:items-start lg:gap-x-[120px]">
          <h2 className="shrink-0 text-[24px] font-semibold leading-[1.4] text-[var(--color-foreground)] sm:text-[28px] md:text-[33px] lg:text-[39px]">
            {riwayahTitle}
          </h2>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <p className="text-[15px] font-light leading-[1.4] text-[var(--color-text-paragraph)] text-justify sm:text-[17px] md:text-[19px]">
              {reciterBio}
            </p>
          </div>
        </div>

        {/* Carousel of TahbeerMushafCard — same as RecordedMushafsSection */}
        <Carousel slidesToScroll={1} loop={true} showArrows={false} showDots={true}>
          {mushafs.map((mushaf) => (
            <div
              key={mushaf.id}
              className="flex-[0_0_100%] sm:flex-[0_0_284px]"
            >
              <TahbeerMushafCard mushaf={mushaf} appearance={mushafAppearance} />
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
};
