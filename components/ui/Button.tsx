import React from 'react';
import { PlayIcon } from './Icons';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'surface';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  children: React.ReactNode;
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      className = '',
      children,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    // Font: IBM Plex Sans Arabic Medium, 16px, line-height 24px from Figma

    const variants = {
      primary: 'bg-[#193624] text-white hover:bg-[#102516] rounded-[4px]', // Primary green, radius-sm 4px
      secondary: 'bg-[#0d121c] text-white hover:bg-[#090d15] rounded-[4px]', // Black button, radius-sm 4px
      outline:
        'border border-primary/25 text-primary bg-white hover:bg-primary/5 shadow-sm rounded-[4px]',
      surface:
        'bg-white text-[#161616] border border-[#ebe8e8] shadow-sm hover:shadow-md hover:bg-gray-50 rounded-[4px]',
      ghost: 'text-primary hover:bg-primary/5 rounded-[4px]',
      link: 'text-primary underline-offset-4 hover:underline',
    };

    const sizes = {
      sm: 'h-[40px] px-4 text-[16px] leading-[24px]', // Figma: 40px height, 16px padding, 16px font, 24px line-height
      md: 'h-[40px] px-4 text-[16px] leading-[24px]', // Same as sm per Figma
      lg: 'h-[40px] px-4 text-[16px] leading-[24px]', // Same as sm per Figma
      icon: 'h-[40px] w-[40px] text-[16px]',
    };

    const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<{ className?: string }>;

      return React.cloneElement(child, {
        ...props,
        className: `${classes} ${child.props.className || ''}`,
        ref,
      } as any);
    }

    // Add play icon to primary button (from Figma design)
    const showPlayIcon = variant === 'primary' && size !== 'icon';

    return (
      <button ref={ref} className={`${classes} ${showPlayIcon ? 'gap-1' : ''}`} {...props}>
        {showPlayIcon ? (
          <span className="flex items-center gap-1">
            <PlayIcon className="w-6 h-6 flex-shrink-0" />
            {children}
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
