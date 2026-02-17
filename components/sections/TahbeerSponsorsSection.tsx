/**
 * Sponsors Section — Tahbeer (تحبير) only.
 * From Figma: single or multiple sponsor blocks — logo on start, name + description on end.
 * Light beige background; do not use for Saudi Center (they use SponsorsSection).
 */

import React from 'react';
import Image from 'next/image';

export interface TahbeerSponsorItem {
  id: string;
  name: string;
  description: string;
  logo: string;
  website?: string;
}

interface TahbeerSponsorsSectionProps {
  id?: string;
  sponsors: TahbeerSponsorItem[];
}

export const TahbeerSponsorsSection: React.FC<TahbeerSponsorsSectionProps> = ({
  id,
  sponsors,
}) => {
  if (!sponsors?.length) return null;

  return (
    <section
      id={id}
      className={`py-9 bg-[#f6f4f1] border-b border-[#EBE8E8] ${id ? 'scroll-mt-20' : ''}`}
      dir="rtl"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {sponsors.map((sponsor) => (
          <div
            key={sponsor.id}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 py-6 first:pt-0 last:pb-0"
          >
            {/* Logo — start side (right in RTL), 74×74 per Figma */}
            <div className="relative w-[74px] h-[74px] shrink-0 rounded-xl bg-white overflow-hidden">
              <Image
                src={sponsor.logo}
                alt={sponsor.name}
                fill
                className="object-contain p-2"
                sizes="74px"
                unoptimized={sponsor.logo.endsWith('.svg')}
              />
            </div>

            {/* Text — end side (left in RTL), start-aligned */}
            <div className="flex flex-col gap-1 items-start text-start min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-black leading-tight">
                {sponsor.description}
              </h3>
              <p className="text-sm sm:text-base font-normal text-[#6a6a6a] leading-[1.5]">
                {sponsor.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
