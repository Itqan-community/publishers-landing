import React from 'react';

export type BadgeTone = 'green' | 'gold' | 'gray';
export type BadgeSize = 'sm' | 'md';
export type BadgeShape = 'pill' | 'soft';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  size?: BadgeSize;
  shape?: BadgeShape;
  icon?: React.ReactNode;
}

const toneClass: Record<BadgeTone, string> = {
  gold: 'bg-secondary/15 text-[var(--color-secondary-dark)]',
  gray: 'bg-black/5 text-black/70',
  green: 'bg-primary/10 text-[var(--color-primary)]',
};

const sizeClass: Record<BadgeSize, string> = {
  sm: 'px-3 py-0.5 text-xs',      // 12px font (gov text-xs)
  md: 'px-3.5 py-0.5 text-sm',    // 14px font (gov text-sm)
};

const shapeClass: Record<BadgeShape, string> = {
  pill: 'rounded-full',           // gov radius-full
  soft: 'rounded-sm',             // gov radius-sm (4px)
};

export const Badge: React.FC<BadgeProps> = ({
  tone = 'green',
  size = 'sm',
  shape = 'pill',
  icon,
  className = '',
  children,
  ...props
}) => {
  return (
    <span
      className={`inline-flex items-center gap-2 font-medium ${toneClass[tone]} ${sizeClass[size]} ${shapeClass[shape]} ${className}`}
      {...props}
    >
      {icon}
      <span>{children}</span>
    </span>
  );
};
