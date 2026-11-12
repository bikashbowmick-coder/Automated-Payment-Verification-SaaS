/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { forwardRef } from 'react';
import { AlertCircle, Check } from 'lucide-react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  id: string;
  label: React.ReactNode;
  error?: string;
  hint?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ id, label, error, hint, className = '', checked, onChange, disabled, ...props }, ref) => {
    const errorId = error ? `${id}-error` : undefined;
    const hintId = hint ? `${id}-hint` : undefined;

    return (
      <div className="flex flex-col gap-1">
        <label
          htmlFor={id}
          className={`flex items-start gap-2.5 cursor-pointer text-xs sm:text-sm select-none ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <div className="relative flex items-center justify-center mt-0.5 shrink-0">
            <input
              ref={ref}
              type="checkbox"
              id={id}
              checked={checked}
              onChange={onChange}
              disabled={disabled}
              aria-invalid={Boolean(error)}
              aria-describedby={[errorId, hintId].filter(Boolean).join(' ') || undefined}
              className="peer sr-only"
              {...props}
            />
            <div
              className={`w-4 h-4 rounded border transition-colors flex items-center justify-center peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-[#4F46E5] ${
                checked
                  ? 'bg-[#14595A] border-[#14595A] text-white'
                  : 'bg-white dark:bg-[#111A2E] border-slate-300 dark:border-slate-700 hover:border-slate-400'
              } ${error ? 'border-rose-400 dark:border-rose-600' : ''}`}
            >
              {checked && <Check className="w-3 h-3 stroke-[3]" aria-hidden="true" />}
            </div>
          </div>
          <span className="text-slate-700 dark:text-slate-300 leading-normal">{label}</span>
        </label>

        {hint && !error && (
          <p id={hintId} className="text-xs text-slate-500 dark:text-slate-400 ml-6.5">
            {hint}
          </p>
        )}

        {error && (
          <div
            id={errorId}
            role="alert"
            className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 ml-6.5 animate-in fade-in"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
