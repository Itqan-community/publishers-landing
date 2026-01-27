'use client';

import React from 'react';
import Image from 'next/image';

export interface ReciterCardProps {
  id: string;
  name: string;
  title: string;
  image: string;
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
  return (
    <div className="relative h-full overflow-hidden rounded-[10px] bg-black cursor-default">
      <div className="relative w-full h-[380px]">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="absolute left-[13px] right-[13px] bottom-[16px] bg-white rounded-[10px] px-6 py-5">
        <h3 className="text-[24px] font-semibold text-black leading-tight">{name}</h3>
        <p className="text-[16px] text-[#343434] mt-2">{title}</p>
      </div>
    </div>
  );
};
