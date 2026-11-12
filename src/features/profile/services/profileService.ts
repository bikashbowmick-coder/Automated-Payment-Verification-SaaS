/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProfile } from '../../../lib/types.ts';
import { simulateNetwork } from '../../../lib/devSimulator.ts';
import { getStoredUser, setStoredUser } from '../../auth/services/authService.ts';

export const profileService = {
  async getProfile(): Promise<UserProfile> {
    return simulateNetwork(() => {
      return getStoredUser();
    });
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    return simulateNetwork(() => {
      const current = getStoredUser();
      const updated: UserProfile = { ...current, ...updates };
      setStoredUser(updated);
      return updated;
    });
  },

  async uploadAvatar(file: File): Promise<string> {
    return simulateNetwork(async () => {
      // Create local data URL for client preview
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          const current = getStoredUser();
          setStoredUser({ ...current, avatarUrl: result });
          resolve(result);
        };
        reader.onerror = () => reject(new Error('AVATAR_READ_ERROR'));
        reader.readAsDataURL(file);
      });
    });
  },

  async removeAvatar(): Promise<void> {
    return simulateNetwork(() => {
      const current = getStoredUser();
      setStoredUser({ ...current, avatarUrl: '' });
    });
  },
};
