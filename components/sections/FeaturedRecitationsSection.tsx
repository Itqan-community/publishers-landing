'use client';

import React from 'react';
import { AudioPlayerComponent, RecitationItem } from '@/components/audio/AudioPlayer';
import { Button } from '@/components/ui/Button';

interface FeaturedRecitationsSectionProps {
  title: string;
  description: string;
  recitations: RecitationItem[];
  viewAllHref?: string;
}

export const FeaturedRecitationsSection: React.FC<FeaturedRecitationsSectionProps> = ({
  title,
  description,
  recitations,
  viewAllHref,
}) => {
  return (
    <section className="py-20 bg-white">
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
              <a href={viewAllHref}>جميع القراءات</a>
            </Button>
          )}
        </div>

        {/* Audio Player */}
        {recitations.length > 0 && (
          <AudioPlayerComponent
            recitations={recitations}
            defaultSelected={recitations[0]?.id}
          />
        )}
      </div>
    </section>
  );
};
