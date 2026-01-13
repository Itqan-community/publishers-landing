import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';

export interface SponsorItem {
  id: string;
  name: string;
  description: string;
  logo: string;
  website?: string;
}

interface SponsorsSectionProps {
  title: string;
  description?: string;
  sponsors: SponsorItem[];
}

export const SponsorsSection: React.FC<SponsorsSectionProps> = ({
  title,
  description,
  sponsors,
}) => {
  if (!sponsors || sponsors.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {title}
        </h2>
        {description && (
          <p className="text-lg text-gray-700 mb-12 max-w-2xl mx-auto">
            {description}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sponsors.map((sponsor) => (
            <Card
              key={sponsor.id}
              variant="outlined"
              hover
              className="p-8 flex flex-col items-center justify-center bg-white"
            >
              <div className="relative w-40 h-32 mb-5">
                <Image
                  src={sponsor.logo}
                  alt={sponsor.name}
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                {sponsor.name}
              </h3>
              {sponsor.description && (
                <p className="text-sm text-gray-600 text-center leading-relaxed line-clamp-4">
                  {sponsor.description}
                </p>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
