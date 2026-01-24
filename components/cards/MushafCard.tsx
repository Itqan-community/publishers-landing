import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { RecordedMushaf } from '@/types/tenant.types';
import { Badge } from '@/components/ui/Badge';

export interface MushafCardProps {
  mushaf: RecordedMushaf;
}

type RecordedMushafBadgeIcon = NonNullable<NonNullable<RecordedMushaf['badges']>[number]['icon']>;

function BadgeIcon({ kind }: { kind?: RecordedMushafBadgeIcon }) {
  switch (kind) {
    case 'book':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 19.5V6.5C4 5.12 5.12 4 6.5 4H20V20H6.5C5.12 20 4 18.88 4 17.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 17.5C4 16.12 5.12 15 6.5 15H20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'sparkle':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 2l1.6 6.1L20 10l-6.4 1.9L12 18l-1.6-6.1L4 10l6.4-1.9L12 2z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'mic':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M19 11a7 7 0 0 1-14 0"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M12 18v4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'headphones':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 12a8 8 0 0 1 16 0v7a2 2 0 0 1-2 2h-1v-7h3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M7 21H6a2 2 0 0 1-2-2v-7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M7 14v7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    default:
      return null;
  }
}

export const MushafCard: React.FC<MushafCardProps> = ({ mushaf }) => {
  const { title, description, reciter, visuals, badges, href } = mushaf;

  const content = (
    <div className="w-full h-full overflow-hidden bg-white rounded-[10px] border border-[#ebe8e8] shadow-none">
      {/* Top section (colored background) */}
      <div
        className="relative h-[226px] flex items-center justify-center"
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
            <div className="relative w-[67px] h-[67px] rounded-full overflow-hidden ring-[2px] ring-white">
              <Image
                src={reciter.avatarImage}
                alt={reciter.name}
                fill
                className="object-cover"
                sizes="67px"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section (plain white) */}
      <div className="p-4 text-right">
        {/* Row 1: name */}
        <h3 className="text-[20px] font-semibold text-black leading-[1.4]">
          {title}
        </h3>

        {/* Row 2: description */}
        <p className="mt-2 text-[12px] leading-[16px] text-[#343434] font-normal">
          {description}
        </p>

        {/* Row 3: badges */}
        {badges && badges.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 text-[10px] text-[#343434]">
            {badges.map((b) => (
              <Badge key={b.id} tone="green" shape="soft">
                {b.label}
              </Badge>
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
