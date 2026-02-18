'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

/** Person/muslim silhouette for avatar fallback — Tahbeer style */
const PersonIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export interface ImamInfoCardProps {
  label: string;
  name: string;
  bio: string;
  avatarSrc?: string;
}

/**
 * Tahbeer imam info card (Figma node 4023:454).
 * RTL: avatar (circle) | label + name | opening quote | bio | closing quote.
 */
export const ImamInfoCard: React.FC<ImamInfoCardProps> = ({
  label,
  name,
  bio,
  avatarSrc,
}) => {
  const [imageError, setImageError] = useState(false);
  useEffect(() => setImageError(false), [avatarSrc]);
  const showImage = avatarSrc?.trim() && !imageError;

  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 rounded-[16px] sm:rounded-[20px] border border-[#e7e7e7] bg-white p-4 sm:p-6 text-start shadow-[0px_14px_44px_rgba(0,0,0,0.07)]"
      dir="rtl"
    >
      {/* 1. Avatar + label/name row on mobile; same row on desktop */}
      <div className="flex flex-row items-center gap-4 sm:gap-6 shrink-0 justify-center">
        <div
          className="flex h-16 w-16 sm:h-[97px] sm:w-[97px] flex-shrink-0 items-center justify-center rounded-full bg-[#EEF9F2]"
          aria-hidden
        >
          {showImage ? (
            <Image
              src={avatarSrc!}
              alt=""
              width={97}
              height={97}
              className="h-full w-full rounded-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <PersonIcon className="h-8 w-8 sm:h-12 sm:w-12 text-[#6a6a6a]" />
          )}
        </div>
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-xs sm:text-sm text-[#6a6a6a]">{label}</span>
          <h3 className="text-[18px] sm:text-[20px] font-semibold text-[var(--color-foreground)] leading-tight">
            {name}
          </h3>
        </div>
      </div>

      {/* 2. Flipped quotes for RTL: closing quote at start, opening at end */}
      <div className="flex min-w-0 flex-1 flex-row items-start gap-1 sm:gap-2 justify-center">
        <span className="text-2xl sm:text-[40px] font-serif leading-none text-[var(--color-primary)] shrink-0" aria-hidden>
          &rdquo;
        </span>
        <p className="flex-1 min-w-0 max-w-max text-[16px] sm:text-[20px] lg:text-[23px] leading-relaxed text-[#343434]">
          {bio}
        </p>
        <span className="text-2xl sm:text-[40px] font-serif leading-none text-[var(--color-primary)] shrink-0" aria-hidden>
          &ldquo;
        </span>
      </div>
    </div>
  );
};
