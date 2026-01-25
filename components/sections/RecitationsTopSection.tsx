'use client';

import React from 'react';

// Golden-yellow magnifying glass for the ابحث button — to the visual left of the text in RTL
function SearchButtonIcon({ className }: { className?: string }) {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M21 21l-5.2-5.2M11 19a8 8 0 100-16 8 8 0 000 16z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Light gray magnifying glass inside the search input
function SearchInputIcon({ className }: { className?: string }) {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M21 21l-5.2-5.2M11 19a8 8 0 100-16 8 8 0 000 16z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Chevron down for dropdown — RTL: at inline-end
function ChevronDown({ className }: { className?: string }) {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface RecitationsTopSectionProps {
  title: string;
  description: string;
  searchPlaceholder?: string;
  filterAllLabel?: string;
  search: string;
  onSearchChange: (v: string) => void;
  filterRiwaya: string;
  onFilterRiwayaChange: (v: string) => void;
  riwayaOptions: string[];
}

/**
 * Top section — Figma 2154-9640. RTL by default.
 * - Search: one unit = [أبحث button inside same container] + [input with icon at inline-end]. Icon = “visual left” of placeholder in RTL.
 * - Filter: custom-styled select with appearance-none, chevron at inline-end (RTL = left).
 */
export function RecitationsTopSection({
  title,
  description,
  searchPlaceholder = 'البحث في المصاحف',
  filterAllLabel = 'كل الروايات',
  search,
  onSearchChange,
  filterRiwaya,
  onFilterRiwayaChange,
  riwayaOptions,
}: RecitationsTopSectionProps) {
  return (
    <section
      className="relative overflow-hidden bg-[#f6f4f1] pt-12 pb-10 md:pt-16 md:pb-12"
      aria-labelledby="recitations-heading"
      dir="rtl"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[url('/images/hero-bg.svg')] bg-cover bg-right-top bg-no-repeat opacity-100 [mask-image:linear-gradient(to_bottom_left,#000_0%,#000_24%,transparent_88%)] [-webkit-mask-image:linear-gradient(to_bottom_left,#000_0%,#000_24%,transparent_88%)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <h1
          id="recitations-heading"
          className="text-center font-primary text-[32px] font-semibold leading-[1.4] text-black md:text-[39px]"
        >
          {title}
        </h1>
        <p className="mx-auto mt-6 max-w-[640px] text-center font-primary text-[18px] leading-[1.6] text-[#343434] md:mt-8 md:text-[20px] md:leading-[30.4px]">
          {description}
        </p>

        {/* White bar: [Search unit: button+input] [Dropdown] [View toggle]. RTL: first = start = right. */}
        <div className="mt-10 flex flex-row flex-wrap items-center gap-3 rounded-[12px] border border-[#ebe8e8] bg-white p-3 sm:gap-4 sm:p-4">
          {/* Search unit: button inside the same bordered container as the input. RTL: button at start (right). */}
          <div className="flex min-w-0 flex-1 flex-row overflow-hidden rounded-[10px] border border-[#ebe8e8] bg-white sm:min-w-[280px]">
            {/* Button at start (right in RTL): ابحث + golden icon (icon to visual left = after text in DOM) */}
            <button
              type="button"
              className="flex h-[44px] shrink-0 items-center justify-center gap-2 border-0 bg-[#193624] px-4 text-[16px] font-medium text-white hover:bg-[#102516] focus:outline-none focus:ring-2 focus:ring-[#193624] focus:ring-offset-0"
              aria-label="ابحث"
            >
              <span>ابحث</span>
              <SearchButtonIcon className="h-5 w-5 shrink-0 text-[#faaf41]" />
            </button>
            {/* 1px divider between button and input — use border-inline-start on input wrapper */}
            <div className="relative min-w-0 flex-1 border-inline-start border-[#ebe8e8]">
              <input
                type="text"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="h-[44px] w-full border-0 bg-transparent py-2.5 ps-4 pe-11 text-[16px] text-[#1f2a37] placeholder:text-[#9ca3af] focus:outline-none focus:ring-0"
                aria-label={searchPlaceholder}
              />
              {/* Icon at inline-end (left in RTL) = “visual left of placeholder”, flex-centered in fixed-width slot */}
              <span className="pointer-events-none absolute top-0 flex h-[44px] w-11 items-center justify-center text-[#9ca3af] inset-inline-end-0">
                <SearchInputIcon className="h-5 w-5" />
              </span>
            </div>
          </div>

          {/* Dropdown: custom-styled, chevron at inline-end (left in RTL). appearance-none + own chevron. */}
          <div className="relative h-[44px] shrink-0">
            <select
              value={filterRiwaya}
              onChange={(e) => onFilterRiwayaChange(e.target.value)}
              className="h-full min-w-[140px] cursor-pointer appearance-none rounded-[10px] border border-[#ebe8e8] bg-white ps-4 pe-10 text-[14px] text-[#1f2a37] [-webkit-appearance:none] focus:outline-none focus:ring-2 focus:ring-[#193624]/30"
              aria-label={filterAllLabel}
            >
              <option value="">{filterAllLabel}</option>
              {riwayaOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute inset-inline-end-3 top-1/2 -translate-y-1/2 text-[#6a6a6a]">
              <ChevronDown className="h-4 w-4" />
            </span>
          </div>

          {/* View toggle */}
          <button
            type="button"
            className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[10px] border border-[#ebe8e8] bg-white text-[#6a6a6a] hover:bg-[#f3f3f3] focus:outline-none focus:ring-2 focus:ring-[#193624]/30"
            aria-label="عرض الشبكة"
          >
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" aria-hidden>
              <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
              <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
              <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
              <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
