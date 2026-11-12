/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { Camera, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { MAX_AVATAR_BYTES } from '../../../lib/constants.ts';
import { useI18n } from '../../../locales/I18nContext.tsx';

export interface AvatarUploaderProps {
  currentAvatarUrl?: string;
  fullName?: string;
  onAvatarChanged: (file: File) => Promise<void>;
  onAvatarRemoved: () => Promise<void>;
}

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  currentAvatarUrl,
  fullName = '',
  onAvatarChanged,
  onAvatarRemoved,
}) => {
  const { t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'U';
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError(t('avatar_type_error'));
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validate size (2MB)
    if (file.size > MAX_AVATAR_BYTES) {
      setError(t('avatar_size_error'));
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Client-side square preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    setIsUploading(true);
    try {
      await onAvatarChanged(file);
    } catch {
      setError(t('toast_generic_error'));
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async () => {
    setError(null);
    setIsUploading(true);
    try {
      await onAvatarRemoved();
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch {
      setError(t('toast_generic_error'));
    } finally {
      setIsUploading(false);
    }
  };

  const displayUrl = previewUrl || currentAvatarUrl;

  return (
    <div className="flex flex-col gap-3">
      <label className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">
        {t('avatar_upload_title')}
      </label>

      <div className="flex items-center gap-4">
        {/* Avatar Square Container */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shrink-0">
          {displayUrl ? (
            <img
              src={displayUrl}
              alt={fullName ? `${fullName}'s avatar` : 'Profile avatar'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-bold text-xl sm:text-2xl text-[#14595A] dark:text-teal-400">
              {getInitials(fullName)}
            </div>
          )}

          {isUploading && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center text-white">
              <Loader2 className="w-6 h-6 animate-spin" aria-hidden="true" />
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              id="avatar-file-input"
              onChange={handleFileSelect}
              disabled={isUploading}
            />
            <label
              htmlFor="avatar-file-input"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors focus-within:outline focus-within:outline-2 focus-within:outline-[#4F46E5] ${
                isUploading ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              <Camera className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t('avatar_change')}</span>
            </label>

            {displayUrl && (
              <button
                type="button"
                onClick={handleRemove}
                disabled={isUploading}
                aria-label={t('avatar_remove')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-500"
              >
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{t('avatar_remove')}</span>
              </button>
            )}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {t('avatar_upload_instructions')}
          </p>
        </div>
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
