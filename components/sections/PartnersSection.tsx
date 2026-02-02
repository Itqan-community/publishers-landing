/**
 * Partners Section Component
 * 
 * Displays partner logos in a horizontal infinite scrolling row
 * Part of the hero section visually
 * RTL order: from right (start) to left (end)
 */

/* eslint-disable @next/next/no-img-element */
'use client';

interface PartnersSectionProps {
  partners?: Array<{
    name: string;
    logo: string;
    url?: string;
  }>;
}

export function PartnersSection({ partners }: PartnersSectionProps) {
  // Default partners from Figma - RTL order (as shown in design from right to left)
  const defaultPartners = [
    { name: 'King Fahd Complex', logo: '/images/partners/king-fahd.svg', url: 'https://qurancomplex.gov.sa/' },
    { name: 'Islamic Ministry', logo: '/images/partners/islamic-ministiry.svg', url: 'https://www.moia.gov.sa/' },
    { name: 'SBA', logo: '/images/partners/sba.svg', url: 'https://sba.sa/' },
    { name: 'WO9', logo: '/images/partners/wo9.svg', url: 'https://www.spa.gov.sa/' },
    { name: 'Islamic University', logo: '/images/partners/islamic-university.svg', url: 'https://iu.edu.sa/' },
  ];

  const partnerLogos = partners || defaultPartners;

  return (
    <section className="relative w-full bg-[#f6f6f4] border-t border-[rgba(0,0,0,0.09)] overflow-hidden" dir="rtl">
      <div className="py-[19px]">
        <div className="w-full overflow-x-auto hide-scrollbar">
          <div className="flex items-center justify-center gap-[61px] whitespace-nowrap px-4">
            {partnerLogos.map((partner, idx) => {
              return (
                <a
                  key={`${partner.name}-${idx}`}
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 cursor-pointer"
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    loading="lazy"
                    className="flex-shrink-0 filter grayscale"
                  />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
