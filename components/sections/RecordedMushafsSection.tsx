'use client';

import React from 'react';
import { Carousel } from '@/components/ui/Carousel';
import { MushafCard, MushafCardProps } from '@/components/cards/MushafCard';
import { Button } from '@/components/ui/Button';

interface RecordedMushafsSectionProps {
  title: string;
  description: string;
  mushafs: MushafCardProps[];
  viewAllHref?: string;
}

export const RecordedMushafsSection: React.FC<RecordedMushafsSectionProps> = ({
  title,
  description,
  mushafs,
  viewAllHref,
}) => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              {title}
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl">
              {description}
            </p>
          </div>
          {viewAllHref && (
            <Button variant="surface" size="sm" asChild>
              <a href={viewAllHref}>عرض الكل</a>
            </Button>
          )}
        </div>

        {/* Carousel */}
        <Carousel slidesToScroll={1} loop={false} showArrows={true}>
          {mushafs.map((mushaf) => (
            <div key={mushaf.id} className="flex-[0_0_100%] md:flex-[0_0_calc(50%-0.5rem)] lg:flex-[0_0_calc(25%-0.75rem)]">
              <MushafCard {...mushaf} />
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
};
