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
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {title}
        </h2>
        {description && (
          <p className="text-lg text-gray-700 mb-12 max-w-2xl mx-auto">
            {description}
          </p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {sponsors.map((sponsor) => (
            <Card
              key={sponsor.id}
              variant="outlined"
              className="border border-[#ebe8e8] rounded-[12px] p-10 flex flex-col items-center bg-white"
            >
              <div className="relative w-[187px] h-[247px] mb-6">
                <Image
                  src={sponsor.logo}
                  alt={sponsor.name}
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-[29px] font-semibold text-black mb-4 text-center">
                {sponsor.name}
              </h3>
              {sponsor.description && (
                <p className="text-[20px] leading-[28.4px] text-[#343434] text-center">
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
