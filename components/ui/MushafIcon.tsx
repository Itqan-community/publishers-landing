'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface MushafIconProps {
  className?: string;
  /** Flip horizontally so the icon faces the correct direction in RTL. Applied in one place so all usages are consistent. */
  flipHorizontal?: boolean;
  sizes?: string;
}

const MUSHAF_ICON_SRC = '/icons/big-mushaf.svg';

/**
 * Big mushaf icon used on cards and elsewhere.
 * Rendered flipped horizontally by default so it faces correctly in RTL; use one component so all usages stay consistent.
 */
export function MushafIcon({
  className,
  flipHorizontal = true,
  sizes = '136px',
}: MushafIconProps) {
  return (
    <Image
      src={MUSHAF_ICON_SRC}
      alt=""
      fill
      className={cn(
        'object-contain',
        flipHorizontal && 'scale-x-[-1]',
        className
      )}
      sizes={sizes}
      aria-hidden
    />
  );
}
