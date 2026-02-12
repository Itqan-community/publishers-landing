'use client';

import React from 'react';
import type { RiwayahOption } from '@/lib/listing-riwayah';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

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
        <path d="M4 11C4 6.02944 8.02944 2 13 2C17.9706 2 22 6.02944 22 11C22 15.9706 17.9706 20 13 20C8.02944 20 4 15.9706 4 11Z" fill="var(--color-secondary)" opacity="0.3" />
        <path d="M6.5 17.5L2 22" stroke="var(--color-secondary)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        <path d="M4 11C4 6.02944 8.02944 2 13 2C17.9706 2 22 6.02944 22 11C22 15.9706 17.9706 20 13 20C8.02944 20 4 15.9706 4 11Z" stroke="var(--color-secondary)" strokeLinejoin="round" strokeWidth="1.5" />
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
 * Top section with search bar.
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
      className="relative overflow-hidden py-header"
      aria-labelledby="recitations-heading"
      dir="rtl"
    >
      <div className="relative mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <h1
          id="recitations-heading"
          className="text-center text-display-xs sm:text-display-sm font-semibold text-[var(--color-foreground)] lg:text-display-lg"
        >
          {title}
        </h1>
        <p className="mx-auto mt-xl max-w-width-lg text-center text-md text-[var(--color-text-paragraph)] sm:mt-3xl sm:text-lg md:mt-4xl md:text-xl">
          {description}
        </p>

        {/* Search bar: Mobile = 2 rows, Desktop = single row */}
        <div className="mt-8 sm:mt-10 flex flex-col gap-3 rounded-sm bg-[var(--color-bg-card)] p-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 sm:p-4">
          {/* Filter dropdown */}
          <Select
            value={riwayahId}
            onChange={(e) => onRiwayahChange(e.target.value)}
            selectSize="md"
            startIcon={<GridView className="h-6 w-6 shrink-0" />}
            aria-label={filterAllLabel}
            className="w-full shrink-0 sm:w-auto"
          >
            <option value="">{filterAllLabel}</option>
            {riwayaOptions.map((opt) => (
              <option key={opt.id} value={String(opt.id)}>
                {opt.label}
              </option>
            ))}
          </Select>

          {/* Search input + button */}
          <div className="flex w-full min-w-0 items-center gap-2 sm:w-auto sm:flex-1 sm:gap-3">
            <div className="min-w-0 flex-1">
              <Input
                type="text"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit()}
                placeholder={searchPlaceholder}
                variant="search"
                inputSize="md"
                aria-label={searchPlaceholder}
              />
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={onSearchSubmit}
              aria-label="ابحث"
              className="shrink-0"
            >
              <span className="hidden sm:inline">ابحث</span>
              <SearchButtonIcon className="size-6" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
