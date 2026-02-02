'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface BouncingDotsProps {
  className?: string;
  dotClassName?: string;
  /** Accessible label for the loading indicator */
  'aria-label'?: string;
}

/**
 * Three bouncing dots loading indicator.
 * Uses staggered animation delays for a wave effect.
 */
export function BouncingDots({
  className,
  dotClassName,
  'aria-label': ariaLabel = 'جاري التحميل',
}: BouncingDotsProps) {
  return (
    <div
      className={cn('flex items-center justify-center gap-1.5', className)}
      role="status"
      aria-label={ariaLabel}
      aria-live="polite"
    >
      <span
        className={cn(
          'size-2 rounded-full bg-primary motion-safe:animate-bounce',
          dotClassName
        )}
        style={{ animationDelay: '0ms' }}
      />
      <span
        className={cn(
          'size-2 rounded-full bg-primary motion-safe:animate-bounce',
          dotClassName
        )}
        style={{ animationDelay: '150ms' }}
      />
      <span
        className={cn(
          'size-2 rounded-full bg-primary motion-safe:animate-bounce',
          dotClassName
        )}
        style={{ animationDelay: '300ms' }}
      />
    </div>
  );
}
