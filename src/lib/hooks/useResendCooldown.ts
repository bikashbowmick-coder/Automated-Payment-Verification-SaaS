/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';

export function useResendCooldown(initialSeconds = 60) {
  const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);

  useEffect(() => {
    if (secondsRemaining <= 0) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsRemaining]);

  const reset = useCallback(
    (seconds = initialSeconds) => {
      setSecondsRemaining(seconds);
    },
    [initialSeconds]
  );

  return {
    secondsRemaining,
    canResend: secondsRemaining === 0,
    reset,
  };
}
