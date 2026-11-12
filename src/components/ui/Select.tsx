/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { forwardRef } from 'react';
import { AlertCircle, ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label: string;
  options: (string | SelectOption)[];
  placeholder?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      id,
      label,
      options,
      placeholder,
      error,
      hint,
      required,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const errorId = error ? `${id}-error` : undefined;
    const hintId = hint ? `${id}-hint` : undefined;
    const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined;

    return (
      <div className="w-full flex flex-col gap-1.5">
        <label
          htmlFor={id}
          className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200"
        >
          {label}
          {required && (
            <span className="text-rose-500 ml-1" aria-hidden="true">
              *
            </span>
          )}
          {required && <span className="sr-only"> (required)</span>}
        </label>

        <div className="relative">
          <select
            ref={ref}
            id={id}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            aria-required={required}
            className={`w-full min-h-[42px] px-3.5 py-2 pr-10 text-sm bg-white dark:bg-[#111A2E] text-slate-900 dark:text-slate-100 rounded-lg border appearance-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4F46E5] ${
              error
                ? 'border-rose-400 focus-visible:outline-rose-500 dark:border-rose-600'
                : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600'
            } ${className}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => {
              const val = typeof opt === 'string' ? opt : opt.value;
              const lbl = typeof opt === 'string' ? opt : opt.label;
              return (
                <option key={val} value={val} className="text-slate-900 dark:text-slate-100 bg-white dark:bg-[#111A2E]">
                  {lbl}
                </option>
              );
            })}
          </select>
          <ChevronDown
            className="w-4 h-4 text-slate-400 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
            aria-hidden="true"
          />
        </div>

        {hint && !error && (
          <p id={hintId} className="text-xs text-slate-500 dark:text-slate-400">
            {hint}
          </p>
        )}

        {error && (
          <div
            id={errorId}
            role="alert"
            className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 mt-0.5 animate-in fade-in"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
