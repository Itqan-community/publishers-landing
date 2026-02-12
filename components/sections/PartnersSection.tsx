/**
 * Partners Section Component
 * 
 * Displays partner and sponsor logos in a horizontal carousel
 * Now located at the bottom of the page
 * RTL order: from right (start) to left (end)
 */

/* eslint-disable @next/next/no-img-element */
'use client';

import { Carousel } from '@/components/ui/Carousel';

interface PartnersSectionProps {
  title?: string;
  partners?: Array<{
    name: string;
    logo: string;
    url?: string;
  }>;
}

export function PartnersSection({ title, partners }: PartnersSectionProps) {
  // Default partners from Figma + Sponsors Merged
  const defaultPartners = [
    { name: 'King Fahd Complex', logo: '/images/partners/king-fahd.svg', url: 'https://qurancomplex.gov.sa/' },
    { name: 'Islamic Ministry', logo: '/images/partners/islamic-ministiry.svg', url: 'https://www.moia.gov.sa/' },
    { name: 'SBA', logo: '/images/partners/sba.svg', url: 'https://sba.sa/' },
    { name: 'WO9', logo: '/images/partners/wo9.svg', url: 'https://www.spa.gov.sa/' },
    { name: 'Islamic University', logo: '/images/partners/islamic-university.svg', url: 'https://iu.edu.sa/' },
    // Merged Sponsors
    { name: 'أوقاف الراجحي', logo: '/images/sponsor-rajhi.png', url: '#' },
    { name: 'أوقاف السبيعي', logo: '/images/sponsor-subai.png', url: '#' },
  ];

  const partnerLogos = partners || defaultPartners;

  return (
    <section className="relative w-full overflow-hidden py-8 mt-10 mb-20 sm:mt-16 sm:mb-32 md:mt-20 md:mb-40" dir="rtl">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <h2 className="text-display-xs sm:text-display-sm md:text-display-md font-semibold text-[var(--color-foreground)] leading-tight mb-8 sm:mb-12">
            {title}
          </h2>
        )}
        <Carousel
          loop
          showArrows={false}
          showDots={true}
          className="w-full"
        >
          {partnerLogos.map((partner, idx) => {
            return (
              <div key={`${partner.name}-${idx}`} className="flex-[0_0_auto] flex items-center justify-center">
                <a
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    loading="lazy"
                    className="max-h-12 sm:max-h-16 md:max-h-20 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </a>
              </div>
            );
          })}
        </Carousel>
      </div>
    </section>
  );
}
