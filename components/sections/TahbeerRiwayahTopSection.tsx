import React from 'react';
import { ImamInfoCard } from '@/components/cards/ImamInfoCard';

export interface TahbeerRiwayahTopSectionProps {
  title: string;
  description: string;
  imam: {
    name: string;
    label: string;
    bio: string;
    avatarSrc?: string;
  };
}

/**
 * Tahbeer riwayah page top section (Figma node 4021:1738).
 * Hero-like background, centered title + description, ImamInfoCard. No search.
 */
export const TahbeerRiwayahTopSection: React.FC<TahbeerRiwayahTopSectionProps> = ({
  title,
  description,
  imam,
}) => {
  return (
    <section
      className="relative overflow-hidden py-10 sm:py-14 lg:pt-header lg:pb-20"
      aria-labelledby="riwayah-heading"
      dir="rtl"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[url('/images/hero-bg.svg')] bg-right-top bg-cover bg-no-repeat opacity-100 [mask-image:linear-gradient(to_bottom_left,#000_0%,#000_24%,transparent_88%)] [-webkit-mask-image:linear-gradient(to_bottom_left,#000_0%,#000_24%,transparent_88%)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <h1
          id="riwayah-heading"
          className="text-center text-[28px] sm:text-[33px] lg:text-[39px] font-semibold text-[var(--color-foreground)] leading-tight"
        >
          {title}
        </h1>
        <p className="mx-auto mt-4 sm:mt-8 max-w-2xl text-center text-[18px] sm:text-[24px] lg:text-[29px] font-normal text-[var(--color-text-paragraph)]">
          {description}
        </p>
        <div className="mt-8 sm:mt-10 w-full">
          <ImamInfoCard
            label={imam.label}
            name={imam.name}
            bio={imam.bio}
            avatarSrc={imam.avatarSrc}
          />
        </div>
      </div>
    </section>
  );
};
