import React from 'react';
import Link from 'next/link';
import type { RecordedMushaf } from '@/types/tenant.types';
import { MushafIcon } from '@/components/ui/MushafIcon';
import { Button } from '@/components/ui/Button';

export interface MushafCardProps {
  mushaf: RecordedMushaf;
}

export const MushafCard: React.FC<MushafCardProps> = ({ mushaf }) => {
  const { title, description, reciter, visuals, badges, year, href } = mushaf;

  return (
    <div className="relative h-[348px] w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg-card)] flex flex-col">
      {/* Top section with colored background */}
      <div
        className="relative h-[226px] w-full overflow-hidden rounded-t-md flex items-center justify-center"
        style={{ backgroundColor: visuals.topBackgroundColor }}
      >
        <div className="relative z-10 w-[50%] h-[70%]" aria-hidden="true">
          <MushafIcon sizes="136px" />
        </div>
      </div>
      {/* Bottom section */}
      <div className="px-4 py-4 text-start flex flex-col flex-1">
        <h3 className="text-xl font-semibold text-[var(--color-foreground)]">{title}</h3>
        <p className="mt-2 text-xs text-[var(--color-text-secondary)]">{description}</p>
        {/* Badges */}
        {badges && badges.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center justify-start gap-2 text-xs text-[var(--color-text-secondary)]">
            {year && (
              <span className="rounded-sm bg-[var(--color-bg-neutral-100)] px-2 py-1">سنة {year}</span>
            )}
            {badges.map((b) => (
              <span key={b.id} className="rounded-sm bg-[var(--color-bg-neutral-100)] px-2 py-1">
                {b.label}
              </span>
            ))}
          </div>
        )}
        {/* CTA button */}
        <div className="mt-auto pt-3">
          <Button variant="outline" size="sm" asChild className="w-full">
            <Link href={href}>استمع</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
