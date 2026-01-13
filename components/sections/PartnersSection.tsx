/**
 * Partners Section Component
 * 
 * Displays partner logos in a horizontal infinite scrolling row
 * Part of the hero section visually
 * RTL order: from right (start) to left (end)
 */

'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface PartnersSectionProps {
  partners?: Array<{
    name: string;
    logo: string;
  }>;
}

export function PartnersSection({ partners }: PartnersSectionProps) {
  // Default partners from Figma - RTL order (as shown in design from right to left)
  // Order: Partner 1, Partner 2, Partner 3 (grid), Partner 4, Partner 5 (grid with King Fahd)
  const defaultPartners = [
    { name: 'Partner 1', logo: '/images/partner-1.png', width: 258, height: 49 },
    { name: 'Partner 2', logo: '/images/partner-2.png', width: 149, height: 50 },
    // Partner 3 is a grid with two logos
    { name: 'Partner 3 Grid', isGrid: true, logos: ['/images/partner-3.png', '/images/partner-4.png'], width: 164.457, height: 32.71 },
    { name: 'Partner 4', logo: '/images/partner-5.png', width: 214, height: 51 },
    // Partner 5 is a grid with King Fahd Complex
    { name: 'Partner 5 Grid', isGrid: true, logos: ['/images/partner-5.png', '/images/partner-6-king-fahd.png'], width: 220, height: 53 },
  ];

  const partnerLogos = partners || defaultPartners;
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    // Check if content exceeds container width
    const checkWidth = () => {
      if (containerRef.current && contentRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const contentWidth = contentRef.current.scrollWidth;
        setShouldAnimate(contentWidth > containerWidth);
      }
    };

    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, [partnerLogos]);

  // Flatten grid partners into single items for rendering
  const flattenedPartners: Array<any> = [];
  partnerLogos.forEach((partner: any) => {
    if (partner.isGrid && partner.logos) {
      flattenedPartners.push({ ...partner, type: 'grid' });
    } else {
      flattenedPartners.push({ ...partner, type: 'single' });
    }
  });

  // Duplicate for seamless infinite scroll (only if animating)
  // For seamless loop, we need at least 2 copies
  const duplicatedPartners = shouldAnimate ? [...flattenedPartners, ...flattenedPartners] : flattenedPartners;

  return (
    <section className="relative w-full bg-[#f6f6f4] border-t border-[rgba(0,0,0,0.09)] overflow-hidden" dir="rtl">
      <div className="py-[19px]">
        <div ref={containerRef} className="w-full overflow-hidden">
          <div
            ref={contentRef}
            className={`flex items-end gap-[61px] whitespace-nowrap ${shouldAnimate ? 'partners-scroll-rtl' : 'justify-center'}`}
          >
            {duplicatedPartners.map((partner, idx) => {
              if (partner.type === 'grid' && partner.logos) {
                // Grid layout for partner 3 or 5
                const isPartner5 = partner.name === 'Partner 5 Grid';
                return (
                  <div
                    key={`${partner.name}-${idx}`}
                    className="grid grid-cols-2 gap-0 flex-shrink-0"
                    style={{ width: `${partner.width}px`, height: `${partner.height}px` }}
                  >
                    <div
                      className={`relative ${isPartner5 ? 'opacity-70' : ''}`}
                      style={{ height: isPartner5 ? '45px' : '30.59px', width: isPartner5 ? '166px' : '84.5px' }}
                    >
                      <Image
                        src={partner.logos[0]}
                        alt={partner.name}
                        fill
                        className="object-contain"
                        style={{ filter: 'grayscale(100%)' }}
                      />
                    </div>
                    <div
                      className="relative"
                      style={{ height: isPartner5 ? '53px' : '32.71px', width: isPartner5 ? '54px' : '79.957px' }}
                    >
                      <Image
                        src={isPartner5 ? partner.logos[1] : partner.logos[1]}
                        alt={isPartner5 ? 'King Fahd Complex' : partner.name}
                        fill
                        className="object-contain"
                        style={{ filter: 'grayscale(100%)' }}
                      />
                    </div>
                  </div>
                );
              }

              // Single logo - grayscale, no color blend modes
              return (
                <div
                  key={`${partner.name}-${idx}`}
                  className="relative flex-shrink-0"
                  style={{
                    height: `${partner.height}px`,
                    width: `${partner.width}px`,
                  }}
                >
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    className="object-contain"
                    style={{ filter: 'grayscale(100%)' }}
                    sizes={`${partner.width}px`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
