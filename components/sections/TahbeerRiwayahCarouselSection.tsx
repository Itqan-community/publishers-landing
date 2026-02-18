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
}

/**
 * Tahbeer riwayah listing block (Figma nodes 4024:367 / 4024:713).
 * Header: riwayah title (39px semibold) + reciter name (19px semibold) + reciter bio (19px light).
 * Carousel of TahbeerMushafCard (same pattern as RecordedMushafsSection).
 */
export const TahbeerRiwayahCarouselSection: React.FC<TahbeerRiwayahCarouselSectionProps> = ({
  id,
  riwayahTitle,
  reciterName,
  reciterBio,
  mushafs,
}) => {
  return (
    <section
      id={id}
      className={`py-10 sm:py-14 md:py-16 lg:py-20 bg-white ${id ? 'scroll-mt-20' : ''}`}
      dir="rtl"
    >
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Header: one row on large screens — title + (reciter name & bio), 120px gap on lg */}
        <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-[30px] flex flex-col gap-3 sm:gap-6 lg:flex-row lg:items-center lg:gap-[120px] text-start">
          <h2 className="text-[24px] sm:text-[28px] md:text-[33px] lg:text-[39px] font-semibold text-[var(--color-foreground)] leading-[1.4] shrink-0">
            {riwayahTitle}
          </h2>
          <div className="flex flex-col gap-0.5 min-w-0 lg:max-w-[515px]">
            <p className="text-[15px] sm:text-[17px] md:text-[19px] font-semibold text-[var(--color-foreground)]">
              {reciterName}
            </p>
            <p className="text-[15px] sm:text-[17px] md:text-[19px] font-light text-[var(--color-text-paragraph)] leading-[1.4]">
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
              <TahbeerMushafCard mushaf={mushaf} />
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
};
