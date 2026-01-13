import React from 'react';
import { Card } from '@/components/ui/Card';
import { FiCheckCircle } from 'react-icons/fi';

export interface FeatureItem {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

interface AboutSectionProps {
  title: string;
  description: string;
  features: FeatureItem[];
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  title,
  description,
  features,
}) => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Text Content - Right side in RTL */}
          <div className="order-2 lg:order-2">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {title}
            </h2>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Features Grid - Left side in RTL, 4 cards in a row */}
          <div className="order-1 lg:order-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature) => (
              <Card
                key={feature.id}
                variant="outlined"
                className="p-6 hover:shadow-md transition-shadow bg-gray-50"
              >
                <div className="flex items-start gap-4">
                  {feature.icon || (
                    <FiCheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {feature.title}
                    </h3>
                    {feature.description && (
                      <p className="text-sm text-gray-600">
                        {feature.description}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
