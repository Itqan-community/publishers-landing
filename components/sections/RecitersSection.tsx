'use client';

import React from 'react';
import { Carousel } from '@/components/ui/Carousel';
import { ReciterCard, ReciterCardProps } from '@/components/cards/ReciterCard';

interface RecitersSectionProps {
  id?: string;
  title: string;
  description: string;
  reciters: ReciterCardProps[];
  viewAllHref?: string;
}

export const RecitersSection: React.FC<RecitersSectionProps> = ({
  id,
  title,
  description,
  reciters,
  viewAllHref,
}) => {
  return (
    <section id={id} className={`py-20 bg-white ${id ? 'scroll-mt-20' : ''}`}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <h2 className="text-[32px] md:text-[39px] font-semibold text-black leading-[1.4] mb-3">
              {title}
            </h2>
            <p className="text-[18px] md:text-[20px] text-[#343434] leading-[30.4px] max-w-2xl">
              {description}
            </p>
          </div>
          {viewAllHref && (
            <a
              href={viewAllHref}
              className="text-primary hover:text-primary-dark font-semibold transition-colors"
            >
              عرض الكل
            </a>
          )}
        </div>

        {/* Carousel */}
        <Carousel slidesToScroll={1} loop={true} showArrows={false} showDots={true}>
          {reciters.map((reciter) => (
            <div key={reciter.id} className="flex-[0_0_100%] md:flex-[0_0_calc(50%-0.5rem)] lg:flex-[0_0_calc((100%-2rem)/3)]">
              <ReciterCard {...reciter} />
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
};
