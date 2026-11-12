/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      id,
      label,
      error,
      hint,
      required,
      leftIcon,
      rightElement,
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
        <div className="flex items-center justify-between">
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
        </div>

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 pointer-events-none text-slate-400 dark:text-slate-500">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            aria-required={required}
            className={`w-full min-h-[42px] px-3.5 py-2 text-sm bg-white dark:bg-[#111A2E] text-slate-900 dark:text-slate-100 rounded-lg border transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4F46E5] ${
              leftIcon ? 'pl-10' : ''
            } ${rightElement ? 'pr-11' : ''} ${
              error
                ? 'border-rose-400 focus-visible:outline-rose-500 dark:border-rose-600'
                : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600'
            } ${className}`}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-2 flex items-center">
              {rightElement}
            </div>
          )}
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

TextField.displayName = 'TextField';
