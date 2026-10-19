import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'gradient',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  type = 'button',
  icon: Icon,
  ...props
}) => {
  // Variantes de estilo alineadas a DESIGN.md y code.html
  const variantStyles = {
    gradient:
      'bg-gradient-to-r from-accent-cyan to-accent-purple hover:brightness-105 active:scale-[0.99] text-white shadow-md shadow-accent-cyan/20 border-none',
    cyan: 'bg-accent-cyan hover:brightness-105 text-white dark:text-gray-950 font-semibold shadow-sm',
    purple: 'bg-accent-purple hover:brightness-105 text-white font-semibold shadow-sm',
    secondary:
      'bg-bg-surface hover:bg-surface-hover text-text-main border border-border-subtle active:scale-[0.99]',
    ghost:
      'bg-transparent hover:bg-surface-hover text-text-muted hover:text-text-main border-none',
    danger:
      'bg-status-danger/15 hover:bg-status-danger/25 text-status-danger border border-status-danger/30 font-medium',
  };

  const sizeStyles = {
    sm: 'px-2.5 py-1.5 text-xs rounded-md gap-1.5',
    md: 'px-4 py-2 text-sm rounded-lg gap-2',
    lg: 'px-5 py-2.5 text-base rounded-lg gap-2.5',
    icon: 'p-2 rounded-lg',
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`inline-flex items-center justify-center font-medium transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none ${variantStyles[variant] || variantStyles.gradient} ${sizeStyles[size] || sizeStyles.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : Icon ? (
        <Icon className="w-4 h-4 text-current" />
      ) : null}
      <span>{children}</span>
    </button>
  );
};

export default Button;
