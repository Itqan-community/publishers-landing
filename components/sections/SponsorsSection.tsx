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
    <section className="py-12 sm:py-16 md:py-20 bg-white" dir="rtl">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header (match Saudi Center RTL style) */}
        <div className="mb-12">
          <h2 className="text-display-xs sm:text-display-sm md:text-display-md font-semibold text-black leading-tight">
            {title}
          </h2>
          {description && (
            <p className="mt-3 text-md sm:text-lg md:text-xl text-[#343434] max-w-paragraph">
              {description}
            </p>
          )}
        </div>

        {/* Sponsor cards - 2 columns side by side, logo on top, text below */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          {sponsors.map((sponsor) => (
            <Card
              key={sponsor.id}
              variant="outlined"
              className="border border-[#ebe8e8] rounded-xl bg-white p-6 sm:p-8"
            >
              <div className="flex flex-col gap-6">
                {/* Logo - top row */}
                <div className="relative h-[120px] w-full flex-shrink-0">
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    fill
                    className="object-contain object-end"
                    sizes="(max-width: 640px) 100vw, 100%"
                  />
                </div>

                {/* Text - bottom row */}
                <div>
                  <h3 className="text-xl md:text-display-xs font-semibold text-black">
                    {sponsor.name}
                  </h3>
                  {sponsor.description && (
                    <p className="mt-3 text-md md:text-lg text-[#343434]">
                      {sponsor.description}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
