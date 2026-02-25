/**
 * Ten Readings Section — Tahbeer (تحبير)
 * From Figma: "القراءات العشر ورواتها" — grid of 10 qira'at cards with riwayats
 * Card design: Figma node 4019-14699 — large rounded card, brown border, circle with number (top right), centered title/subtitle/underlined link
 */

'use client';

import React from 'react';
import Link from 'next/link';

export interface TenReadingsItem {
  id: string;
  number: number;
  title: string;
  riwayats: string;
  viewMushafHref?: string;
}

const defaultTitleClass = 'text-display-xs sm:text-display-sm md:text-display-lg font-semibold text-[var(--color-foreground)] leading-tight section-title-gap';

/** Arabic numerals ١…٩ for 1–9, ١٠ for 10 (Figma card design) */
function toArabicNumeral(n: number): string {
  if (n >= 1 && n <= 9) return String.fromCharCode(0x0660 + n);
  if (n === 10) return '\u0661\u0660';
  return String(n);
}

interface TenReadingsSectionProps {
  id?: string;
  title: string;
  description?: string;
  items: TenReadingsItem[];
  viewAllHref?: string;
  basePath?: string;
  /** Optional class for the section title (e.g. Tahbeer: 39px font-semibold). */
  titleClassName?: string;
}

export const TenReadingsSection: React.FC<TenReadingsSectionProps> = ({
  id,
  title,
  description,
  items,
  viewAllHref,
  basePath = '',
  titleClassName,
}) => {
  const prefix = basePath || '';

  return (
    <section
      id={id}
      className={`py-12 sm:py-16 md:py-20 bg-white ${id ? 'scroll-mt-20' : ''}`}
      dir="rtl"
    >
      <div className="max-w-content mx-auto px-4 py-6">
        <h2 className={titleClassName ? `${titleClassName} section-title-gap` : defaultTitleClass}>
          {title}
        </h2>
        {description && (
          <p className="text-md sm:text-lg text-[var(--color-text-paragraph)] leading-relaxed mb-8 max-w-2xl">
            {description}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {items.map((item) => {
            const href = item.viewMushafHref != null
              ? (item.viewMushafHref.startsWith('http') ? item.viewMushafHref : `${prefix}${item.viewMushafHref}`)
              : null;
            const cardClass =
              'group rounded-[24px] border border-[#EBE8E8] flex h-64 flex-col justify-between items-start text-start p-6 transition-colors hover:border-[var(--color-primary)]';
            const content = (
              <>
                {/* Row 1: Number circle */}
                <div className="w-[70px] h-[70px] rounded-full bg-[#F3F3F3] flex items-center justify-center shrink-0">
                  <span className="text-[22px] font-semibold text-[#6A6A6A] transition-colors group-hover:text-[var(--color-primary)]">
                    {toArabicNumeral(item.number)}
                  </span>
                </div>

                {/* Row 2: Title + subtitle */}
                <div className="flex flex-col items-start">
                  <h3 className="text-[22px] font-semibold text-[var(--color-foreground)] leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-[20px] font-normal text-[#6A6A6A] mt-1">
                    رواياه: {item.riwayats}
                  </p>
                </div>

                {/* Row 3: Link label (card is the link when href is set) */}
                {href != null && (
                  <span className="text-base font-normal text-[#6A6A6A] transition-colors group-hover:text-[var(--color-primary)] group-hover:underline">
                    عرض المصاحف
                  </span>
                )}
              </>
            );

            if (href != null) {
              return (
                <Link
                  key={item.id}
                  href={href}
                  className={`${cardClass} cursor-pointer block`}
                >
                  {content}
                </Link>
              );
            }
            return (
              <div key={item.id} className={cardClass}>
                {content}
              </div>
            );
          })}
        </div>

        {/* {viewAllHref && (
          <div className="mt-8">
            <Link
              href={viewAllHref.startsWith('http') ? viewAllHref : `${prefix}${viewAllHref}`}
              className="text-md font-medium text-[var(--color-primary)] hover:underline"
            >
              عرض الكل
            </Link>
          </div>
        )} */}
      </div>
    </section>
  );
};
