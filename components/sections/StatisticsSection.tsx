/**
 * Statistics Section Component
 *
 * Displays key metrics and statistics. Matches Figma: dark green bg, pattern
 * (hero-bg.svg), gold values, typography and spacing. No vertical dividers.
 */

import React from 'react';
import { StatisticsContent } from '@/types/tenant.types';

interface StatisticsSectionProps {
  title?: string;
  description?: string;
  statistics: StatisticsContent[];
}

export function StatisticsSection({
  title,
  description,
  statistics,
}: StatisticsSectionProps) {
  if (!statistics || statistics.length === 0) {
    return null;
  }

  return (
    <section className="relative bg-[#171b19] text-white py-12 sm:py-16 md:py-20 overflow-hidden">
      {/* Background pattern (same as hero): diagonal fade top-start -> bottom-end */}
      <div
        className="pointer-events-none absolute inset-0 bg-[url('/images/hero-bg.svg')] bg-no-repeat bg-right-top bg-cover opacity-50"
        aria-hidden="true"
      />

      <div className="relative z-[1] max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title + description stacked */}
        {(title || description) && (
          <div className="mb-12 flex flex-col gap-4">
            {title && (
              <h2 className="text-display-xs md:text-display-sm font-semibold text-white leading-tight">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-sm md:text-md text-white/80 leading-relaxed max-w-[640px]">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Statistics Row: value (gold) + label + optional description */}
        <div className="flex flex-col md:flex-row items-stretch justify-start gap-4">
          {statistics.map((stat, index) => (
            <div
              key={index}
              className="relative min-h-[140px] sm:min-h-[160px] md:h-[187px] w-full md:w-[240px] flex-shrink-0"
            >
              <div className="text-display-sm sm:text-display-lg md:text-display-xl leading-none text-[var(--color-secondary)] font-medium">
                {typeof stat.value === 'number'
                  ? stat.value.toLocaleString()
                  : stat.value}
                {stat.suffix ?? ''}
              </div>
              <div className="text-xl sm:text-display-xs md:text-display-sm font-light mt-3 md:mt-4">{stat.label}</div>
              {stat.description && (
                <div className="text-sm font-light mt-2 text-white/90">
                  {stat.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
