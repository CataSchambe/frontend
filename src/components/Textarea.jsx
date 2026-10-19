import React, { forwardRef } from 'react';

export const Textarea = forwardRef(
  ({ label, badge, error, className = '', id, rows = 3, ...props }, ref) => {
    const textareaId = id || props.name;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <div className="flex items-center justify-between">
            <label
              htmlFor={textareaId}
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

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={`w-full py-2 px-3.5 bg-bg-surface text-text-main placeholder:text-text-muted/60 text-sm rounded-lg border transition-all duration-150 focus:outline-none focus:bg-bg-card resize-y ${
            error
              ? 'border-status-danger focus:ring-1 focus:ring-status-danger'
              : 'border-border-subtle focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan'
          } ${className}`}
          {...props}
        />

        {error && (
          <span className="text-xs text-status-danger font-medium mt-0.5">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
