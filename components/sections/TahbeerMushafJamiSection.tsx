import React from 'react';
import { TahbeerMushafCard } from '@/components/cards/TahbeerMushafCard';
import type { MushafCardAppearance } from '@/components/cards/TahbeerMushafCard';
import type { RecordedMushaf } from '@/types/tenant.types';

export type MushafJamiAppearance = 'default' | 'qiraat-archive';

export interface TahbeerMushafJamiSectionProps {
  id?: string;
  /** Qiraah name after «لقراءة» in the title (full API string). */
  qiraahName: string;
  mushaf: RecordedMushaf;
  mushafAppearance?: MushafCardAppearance;
  /** `qiraat-archive` = paper band + verdigris badge. Default = Tahbeer warm/mint. */
  appearance?: MushafJamiAppearance;
}

/**
 * Tahbeer qiraah page — مصحف الجمع (single combined mushaf, not a carousel).
 * Redesigned to match the page's section language: full-width, warm bg, consistent title sizing.
 */
export const TahbeerMushafJamiSection: React.FC<TahbeerMushafJamiSectionProps> = ({
  id = 'mushaf-jami',
  qiraahName,
  mushaf,
  mushafAppearance = 'green',
  appearance = 'default',
}) => {
  const isArchive = appearance === 'qiraat-archive';

  return (
    <section
      id={id}
      className={`py-10 sm:py-14 md:py-16 lg:py-20 ${
        isArchive ? 'bg-[var(--color-paper,#E6E2D8)]' : 'bg-[#F9F5F3]'
      } ${id ? 'scroll-mt-20' : ''}`}
      dir="rtl"
    >
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8 sm:gap-10 md:gap-12 lg:flex-row lg:items-start lg:gap-x-[80px]">
          <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-start lg:pt-6">
            <span
              className={
                isArchive
                  ? 'mb-3 inline-flex items-center gap-2 rounded-[8px] bg-[var(--about-icon-bg,#DDE8E4)] px-4 py-1.5 text-[14px] font-medium text-[var(--color-primary)]'
                  : 'mb-3 inline-flex items-center gap-2 rounded-full bg-[#EEF9F2] px-4 py-1.5 text-[14px] font-medium text-[#193624]'
              }
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  fill={isArchive ? 'var(--color-primary)' : '#193624'}
                  opacity="0.2"
                  stroke={isArchive ? 'var(--color-primary)' : '#193624'}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              مصحف الجمع
            </span>

            <h2 className="text-[24px] font-semibold leading-[1.4] text-[var(--color-foreground)] sm:text-[28px] md:text-[33px] lg:text-[39px]">
              مصحف الجمع لقراءة {qiraahName}
            </h2>
            {isArchive && (
              <div
                className="mt-3 h-px w-[64px] bg-[var(--color-rule-gold,#A68B4B)] opacity-60 lg:ms-0"
                aria-hidden="true"
              />
            )}

            <p className="mt-3 max-w-[520px] text-[15px] font-light leading-[1.7] text-[var(--color-text-paragraph)] sm:text-[17px] md:text-[19px]">
              يجمع هذا المصحف جميع أوجه الروايات في تسجيل واحد شامل، ليُمكّن المستمع من الاستماع لكافة الطرق المتواترة عن الإمام في مصحف واحد.
            </p>
          </div>

          <div className="w-full max-w-[300px] shrink-0 sm:max-w-[320px]">
            <TahbeerMushafCard mushaf={mushaf} appearance={mushafAppearance} />
          </div>
        </div>
      </div>
    </section>
  );
};
