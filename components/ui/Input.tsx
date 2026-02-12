import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Visual variant */
  variant?: 'default' | 'search' | 'borderless';
  /** Size preset */
  inputSize?: 'sm' | 'md';
  /** Icon rendered at the start (inline-start) of the input */
  startIcon?: React.ReactNode;
  /** Icon rendered at the end (inline-end) of the input */
  endIcon?: React.ReactNode;
}

/**
 * Input atom — reusable text input with consistent styling.
 *
 * Uses KSA gov tokens for sizing, radius, and typography.
 * Supports RTL via logical CSS properties.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'default',
      inputSize = 'md',
      startIcon,
      endIcon,
      className = '',
      ...props
    },
    ref
  ) => {
    const sizes: Record<NonNullable<InputProps['inputSize']>, string> = {
      sm: 'h-10 text-sm',   // 40px
      md: 'h-12 text-md',   // 48px
    };

    const variants: Record<NonNullable<InputProps['variant']>, string> = {
      default:
        'rounded-sm border border-[var(--color-border)] bg-transparent ' +
        'focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]',
      search:
        'rounded-sm border border-[var(--color-border)] bg-transparent ' +
        'focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]',
      borderless:
        'rounded-none border-0 bg-transparent',
    };

    const hasStartIcon = !!startIcon;
    const hasEndIcon = !!endIcon;

    return (
      <div className="relative flex items-center">
        {startIcon && (
          <span className="pointer-events-none absolute start-3 flex items-center text-[var(--color-text-secondary)]">
            {startIcon}
          </span>
        )}
        <input
          ref={ref}
          className={[
            'w-full outline-none',
            'text-[var(--color-foreground)] placeholder:text-[var(--color-text-secondary)]',
            'transition-all duration-300',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            sizes[inputSize],
            variants[variant],
            hasStartIcon ? 'ps-10' : 'ps-4',
            hasEndIcon ? 'pe-10' : 'pe-4',
            className,
          ].join(' ')}
          {...props}
        />
        {endIcon && (
          <span className="pointer-events-none absolute end-3 flex items-center text-[var(--color-text-secondary)]">
            {endIcon}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
