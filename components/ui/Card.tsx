import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  hover = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-2xl transition-all duration-200 bg-white';

  const variants = {
    default: 'shadow-sm',
    elevated: 'shadow-lg',
    outlined: 'border border-gray-200 shadow-sm',
  };

  const hoverStyles = hover
    ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer'
    : '';

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
