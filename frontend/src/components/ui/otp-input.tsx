import React, { useMemo, useState } from 'react';
import { Input } from './input';

interface OTPInputProps {
  length?: number;
  onComplete?: (otp: string) => void;
}

export function OTPInput({ length = 6, onComplete }: OTPInputProps) {
  const [otp, setOtp] = useState(new Array(length).fill(''));

  // Create stable refs for each input element so we can call .current.focus()
  const inputRefs = useMemo(
    () => Array.from({ length }, () => React.createRef<HTMLInputElement>()),
    [length]
  );

  const handleChange = (element: HTMLInputElement | null, index: number) => {
    if (!element) return;
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Move to next input if current field is filled
    if (element.value && index < length - 1) {
      inputRefs[index + 1].current?.focus();
    }

    // Call onComplete when all fields are filled
    const otpString = newOtp.join('');
    if (otpString.length === length && onComplete) {
      onComplete(otpString);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      // If current field is empty, move focus to previous input
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs[index - 1].current?.focus();
      }
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      {otp.map((digit, idx) => (
        <Input
          key={idx}
          type="text"
          maxLength={1}
          value={digit}
          ref={inputRefs[idx]}
          onChange={(e) => handleChange(e.currentTarget, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          className="w-12 h-12 text-center text-xl"
        />
      ))}
    </div>
  );
}