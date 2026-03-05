import React from 'react';

export interface TahbeerRiwayahInfo {
  id: number;
  name: string;
  bio?: string;
}

export interface TahbeerRiwayahsSectionProps {
  id?: string;
  qiraahName: string;
  riwayahs: TahbeerRiwayahInfo[];
}

/**
 * Section showing the two riwayahs (narrators) of a qiraah.
 * Title: راوياه, Description: راويا قراءة &lt;qiraah name&gt;, 2 cards with الإمام &lt;first word&gt; + bio.
 */
export const TahbeerRiwayahsSection: React.FC<TahbeerRiwayahsSectionProps> = ({
  id = 'riwayahs',
  qiraahName,
  riwayahs,
}) => {
  return (
    <section
      id={id}
      className={`py-10 sm:py-14 md:py-16 lg:py-20 bg-white ${id ? 'scroll-mt-20' : ''}`}
      dir="rtl"
    >
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Title + description — centered */}
        <div className="flex flex-col gap-4 items-center text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-[28px] sm:text-[33px] lg:text-[39px] font-semibold text-[var(--color-foreground)] leading-tight">
            راوياه
          </h2>
          <p className="text-[16px] sm:text-[18px] lg:text-[20px] text-[var(--color-text-paragraph)] leading-relaxed text-justify">
            راويا قراءة {qiraahName}
          </p>
        </div>

        {/* 2 cards in a row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {riwayahs.map((riwayah) => {
            const firstWord = riwayah.name.trim().split(/\s+/)[0] ?? riwayah.name;
            return (
              <div
                key={riwayah.id}
                className="rounded-[16px] sm:rounded-[20px] border border-[#e7e7e7] bg-white p-6 sm:p-8 shadow-[0px_14px_44px_rgba(0,0,0,0.07)] text-start"
              >
                <h3 className="text-[20px] sm:text-[22px] font-semibold text-[var(--color-foreground)] leading-tight mb-4">
                  الإمام {firstWord}
                </h3>
                <p className="text-[15px] sm:text-[17px] leading-relaxed text-[var(--color-text-paragraph)] whitespace-pre-line text-justify">
                  {riwayah.bio || ''}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
