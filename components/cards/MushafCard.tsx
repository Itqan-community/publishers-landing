import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { RecordedMushaf } from '@/types/tenant.types';
import { AvatarImage } from '@/components/ui/AvatarImage';

export interface MushafCardProps {
  mushaf: RecordedMushaf;
}

export const MushafCard: React.FC<MushafCardProps> = ({ mushaf }) => {
  const { title, description, reciter, visuals, badges, year, href } = mushaf;

  const content = (
    <div className="relative h-[348px] w-full rounded-[10px] border border-[#ebe8e8] bg-white">
      {/* Top section with colored background */}
      <div
        className="relative h-[226px] w-full overflow-hidden rounded-t-[10px] flex items-center justify-center"
        style={{ backgroundColor: visuals.topBackgroundColor }}
      >
        {/* Big mushaf icon + overlapping avatar */}
        <div className="relative z-10 w-[136px] h-[150px]" aria-hidden="true">
          <Image
            src="/icons/big-mushaf.svg"
            alt=""
            fill
            className="object-contain"
            sizes="136px"
          />

          {/* Avatar overlaps top-start (RTL start = right) by 50% */}
          <div className="absolute top-0 right-0 translate-x-[30%] -translate-y-[30%]">
            <div className="relative w-[67px] h-[67px] rounded-full overflow-hidden ring-[2px] ring-white bg-white">
              <AvatarImage
                src={reciter.avatarImage}
                alt={reciter.name}
                fill
                className="object-cover"
                sizes="67px"
                iconSize="h-8 w-8"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Bottom section */}
      <div className="px-4 py-4 text-end">
        <h3 className="text-[20px] font-semibold text-black">{title}</h3>
        <p className="mt-2 text-[12px] text-[#343434]">{description}</p>
        {/* Badges */}
        {badges && badges.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center justify-end gap-2 text-[10px] text-[#343434]">
            {year && (
              <span className="rounded-[6px] bg-[#f3f3f3] px-2 py-1">سنة {year}</span>
            )}
            {badges.map((b) => (
              <span key={b.id} className="rounded-[6px] bg-[#f3f3f3] px-2 py-1">
                {b.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Link href={href} className="block h-full">
      {content}
    </Link>
  );
};
