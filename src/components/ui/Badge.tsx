/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, XCircle, Info } from 'lucide-react';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  children,
  icon,
  className = '',
  size = 'md',
}) => {
  const defaultIcons = {
    success: <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />,
    warning: <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />,
    danger: <XCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />,
    info: <Info className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />,
    neutral: <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />,
  };

  const variantStyles = {
    success:
      'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50',
    warning:
      'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50',
    danger:
      'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/50',
    info:
      'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/50',
    neutral:
      'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  const renderIcon = icon !== undefined ? icon : defaultIcons[variant];

  return (
    <span
      className={`inline-flex items-center font-medium border rounded-md select-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {renderIcon}
      <span>{children}</span>
    </span>
  );
};
