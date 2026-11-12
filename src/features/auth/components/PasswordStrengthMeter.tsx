/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { ShieldAlert, ShieldCheck, Shield } from 'lucide-react';
import { calculatePasswordStrength } from '../../../lib/passwordStrength.ts';
import { useI18n } from '../../../locales/I18nContext.tsx';

export interface PasswordStrengthMeterProps {
  password?: string;
  className?: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password = '',
  className = '',
}) => {
  const { t } = useI18n();
  const strength = useMemo(() => calculatePasswordStrength(password), [password]);

  if (!password) {
    return null;
  }

  const scoreColors = [
    'bg-slate-200 dark:bg-slate-700', // 0
    'bg-rose-500', // 1 Weak
    'bg-amber-500', // 2 Fair
    'bg-teal-600', // 3 Strong
    'bg-emerald-600', // 4 Very strong
  ];

  const scoreTextColors = [
    'text-slate-500 dark:text-slate-400',
    'text-rose-600 dark:text-rose-400',
    'text-amber-600 dark:text-amber-400',
    'text-teal-700 dark:text-teal-400',
    'text-emerald-700 dark:text-emerald-400',
  ];

  const strengthIcons = [
    <ShieldAlert key="0" className="w-4 h-4 shrink-0" aria-hidden="true" />,
    <ShieldAlert key="1" className="w-4 h-4 shrink-0" aria-hidden="true" />,
    <Shield key="2" className="w-4 h-4 shrink-0" aria-hidden="true" />,
    <ShieldCheck key="3" className="w-4 h-4 shrink-0" aria-hidden="true" />,
    <ShieldCheck key="4" className="w-4 h-4 shrink-0" aria-hidden="true" />,
  ];

  return (
    <div className={`mt-1.5 space-y-1.5 ${className}`} aria-live="polite">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500 dark:text-slate-400">Password strength:</span>
        <div className={`flex items-center gap-1.5 font-medium ${scoreTextColors[strength.score]}`}>
          {strengthIcons[strength.score]}
          <span>{t(strength.labelKey)}</span>
        </div>
      </div>

      {/* 4 segment bars */}
      <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
        {[1, 2, 3, 4].map((step) => {
          const isActive = strength.score >= step;
          return (
            <div
              key={step}
              className={`h-full rounded-full transition-colors duration-200 ${
                isActive ? scoreColors[strength.score] : 'bg-slate-200 dark:bg-slate-800'
              }`}
            />
          );
        })}
      </div>

      {/* Actionable recommendations */}
      {strength.feedback.length > 0 && (
        <ul className="text-[11px] text-slate-500 dark:text-slate-400 space-y-0.5 pt-0.5">
          {strength.feedback.map((itemKey) => (
            <li key={itemKey} className="flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-500" />
              <span>{t(itemKey)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
