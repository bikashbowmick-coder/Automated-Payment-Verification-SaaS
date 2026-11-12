/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { OtpInput } from '../components/ui/OtpInput.tsx';

describe('OtpInput Component', () => {
  it('renders exactly 6 digit inputs by default', () => {
    const handleChange = vi.fn();
    render(<OtpInput value="" onChange={handleChange} />);

    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(6);
    expect(inputs[0].getAttribute('aria-label')).toBe('Digit 1 of 6');
    expect(inputs[5].getAttribute('aria-label')).toBe('Digit 6 of 6');
  });

  it('updates character values when typed', () => {
    let otpValue = '';
    const handleChange = vi.fn((val) => {
      otpValue = val;
    });

    const { rerender } = render(<OtpInput value={otpValue} onChange={handleChange} />);
    const inputs = screen.getAllByRole('textbox');

    fireEvent.change(inputs[0], { target: { value: '4' } });
    expect(handleChange).toHaveBeenCalledWith('4');

    rerender(<OtpInput value="4" onChange={handleChange} />);
    expect((inputs[0] as HTMLInputElement).value).toBe('4');
  });

  it('handles paste of 6-digit code and calls onComplete', () => {
    const handleChange = vi.fn();
    const handleComplete = vi.fn();

    render(<OtpInput value="" onChange={handleChange} onComplete={handleComplete} />);
    const inputs = screen.getAllByRole('textbox');

    fireEvent.paste(inputs[0], {
      clipboardData: {
        getData: () => '948210',
      },
    });

    expect(handleChange).toHaveBeenCalledWith('948210');
    expect(handleComplete).toHaveBeenCalledWith('948210');
  });
});
