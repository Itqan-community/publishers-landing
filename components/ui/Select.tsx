import React from 'react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** Size preset */
  selectSize?: 'sm' | 'md';
  /** Icon rendered at the start of the select */
  startIcon?: React.ReactNode;
  /** Options array for convenience — or pass <option> children */
  options?: Array<{ value: string; label: string }>;
  children?: React.ReactNode;
}

// Default dropdown arrow
function ChevronDown({ className }: { className?: string }) {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M5.99975 8.99986L11.9998 14.9998L17.9997 8.99981"
        stroke="currentColor"
        strokeMiterlimit="16"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/**
 * Select atom — styled native <select> with custom arrow and optional start icon.
 *
 * Uses KSA gov tokens for sizing, radius, and typography.
 * RTL-aware layout.
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      selectSize = 'md',
      startIcon,
      options,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const sizes: Record<NonNullable<SelectProps['selectSize']>, string> = {
      sm: 'h-10 text-sm',
      md: 'h-12 text-md',
    };

    const hasStartIcon = !!startIcon;

    return (
      <div className={`relative flex items-center ${className}`}>
        {startIcon && (
          <span className="pointer-events-none absolute start-3 flex items-center text-[var(--color-foreground)]">
            {startIcon}
          </span>
        )}
        <select
          ref={ref}
          className={[
            'w-full cursor-pointer appearance-none [-webkit-appearance:none]',
            'rounded-sm bg-[var(--color-bg-neutral-100)]',
            'text-[var(--color-foreground)] font-semibold text-start',
            'outline-none',
            'focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-1',
            'transition-colors duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            sizes[selectSize],
            hasStartIcon ? 'ps-10' : 'ps-4',
            'pe-10', // always leave room for the chevron
          ].join(' ')}
          {...props}
        >
          {options
            ? options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))
            : children}
        </select>
        <span className="pointer-events-none absolute end-3 flex items-center text-[var(--color-foreground)]">
          <ChevronDown className="h-5 w-5" />
        </span>
      </div>
    );
  }
);

Select.displayName = 'Select';
