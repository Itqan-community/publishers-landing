/**
 * Statistics Section Component
 * 
 * Displays key metrics and statistics in an attractive grid
 */

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
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {(title || description) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {statistics.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
            >
              <div className="text-5xl md:text-6xl font-bold text-primary mb-2 leading-none">
                {typeof stat.value === 'number'
                  ? stat.value.toLocaleString()
                  : stat.value}
                {stat.suffix && (
                  <span className="text-secondary text-3xl ml-1">{stat.suffix}</span>
                )}
              </div>
              <div className="text-base md:text-lg text-gray-800 font-semibold mb-1">
                {stat.label}
              </div>
              {stat.description && (
                <div className="text-sm text-gray-500">
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

