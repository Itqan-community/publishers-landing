/**
 * Statistics Section Component
 * 
 * Displays key metrics and statistics in an attractive grid
 */

import { StatisticsContent } from '@/types/tenant.types';

interface StatisticsSectionProps {
  statistics: StatisticsContent[];
}

export function StatisticsSection({ statistics }: StatisticsSectionProps) {
  if (!statistics || statistics.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statistics.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                {typeof stat.value === 'number'
                  ? stat.value.toLocaleString()
                  : stat.value}
                {stat.suffix && (
                  <span className="text-secondary ml-1">{stat.suffix}</span>
                )}
              </div>
              <div className="text-sm md:text-base text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

