/**
 * Ten Readings Section — Tahbeer (تحبير)
 * From Figma: "القراءات العشر ورواتها" — grid of 10 qira'at cards with riwayats
 * Card design: Figma node 4019-14699 — large rounded card, brown border, circle with number (top right), centered title/subtitle/underlined link
 *
 * appearance `qiraat-archive`: manuscript index (spine number + hairline rules), not card chrome.
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
  comingSoon?: boolean;
}

export type TenReadingsAppearance = 'default' | 'qiraat-archive';

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
  /** `qiraat-archive` = ruled index rows. Default = Tahbeer cards. */
  appearance?: TenReadingsAppearance;
}

export const TenReadingsSection: React.FC<TenReadingsSectionProps> = ({
  id,
  title,
  description,
  items,
  viewAllHref,
  basePath = '',
  titleClassName,
  appearance = 'default',
}) => {
  const prefix = basePath || '';
  const isArchive = appearance === 'qiraat-archive';

  if (isArchive) {
    return (
      <section
        id={id}
        className={`py-12 sm:py-16 md:py-20 bg-white ${id ? 'scroll-mt-20' : ''}`}
        dir="rtl"
      >
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h2 className={titleClassName ? `${titleClassName} section-title-gap` : defaultTitleClass}>
            {title}
          </h2>
          <div
            className="h-px w-[64px] bg-[var(--color-rule-gold,#A68B4B)] opacity-60 mb-8 -mt-4"
            aria-hidden="true"
          />
          {description && (
            <p className="text-md sm:text-lg text-[var(--color-text-paragraph)] leading-relaxed mb-8 max-w-2xl text-justify">
              {description}
            </p>
          )}

          <ul className="flex flex-col border-t border-[var(--color-rule-gold,#A68B4B)]/35">
            {items.map((item) => {
              const isComingSoon = item.comingSoon === true;
              const href =
                item.viewMushafHref != null
                  ? item.viewMushafHref.startsWith('http')
                    ? item.viewMushafHref
                    : `${prefix}${item.viewMushafHref}`
                  : null;

              const row = (
                <div
                  className={[
                    'group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 py-5 sm:py-6 px-1 sm:px-2 transition-colors',
                    isComingSoon ? 'opacity-70' : 'hover:bg-[var(--color-paper,#E6E2D8)]/50',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'text-[22px] sm:text-[26px] font-semibold tabular-nums w-10 shrink-0',
                      isComingSoon
                        ? 'text-[var(--coming-soon-muted)]'
                        : 'text-[var(--color-primary)]',
                    ].join(' ')}
                  >
                    {toArabicNumeral(item.number)}
                  </span>
                  <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-baseline sm:gap-4 gap-1">
                    <h3
                      className={[
                        'text-[20px] sm:text-[22px] font-semibold leading-tight',
                        isComingSoon
                          ? 'text-[var(--coming-soon-title)]'
                          : 'text-[var(--color-foreground)]',
                      ].join(' ')}
                    >
                      {item.title}
                    </h3>
                    <p
                      className={[
                        'text-[16px] sm:text-[18px]',
                        isComingSoon
                          ? 'text-[var(--coming-soon-muted)]'
                          : 'text-[var(--color-text-paragraph)]',
                      ].join(' ')}
                    >
                      راوياه: {item.riwayats}
                    </p>
                  </div>
                  <div className="shrink-0 sm:ms-auto">
                    {isComingSoon ? (
                      <span className="text-[13px] font-medium text-[var(--coming-soon-badge-text)] bg-[var(--coming-soon-badge-bg)] rounded-[6px] px-3 py-1">
                        قريباً
                      </span>
                    ) : href != null ? (
                      <span className="qiraat-reading-link text-base font-medium text-[var(--color-primary)]">
                        عرض المصحف
                      </span>
                    ) : null}
                  </div>
                </div>
              );

              return (
                <li
                  key={item.id}
                  className="border-b border-[var(--color-rule-gold,#A68B4B)]/35"
                >
                  {href != null ? (
                    <Link href={href} className="block cursor-pointer">
                      {row}
                    </Link>
                  ) : (
                    row
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    );
  }

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
          <p className="text-md sm:text-lg text-[var(--color-text-paragraph)] leading-relaxed mb-8 max-w-2xl text-justify">
            {description}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {items.map((item) => {
            const isComingSoon = item.comingSoon === true;
            const href = item.viewMushafHref != null
              ? (item.viewMushafHref.startsWith('http') ? item.viewMushafHref : `${prefix}${item.viewMushafHref}`)
              : null;
            const cardClass = [
              'group rounded-[24px] border flex h-64 flex-col justify-between items-start text-start p-6 transition-colors',
              isComingSoon
                ? 'border-[#EBE8E8] opacity-70 hover:opacity-100 hover:border-[var(--coming-soon-hover-border)]'
                : 'border-[#EBE8E8] hover:border-[var(--color-primary)]',
            ].join(' ');

            const content = (
              <>
                <div className="flex items-start justify-between w-full">
                  <div className={`w-[70px] h-[70px] rounded-full flex items-center justify-center shrink-0 transition-colors ${isComingSoon ? 'bg-[#F3F3F3]' : 'bg-[#F3F3F3] group-hover:bg-[#F6F6F4]'}`}>
                    <span className={`text-[22px] font-semibold transition-colors ${isComingSoon ? 'text-[var(--coming-soon-muted)]' : 'text-[#6A6A6A] group-hover:text-[var(--color-primary)]'}`}>
                      {toArabicNumeral(item.number)}
                    </span>
                  </div>
                  {isComingSoon && (
                    <span className="text-[13px] font-medium text-[var(--coming-soon-badge-text)] bg-[var(--coming-soon-badge-bg)] rounded-full px-3 py-1">
                      قريباً
                    </span>
                  )}
                </div>

                <div className="flex flex-col items-start">
                  <h3 className={`text-[22px] font-semibold leading-tight ${isComingSoon ? 'text-[var(--coming-soon-title)]' : 'text-black'}`}>
                    {item.title}
                  </h3>
                  <p className={`text-[20px] font-normal mt-1 ${isComingSoon ? 'text-[var(--coming-soon-muted)]' : 'text-[#6A6A6A]'}`}>
                    راوياه: {item.riwayats}
                  </p>
                </div>

                {isComingSoon ? (
                  <span className="text-base font-normal text-[var(--coming-soon-muted)]">
                    قريباً إن شاء الله
                  </span>
                ) : href != null ? (
                  <span className="text-base font-normal text-[#6A6A6A] transition-colors group-hover:text-[var(--color-primary)] group-hover:underline group-hover:font-bold">
                    عرض المصحف
                  </span>
                ) : null}
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
