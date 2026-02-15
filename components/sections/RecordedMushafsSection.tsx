'use client';

import React from 'react';
import { Carousel } from '@/components/ui/Carousel';
import { MushafCard } from '@/components/cards/MushafCard';
import { Button } from '@/components/ui/Button';
import type { RecordedMushaf } from '@/types/tenant.types';

interface RecordedMushafsSectionProps {
  id?: string;
  title: string;
  description: string;
  mushafs: RecordedMushaf[];
  viewAllHref?: string;
}

export const RecordedMushafsSection: React.FC<RecordedMushafsSectionProps> = ({
  id,
  title,
  description,
  mushafs,
  viewAllHref,
}) => {
  return (
    <section id={id} className={`py-12 sm:py-16 md:py-20 bg-white ${id ? 'scroll-mt-20' : ''}`}>
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-8 sm:mb-12 gap-4">
          <div>
            <h2 className="text-display-xs sm:text-display-sm md:text-display-lg font-semibold text-[var(--color-foreground)] leading-tight mb-3">
              {title}
            </h2>
            <p className="text-md sm:text-lg md:text-xl text-[var(--color-text-paragraph)] leading-relaxed max-w-2xl">
              {description}
            </p>
          </div>
          {viewAllHref && (
            <Button variant="surface" size="md" asChild>
              <a href={viewAllHref}>عرض الكل</a>
            </Button>
          )}
        </div>

        {/* Carousel */}
        <Carousel slidesToScroll={1} loop={true} showArrows={false} showDots={true}>
          {mushafs.map((mushaf) => (
            <div
              key={mushaf.id}
              className="flex-[0_0_100%] sm:flex-[0_0_284px]"
            >
              <MushafCard mushaf={mushaf} />
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
};
