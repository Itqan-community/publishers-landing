'use client';

import React, { useState } from 'react';
import Image from 'next/image';

const UserIcon = ({ className = "h-full w-full" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface AvatarImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  iconSize?: string;
}

export const AvatarImage: React.FC<AvatarImageProps> = ({
  src,
  alt,
  className = '',
  fill = false,
  sizes,
  priority = false,
  iconSize = 'h-8 w-8',
}) => {
  const [hasError, setHasError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!src || hasError) {
    return (
      <div className={`absolute inset-0 flex items-center justify-center text-[#6a6a6a] ${className}`}>
        <UserIcon className={iconSize} />
      </div>
    );
  }

  return (
    <>
      {!imageLoaded && (
        <div className={`absolute inset-0 flex items-center justify-center text-[#6a6a6a] ${className}`}>
          <UserIcon className={iconSize} />
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        className={className}
        sizes={sizes}
        priority={priority}
        onError={() => setHasError(true)}
        onLoad={() => setImageLoaded(true)}
        style={{ display: imageLoaded ? 'block' : 'none' }}
      />
    </>
  );
};
