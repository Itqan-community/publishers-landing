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
    <section className="relative bg-[#193624] text-white py-20 overflow-hidden">
      {/* Background pattern (same as hero): diagonal fade top-start -> bottom-end */}
      <div
        className="pointer-events-none absolute inset-0 bg-[url('/images/hero-bg.svg')] bg-no-repeat bg-right-top bg-cover opacity-100 [mask-image:linear-gradient(to_bottom_left,#000_0%,#000_24%,transparent_88%)] [-webkit-mask-image:linear-gradient(to_bottom_left,#000_0%,#000_24%,transparent_88%)]"
        aria-hidden="true"
      />

      <div className="relative z-[1] max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header: title and description in one row (stack on mobile) */}
        {(title || description) && (
          <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-center">
            {title && (
              <h2 className="text-[26px] md:text-[32px] font-semibold text-white leading-[1.4] lg:mb-0 lg:max-w-[520px] shrink-0">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-[15px] md:text-[17px] text-white/80 leading-[25px] lg:max-w-[290px]">
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
              className="relative h-[187px] w-full md:w-[240px] flex-shrink-0"
            >
              <div className="text-[56px] leading-none text-[#faaf41] font-medium">
                {typeof stat.value === 'number'
                  ? stat.value.toLocaleString()
                  : stat.value}
                {stat.suffix ?? ''}
              </div>
              <div className="text-[29px] font-light mt-4">{stat.label}</div>
              {stat.description && (
                <div className="text-[15px] font-light mt-2 text-white/90">
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
