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
    <section className="bg-[#f6f4f1] py-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:gap-10">
            <h2 className="font-primary text-[32px] font-semibold leading-[1.4] text-black md:text-[39px]">
              {title}
            </h2>
            <p className="max-w-[320px] font-primary text-[18px] leading-[30.4px] text-[#343434] md:text-[20px]">
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
