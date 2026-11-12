/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserSession, LoginEvent } from '../../../lib/types.ts';
import { simulateNetwork } from '../../../lib/devSimulator.ts';
import { INITIAL_SESSIONS, INITIAL_LOGIN_HISTORY } from '../../../lib/mockData.ts';

const SESSIONS_KEY = 'mysas_active_sessions';
const HISTORY_KEY = 'mysas_login_history';

const getStoredSessions = (): UserSession[] => {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return INITIAL_SESSIONS;
};

const setStoredSessions = (sessions: UserSession[]) => {
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch {
    // ignore
  }
};

const getStoredHistory = (): LoginEvent[] => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return INITIAL_LOGIN_HISTORY;
};

export interface HistoryFilterParams {
  status?: 'all' | 'success' | 'failed' | 'blocked';
  days?: number;
  page?: number;
  pageSize?: number;
}

export const sessionService = {
  async getSessions(): Promise<UserSession[]> {
    return simulateNetwork(() => {
      return getStoredSessions();
    });
  },

  async revokeSession(sessionId: string): Promise<boolean> {
    return simulateNetwork(() => {
      const list = getStoredSessions();
      const updated = list.filter((s) => s.id !== sessionId || s.isCurrent);
      setStoredSessions(updated);
      return true;
    });
  },

  async revokeOtherSessions(): Promise<boolean> {
    return simulateNetwork(() => {
      const list = getStoredSessions();
      const updated = list.filter((s) => s.isCurrent);
      setStoredSessions(updated);
      return true;
    });
  },

  async getLoginHistory(params: HistoryFilterParams = {}): Promise<{
    items: LoginEvent[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    return simulateNetwork(() => {
      const allEvents = getStoredHistory();
      const { status = 'all', days, page = 1, pageSize = 20 } = params;

      let filtered = [...allEvents];

      if (status !== 'all') {
        if (status === 'failed') {
          filtered = filtered.filter((e) => e.status === 'failed' || e.status === 'blocked');
        } else {
          filtered = filtered.filter((e) => e.status === status);
        }
      }

      if (days && days > 0) {
        const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
        filtered = filtered.filter((e) => new Date(e.occurredAt).getTime() >= cutoff);
      }

      const total = filtered.length;
      const totalPages = Math.max(1, Math.ceil(total / pageSize));
      const validPage = Math.min(Math.max(1, page), totalPages);
      const start = (validPage - 1) * pageSize;
      const items = filtered.slice(start, start + pageSize);

      return {
        items,
        total,
        page: validPage,
        pageSize,
        totalPages,
      };
    });
  },
};
