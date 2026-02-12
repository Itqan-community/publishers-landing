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
    <section id={id} className={`py-12 sm:py-16 md:py-20 bg-white ${id ? 'scroll-mt-20' : ''}`}>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 sm:mb-12 gap-4">
          <div>
            <h2 className="text-display-xs sm:text-display-sm md:text-display-md font-semibold text-black leading-tight mb-3">
              {title}
            </h2>
            <p className="text-md sm:text-lg md:text-xl text-[#343434] max-w-2xl">
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
