'use client';

import React from 'react';
import { RecitationsPlayer, RecitationItem } from '@/components/audio/AudioPlayer';
import { Button } from '@/components/ui/Button';

interface FeaturedRecitationsSectionProps {
  title: string;
  description: string;
  recitations: RecitationItem[];
  viewAllHref?: string;
  detailsHrefBase?: string;
}

export const FeaturedRecitationsSection: React.FC<FeaturedRecitationsSectionProps> = ({
  title,
  description,
  recitations,
  viewAllHref,
  detailsHrefBase,
}) => {
  return (
    <section className="bg-[#f6f4f1] py-12 sm:py-16 md:py-20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="text-display-xs sm:text-display-sm font-semibold leading-tight text-black md:text-display-md">
              {title}
            </h2>
            <p className="max-w-width-lg text-md sm:text-lg text-[#343434] md:text-xl">
              {description}
            </p>
          </div>
          {viewAllHref && (
            <Button variant="surface" size="md" asChild>
              <a href={viewAllHref}>جميع التلاوات</a>
            </Button>
          )}
        </div>

        {/* Audio Player */}
        {recitations.length > 0 && (
          <RecitationsPlayer
            recitations={recitations}
            defaultSelected={recitations[0]?.id}
            detailsHrefBase={detailsHrefBase}
            variant="featured"
          />
        )}
      </div>
    </section>
  );
};
