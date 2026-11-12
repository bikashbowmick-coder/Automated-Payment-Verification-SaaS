/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SecurityOverview } from '../../../lib/types.ts';
import { simulateNetwork } from '../../../lib/devSimulator.ts';
import { INITIAL_SECURITY_OVERVIEW } from '../../../lib/mockData.ts';
import { getStoredUser } from '../../auth/services/authService.ts';

const SECURITY_KEY = 'mysas_security_overview';

export const securityService = {
  async getSecurityOverview(): Promise<SecurityOverview> {
    return simulateNetwork(() => {
      const user = getStoredUser();
      let overview = INITIAL_SECURITY_OVERVIEW;
      try {
        const raw = localStorage.getItem(SECURITY_KEY);
        if (raw) overview = JSON.parse(raw);
      } catch {
        // ignore
      }
      return {
        ...overview,
        emailVerified: user.emailVerified,
        twoFactorEnabled: user.twoFactorEnabled,
      };
    });
  },

  async changePassword(currentPassword: string, _newPassword: string): Promise<boolean> {
    return simulateNetwork(() => {
      if (!currentPassword || currentPassword.length < 6) {
        throw new Error('INVALID_CURRENT_PASSWORD');
      }
      try {
        const overview = {
          ...INITIAL_SECURITY_OVERVIEW,
          lastPasswordChangedAt: new Date().toISOString(),
        };
        localStorage.setItem(SECURITY_KEY, JSON.stringify(overview));
      } catch {
        // ignore
      }
      return true;
    });
  },
};
