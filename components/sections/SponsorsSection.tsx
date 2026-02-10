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
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header (match Saudi Center RTL style) */}
        <div className="mb-12">
          <h2 className="text-[24px] sm:text-[32px] md:text-[39px] font-semibold text-black leading-[1.4]">
            {title}
          </h2>
          {description && (
            <p className="mt-3 text-[16px] sm:text-[18px] md:text-[20px] text-[#343434] leading-[30.4px] max-w-[720px]">
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
              className="border border-[#ebe8e8] rounded-[18px] bg-white p-6 sm:p-8"
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
                  <h3 className="text-[20px] md:text-[24px] font-semibold text-black">
                    {sponsor.name}
                  </h3>
                  {sponsor.description && (
                    <p className="mt-3 text-[16px] md:text-[18px] leading-[28px] text-[#343434]">
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
