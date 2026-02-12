import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'surface';
  /** Size preset — sm(32px), md(40px), lg(48px), icon(40px square) */
  size?: 'sm' | 'md' | 'lg' | 'icon';
  children: React.ReactNode;
  /** Render as child element (polymorphic) */
  asChild?: boolean;
}

/**
 * Button atom — the single source of truth for all clickable actions.
 *
 * - Variants control color/border/background
 * - Sizes control height, padding, and font-size (KSA gov button tokens)
 * - All interactive states handled: hover, focus-visible, active, disabled
 */
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
    const baseStyles = [
      'inline-flex items-center justify-center gap-1 font-medium',
      'transition-colors duration-200',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
      'active:opacity-90',
      'disabled:opacity-50 disabled:pointer-events-none',
    ].join(' ');

    const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
      primary:
        'bg-[var(--color-primary)] text-white rounded-sm ' +
        'hover:bg-[var(--color-primary-dark)]',
      secondary:
        'bg-[var(--color-button-black)] text-white rounded-sm ' +
        'hover:bg-[#090d15]',
      outline:
        'border border-primary/25 text-[var(--color-primary)] bg-white rounded-sm ' +
        'hover:bg-primary/5 shadow-sm',
      ghost:
        'text-[var(--color-primary)] rounded-sm ' +
        'hover:bg-primary/5',
      link:
        'text-[var(--color-primary)] underline-offset-4 ' +
        'hover:underline',
      surface:
        'bg-white text-[var(--color-foreground)] border border-[var(--color-border)] rounded-sm ' +
        'hover:bg-[var(--color-bg-neutral-50)]',
    };

    const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
      sm: 'h-8 px-2 text-sm',         // 32px, 8px padding, 14px font
      md: 'h-10 px-3 text-md',        // 40px, 12px padding, 16px font
      lg: 'h-12 px-4 text-md',        // 48px, 16px padding, 16px font
      icon: 'h-10 w-10 text-md',      // 40px square
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

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
