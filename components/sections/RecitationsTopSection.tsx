'use client';

import React from 'react';
import type { RiwayahOption } from '@/lib/listing-riwayah';

// Arrow down icon for filter dropdown
function ArrowDown({ className }: { className?: string }) {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M5.99975 8.99986L11.9998 14.9998L17.9997 8.99981" stroke="currentColor" strokeMiterlimit="16" strokeWidth="1.5" />
    </svg>
  );
}

// Grid view icon
function GridView({ className }: { className?: string }) {
  return (
    <svg width={26} height={26} viewBox="0 0 26 26" fill="none" className={className} aria-hidden>
      <path d="M10.8333 2.16667V10.8333H2.16667V2.16667H10.8333Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
      <path d="M23.8333 2.16667V10.8333H15.1667V2.16667H23.8333Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
      <path d="M23.8333 15.1667V23.8333H15.1667V15.1667H23.8333Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
      <path d="M10.8333 15.1667V23.8333H2.16667V15.1667H10.8333Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

// Search icon for button (orange, rotated and flipped)
function SearchButtonIcon({ className }: { className?: string }) {
  return (
    <div className={`flex-none rotate-[180deg] scale-y-[-100%] ${className}`}>
      <svg width={24} height={24} viewBox="0 0 24 24" fill="none" className="size-full" aria-hidden>
        <path d="M4 11C4 6.02944 8.02944 2 13 2C17.9706 2 22 6.02944 22 11C22 15.9706 17.9706 20 13 20C8.02944 20 4 15.9706 4 11Z" fill="#FAAF41" opacity="0.3" />
        <path d="M6.5 17.5L2 22" stroke="#FAAF41" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        <path d="M4 11C4 6.02944 8.02944 2 13 2C17.9706 2 22 6.02944 22 11C22 15.9706 17.9706 20 13 20C8.02944 20 4 15.9706 4 11Z" stroke="#FAAF41" strokeLinejoin="round" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

interface RecitationsTopSectionProps {
  title: string;
  description: string;
  searchPlaceholder?: string;
  filterAllLabel?: string;
  search: string;
  onSearchChange: (v: string) => void;
  onSearchSubmit: () => void;
  riwayahId: string;
  onRiwayahChange: (riwayahId: string) => void;
  riwayaOptions: RiwayahOption[];
}

/**
 * Top section with search bar matching the design from .temp/search bar
 * Layout: [Filter dropdown] [Search input] [Search button]
 * Filters are synced to URL; search applies on submit (ابحث).
 */
export function RecitationsTopSection({
  title,
  description,
  searchPlaceholder = 'البحث في المصاحف',
  filterAllLabel = 'كل الروايات',
  search,
  onSearchChange,
  onSearchSubmit,
  riwayahId,
  onRiwayahChange,
  riwayaOptions,
}: RecitationsTopSectionProps) {
  return (
    <section
      className="relative overflow-hidden pt-12 pb-10 md:pt-16 md:pb-12"
      aria-labelledby="recitations-heading"
      dir="rtl"
    >
      <div className="relative mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <h1
          id="recitations-heading"
          className="text-center text-[24px] sm:text-[28px] font-semibold leading-[1.4] text-black md:text-[32px] lg:text-[39px]"
        >
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-[640px] text-center text-[16px] leading-[1.6] text-[#343434] sm:mt-6 sm:text-[18px] md:mt-8 md:text-[20px] md:leading-[30.4px]">
          {description}
        </p>

        {/* White bar: Mobile = 2 rows (dropdown, then input+button). Desktop = single row. */}
        <div className="mt-8 sm:mt-10 flex flex-col gap-3 rounded-[6px] bg-white p-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 sm:p-4">
          {/* Row 1 on mobile / inline on desktop: filter dropdown */}
          <div className="flex h-[48px] w-full shrink-0 items-center gap-[10px] rounded-[6px] bg-[#f3f3f3] px-5 py-3 sm:w-auto">
            <GridView className="h-[26px] w-[26px] shrink-0 text-black" />
            <select
              value={riwayahId}
              onChange={(e) => onRiwayahChange(e.target.value)}
              className="flex-1 cursor-pointer appearance-none bg-transparent text-[16px] font-semibold text-black text-start focus:outline-none [-webkit-appearance:none]"
              aria-label={filterAllLabel}
            >
              <option value="">{filterAllLabel}</option>
              {riwayaOptions.map((opt) => (
                <option key={opt.id} value={String(opt.id)}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ArrowDown className="h-6 w-6 shrink-0 text-black" />
          </div>

          {/* Row 2 on mobile / inline on desktop: search input + button side-by-side */}
          <div className="flex w-full min-w-0 items-center gap-2 sm:w-auto sm:flex-1 sm:gap-3">
            <div className="relative min-w-0 flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit()}
                placeholder={searchPlaceholder}
                className="h-[48px] w-full rounded-[6px] border border-[#ebe8e8] bg-transparent py-3 px-4 text-[16px] text-[#343434] placeholder:text-[#343434] focus:outline-none sm:rounded-none sm:border-0"
                aria-label={searchPlaceholder}
              />
            </div>

            <button
              type="button"
              onClick={onSearchSubmit}
              className="flex h-[48px] shrink-0 items-center justify-center gap-1 bg-[#193624] px-3 sm:px-4 rounded-[4px] text-[16px] font-medium text-white hover:bg-[#102516] focus:outline-none focus:ring-2 focus:ring-[#193624] focus:ring-offset-0"
              aria-label="ابحث"
            >
              <span className="hidden sm:inline">ابحث</span>
              <SearchButtonIcon className="size-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
