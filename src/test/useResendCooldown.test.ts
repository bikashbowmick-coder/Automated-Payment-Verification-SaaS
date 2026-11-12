/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useResendCooldown } from '../lib/hooks/useResendCooldown.ts';

describe('useResendCooldown', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts with initial cooldown seconds and canResend false', () => {
    const { result } = renderHook(() => useResendCooldown(60));
    expect(result.current.secondsRemaining).toBe(60);
    expect(result.current.canResend).toBe(false);
  });

  it('decrements countdown over time', () => {
    const { result } = renderHook(() => useResendCooldown(10));

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.secondsRemaining).toBe(7);
    expect(result.current.canResend).toBe(false);

    act(() => {
      vi.advanceTimersByTime(7000);
    });

    expect(result.current.secondsRemaining).toBe(0);
    expect(result.current.canResend).toBe(true);
  });

  it('resets cooldown when reset() is invoked', () => {
    const { result } = renderHook(() => useResendCooldown(60));

    act(() => {
      vi.advanceTimersByTime(60000);
    });

    expect(result.current.canResend).toBe(true);

    act(() => {
      result.current.reset(30);
    });

    expect(result.current.secondsRemaining).toBe(30);
    expect(result.current.canResend).toBe(false);
  });
});
