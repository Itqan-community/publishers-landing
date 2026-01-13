import React from 'react';

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
      'inline-flex items-center justify-center font-semibold tracking-tight transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-md';

    const variants = {
      primary: 'bg-primary text-white hover:bg-primary-dark shadow-md',
      secondary: 'bg-secondary text-white hover:bg-secondary-dark shadow-sm',
      outline:
        'border border-primary/25 text-primary bg-white hover:bg-primary/5 shadow-sm',
      surface:
        'bg-white text-primary border border-gray-200 shadow-sm hover:shadow-md hover:bg-gray-50',
      ghost: 'text-primary hover:bg-primary/5',
      link: 'text-primary underline-offset-4 hover:underline',
    };

    const sizes = {
      sm: 'h-10 px-4 text-sm leading-[20px]',
      md: 'h-11 px-5 text-base leading-[22px]',
      lg: 'h-12 px-6 text-lg leading-[24px]',
      icon: 'h-11 w-11 text-base',
    };

    const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        ...props,
        className: `${classes} ${children.props.className || ''}`,
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
