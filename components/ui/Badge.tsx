import React from 'react';

export type BadgeTone = 'green' | 'gold' | 'gray';
export type BadgeSize = 'sm' | 'md';
export type BadgeShape = 'pill' | 'soft';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Visual tone (colors) must stay consistent with Figma tokens.
   */
  tone?: BadgeTone;
  size?: BadgeSize;
  shape?: BadgeShape;
  icon?: React.ReactNode;
}

const toneClass: Record<BadgeTone, string> = {
  gold: 'bg-[#faaf41]/15 text-[#a46b00]',
  gray: 'bg-black/5 text-black/70',
  green: 'bg-[#193624]/10 text-[#193624]',
};

const sizeClass: Record<BadgeSize, string> = {
  sm: 'px-3 py-[2px] text-[13px]',
  md: 'px-3.5 py-[2px] text-[14px]',
};

const shapeClass: Record<BadgeShape, string> = {
  pill: 'rounded-full',
  soft: 'rounded-[6px]',
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


