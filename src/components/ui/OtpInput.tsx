/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

export interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  error?: string;
  id?: string;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  value = '',
  onChange,
  onComplete,
  disabled = false,
  error,
  id = 'otp-input',
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Keep array of characters padded to length
  const digits = Array.from({ length }, (_, i) => value[i] || '');

  useEffect(() => {
    // Focus first empty input on mount if not disabled
    const firstEmptyIndex = digits.findIndex((d) => !d);
    const targetIndex = firstEmptyIndex === -1 ? 0 : firstEmptyIndex;
    if (inputRefs.current[targetIndex] && !disabled) {
      inputRefs.current[targetIndex]?.focus();
    }
  }, []);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/\D/g, ''); // Numeric only
    if (!inputValue) return;

    const char = inputValue[inputValue.length - 1]; // get latest entered char
    const newDigits = [...digits];
    newDigits[index] = char;
    const nextOtp = newDigits.join('').slice(0, length);
    onChange(nextOtp);

    if (nextOtp.length === length && onComplete) {
      onComplete(nextOtp);
    }

    // Auto advance to next box
    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newDigits = [...digits];
      if (newDigits[index]) {
        newDigits[index] = '';
        onChange(newDigits.join(''));
      } else if (index > 0) {
        newDigits[index - 1] = '';
        onChange(newDigits.join(''));
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pastedData) return;

    onChange(pastedData);
    if (pastedData.length === length && onComplete) {
      onComplete(pastedData);
    }
    const focusTarget = Math.min(pastedData.length, length - 1);
    inputRefs.current[focusTarget]?.focus();
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        id={id}
        role="group"
        aria-label="One-Time Security Code"
        className="flex items-center justify-center gap-2 sm:gap-3"
      >
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            autoComplete="one-time-code"
            aria-label={`Digit ${index + 1} of ${length}`}
            disabled={disabled}
            value={digits[index]}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            className={`w-11 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold font-mono rounded-lg border bg-white dark:bg-[#111A2E] text-slate-900 dark:text-slate-100 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4F46E5] ${
              error
                ? 'border-rose-400 focus-visible:outline-rose-500 dark:border-rose-600'
                : digits[index]
                ? 'border-[#14595A] dark:border-teal-500'
                : 'border-slate-300 dark:border-slate-700'
            }`}
          />
        ))}
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 mt-1 animate-in fade-in"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
