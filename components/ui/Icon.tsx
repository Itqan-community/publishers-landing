import React from 'react';
import { IconType } from 'react-icons';

export interface IconProps {
  icon: IconType;
  size?: number | string;
  className?: string;
  ariaLabel?: string;
}

export const Icon: React.FC<IconProps> = ({
  icon: IconComponent,
  size = 24,
  className = '',
  ariaLabel,
}) => {
  return (
    <IconComponent
      size={size}
      className={className}
      aria-label={ariaLabel}
      role="img"
    />
  );
};
