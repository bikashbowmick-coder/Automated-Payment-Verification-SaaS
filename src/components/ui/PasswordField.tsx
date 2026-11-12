/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { TextField, TextFieldProps } from './TextField.tsx';
import { PasswordStrengthMeter } from '../../features/auth/components/PasswordStrengthMeter.tsx';

export interface PasswordFieldProps extends Omit<TextFieldProps, 'type' | 'rightElement'> {
  showStrengthMeter?: boolean;
  passwordValue?: string;
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  (
    {
      id,
      label,
      showStrengthMeter = false,
      passwordValue = '',
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleButton = (
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        aria-pressed={showPassword}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4F46E5]"
      >
        {showPassword ? (
          <EyeOff className="w-4 h-4" aria-hidden="true" />
        ) : (
          <Eye className="w-4 h-4" aria-hidden="true" />
        )}
      </button>
    );

    return (
      <div className="w-full flex flex-col gap-1.5">
        <TextField
          ref={ref}
          id={id}
          label={label}
          type={showPassword ? 'text' : 'password'}
          leftIcon={<Lock className="w-4 h-4" />}
          rightElement={toggleButton}
          autoComplete={props.autoComplete || 'current-password'}
          {...props}
        />
        {showStrengthMeter && passwordValue !== undefined && (
          <PasswordStrengthMeter password={passwordValue} />
        )}
      </div>
    );
  }
);

PasswordField.displayName = 'PasswordField';
