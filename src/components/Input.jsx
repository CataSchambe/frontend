import React, { forwardRef } from 'react';

export const Input = forwardRef(
  (
    {
      label,
      badge,
      error,
      icon: Icon,
      rightElement,
      className = '',
      id,
      type = 'text',
      ...props
    },
    ref
  ) => {
    const inputId = id || props.name;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <div className="flex items-center justify-between">
            <label
              htmlFor={inputId}
              className="text-xs font-semibold text-text-main tracking-wide"
            >
              {label}
            </label>
            {badge && (
              <span className="text-[10px] font-semibold text-accent-cyan bg-accent-cyan/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                {badge}
              </span>
            )}
          </div>
        )}

        <div className="relative flex items-center w-full">
          {Icon && (
            <div className="absolute left-3 text-text-muted pointer-events-none flex items-center justify-center">
              <Icon className="w-4 h-4" />
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            className={`w-full py-2 bg-bg-surface text-text-main placeholder:text-text-muted/60 text-sm rounded-lg border transition-all duration-150 focus:outline-none focus:bg-bg-card ${
              Icon ? 'pl-9' : 'pl-3.5'
            } ${rightElement ? 'pr-10' : 'pr-3.5'} ${
              error
                ? 'border-status-danger focus:ring-1 focus:ring-status-danger'
                : 'border-border-subtle focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan'
            } ${className}`}
            {...props}
          />

          {rightElement && (
            <div className="absolute right-2.5 flex items-center justify-center">
              {rightElement}
            </div>
          )}
        </div>

        {error && (
          <span className="text-xs text-status-danger font-medium mt-0.5">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
