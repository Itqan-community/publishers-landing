import React from 'react';
import { TahbeerMushafCard } from '@/components/cards/TahbeerMushafCard';
import type { RecordedMushaf } from '@/types/tenant.types';

export interface TahbeerMushafJamiSectionProps {
  id?: string;
  /** Qiraah name after «لقراءة» in the title (full API string). */
  qiraahName: string;
  mushaf: RecordedMushaf;
}

/**
 * Tahbeer qiraah page — مصحف الجمع (single combined mushaf, not a carousel).
 */
export const TahbeerMushafJamiSection: React.FC<TahbeerMushafJamiSectionProps> = ({
  id = 'mushaf-jami',
  qiraahName,
  mushaf,
}) => {
  return (
    <section
      id={id}
      className={`px-4 sm:px-6 ${id ? 'scroll-mt-20' : ''}`}
      dir="rtl"
    >
      <div
        className="relative mx-auto my-12 w-full max-w-full overflow-hidden rounded-[40px] border border-[#e5dfd7] pt-8 px-8 pb-[calc(2rem+16px)] shadow-[2px_2px_20px_rgba(0,0,0,0.031)] sm:w-max sm:max-w-max [corner-shape:superellipse(1)]"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[url('/images/hero-bg.svg')] bg-right-top bg-cover bg-no-repeat opacity-100 [mask-image:linear-gradient(to_bottom_left,#000_0%,#000_24%,transparent_88%)] [-webkit-mask-image:linear-gradient(to_bottom_left,#000_0%,#000_24%,transparent_88%)]"
          aria-hidden
        />
        <div className="relative z-10 flex w-full max-w-[720px] flex-col items-center gap-6 sm:gap-8 md:gap-10">
          <h2 className="rounded-[16px] bg-white p-[14px] text-center text-[30px] font-semibold leading-[1.4] text-[var(--color-foreground)]">
            مصحف الجمع لقراءة {qiraahName}
          </h2>
          <div className="w-full max-w-[360px] sm:max-w-[380px]">
            <TahbeerMushafCard mushaf={mushaf} appearance="green" />
          </div>
        </div>
      </div>
    </section>
  );
};
