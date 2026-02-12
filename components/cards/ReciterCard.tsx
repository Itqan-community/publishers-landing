'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const UserIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export interface ReciterCardProps {
  id: string;
  name: string;
  title: string;
  /** Image URL from API only; empty/missing shows person icon placeholder. */
  image?: string;
  publisher?: string;
  publisherUrl?: string;
  href?: string;
  onViewMore?: () => void;
}

export const ReciterCard: React.FC<ReciterCardProps> = ({
  id,
  name,
  title,
  image,
  publisher,
  publisherUrl,
  href,
  onViewMore,
}) => {
  const [imageError, setImageError] = useState(false);
  useEffect(() => {
    setImageError(false);
  }, [image]);
  const showImage = image && image.trim() && !imageError;

  return (
    <div className="relative h-full overflow-hidden rounded-[10px] bg-black cursor-default">
      <div className="relative w-full h-[380px] bg-[#1a1a1a] flex items-center justify-center">
        {showImage ? (
          <Image
            key={image}
            src={image}
            alt={`صورة القارئ ${name}`}
            fill
            loading="lazy"
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            onError={() => setImageError(true)}
          />
        ) : (
          <UserIcon className="h-24 w-24 text-[#6a6a6a]" />
        )}
      </div>
      <div className="absolute left-[13px] right-[13px] bottom-[16px] bg-white rounded-[10px] px-6 py-5">
        <h3 className="text-[24px] font-semibold text-black leading-tight">{name}</h3>
        <p className="text-[16px] text-[#343434] mt-2">{title}</p>
      </div>
    </div>
  );
};
