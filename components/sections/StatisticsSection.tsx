/**
 * Statistics Section Component
 * 
 * Displays key metrics and statistics in an attractive grid
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
  statistics
}: StatisticsSectionProps) {
  if (!statistics || statistics.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-[#193624] text-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {(title || description) && (
          <div className="mb-12 text-right">
            {title && (
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-lg text-white/80 max-w-2xl">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Statistics Row */}
        <div className="flex flex-col md:flex-row items-stretch justify-between gap-10">
          {statistics.map((stat, index) => (
            <React.Fragment key={index}>
              <div className="relative h-[187px] w-full md:w-[240px] text-right">
                <div className="text-[69px] leading-none text-[#faaf41] font-medium">
                  {typeof stat.value === 'number'
                    ? stat.value.toLocaleString()
                    : stat.value}
                </div>
                <div className="text-[36px] font-light mt-4">
                  {stat.label}
                </div>
                {stat.description && (
                  <div className="text-[19px] font-light mt-2 text-white/90">
                    {stat.description}
                  </div>
                )}
              </div>
              {index < statistics.length - 1 && (
                <div className="hidden md:block w-px bg-white/20 h-[152px]" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

