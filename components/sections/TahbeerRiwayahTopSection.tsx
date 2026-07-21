import React from 'react';
import { ImamInfoCard } from '@/components/cards/ImamInfoCard';

export type RiwayahTopAppearance = 'default' | 'qiraat-archive';

export interface TahbeerRiwayahTopSectionProps {
  title: string;
  description: string;
  imam: {
    name: string;
    label: string;
    bio: string;
    avatarSrc?: string;
  };
  /** `qiraat-archive` = paper calm + hairline. Default = Tahbeer chrome. */
  appearance?: RiwayahTopAppearance;
}

/**
 * Tahbeer riwayah page top section (Figma node 4021:1738).
 * Hero-like background, centered title + description, ImamInfoCard. No search.
 */
export const TahbeerRiwayahTopSection: React.FC<TahbeerRiwayahTopSectionProps> = ({
  title,
  description,
  imam,
  appearance = 'default',
}) => {
  const isArchive = appearance === 'qiraat-archive';

  return (
    <section
      className="relative overflow-hidden py-10 sm:py-14 lg:pt-header lg:pb-20"
      aria-labelledby="riwayah-heading"
      dir="rtl"
    >
      <div className="hero-bg-pattern" aria-hidden="true" />
      <div className="relative mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <h1
          id="riwayah-heading"
          className="text-center text-[28px] sm:text-[33px] lg:text-[39px] font-semibold text-[var(--color-foreground)] leading-tight"
        >
          {title}
        </h1>
        {isArchive && (
          <div
            className="mx-auto mt-4 h-px w-[64px] bg-[var(--color-rule-gold,#A68B4B)] opacity-60"
            aria-hidden="true"
          />
        )}
        {description ? (
          <p
            className={`mx-auto max-w-2xl text-center text-[18px] sm:text-[24px] lg:text-[29px] font-normal text-[var(--color-text-paragraph)] text-justify ${
              isArchive ? 'mt-4 sm:mt-6' : 'mt-4 sm:mt-8'
            }`}
          >
            {description}
          </p>
        ) : null}
        <div className={`${description ? 'mt-8 sm:mt-10' : isArchive ? 'mt-6 sm:mt-8' : 'mt-8 sm:mt-10'} w-full`}>
          <ImamInfoCard
            label={imam.label}
            name={imam.name}
            bio={imam.bio}
            avatarSrc={imam.avatarSrc}
            appearance={appearance}
          />
        </div>
      </div>
    </section>
  );
};
