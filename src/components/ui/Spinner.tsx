/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  label = 'Loading...',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div role="status" className={`inline-flex items-center justify-center ${className}`}>
      <Loader2 className={`${sizeMap[size]} animate-spin text-[#14595A] dark:text-teal-400`} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </div>
  );
};
