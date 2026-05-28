"use client";

import { useEffect, useRef, useState } from "react";

interface Step3PhoneOtpProps {
  isLoading: boolean;
  phoneNumber: string;
  onVerify: (code: string) => void;
  onResend: () => void;
  onBack: () => void;
}

export function Step3PhoneOtp({
  isLoading,
  phoneNumber,
  onVerify,
  onResend,
  onBack,
}: Step3PhoneOtpProps) {
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [cooldown, setCooldown] = useState(60);

  // Cooldown ticker — starts at 60 on mount (OTP just sent)
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  function handleChange(idx: number, value: string) {
    if (value.length > 1) {
      // Handle paste
      const digits = value.replace(/\D/g, "").slice(0, 6);
      const next = [...otpDigits];
      for (let i = 0; i < digits.length && idx + i < 6; i++) {
        next[idx + i] = digits[i];
      }
      setOtpDigits(next);
      const focus = Math.min(idx + digits.length, 5);
      otpInputsRef.current[focus]?.focus();
      return;
    }
    if (!/^\d*$/.test(value)) return;
    const next = [...otpDigits];
    next[idx] = value;
    setOtpDigits(next);
    if (value && idx < 5) otpInputsRef.current[idx + 1]?.focus();
  }

  function handleKeyDown(
    idx: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (e.key === "Backspace" && !otpDigits[idx] && idx > 0) {
      otpInputsRef.current[idx - 1]?.focus();
    }
  }

  function handleResend() {
    onResend();
    setCooldown(60);
    setOtpDigits(["", "", "", "", "", ""]);
    otpInputsRef.current[0]?.focus();
  }

  const code = otpDigits.join("");

  return (
    <div className="flex flex-col items-center">
      {/* Phone icon */}
      <div className="w-14 h-14 rounded-2xl bg-[var(--color-auth-input-bg)] flex items-center justify-center mb-4">
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-auth-primary)"
          strokeWidth="1.8"
          strokeLinecap="round"
        >
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11 19.79 19.79 0 01.25 2.41 2 2 0 012.24.25h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
        </svg>
      </div>

      <h1 className="text-[22px] font-extrabold text-[var(--color-auth-ink)] tracking-[-0.5px] mb-1 text-center">
        Verify your phone
      </h1>
      <p className="text-[13px] text-[var(--color-auth-ink-muted)] text-center mb-1">
        Enter the 6-digit code sent to
      </p>
      <p className="text-[14px] font-semibold text-[var(--color-auth-ink)] text-center mb-6">
        +91 {phoneNumber}
      </p>

      {/* OTP inputs */}
      <div className="flex gap-2 mb-6">
        {otpDigits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              otpInputsRef.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className={`w-11 h-12 rounded-[8px] text-center text-[20px] font-bold outline-none border transition
              ${
                digit
                  ? "border-[var(--color-auth-primary)] bg-[var(--color-auth-input-bg)]"
                  : "border-[var(--color-auth-border)] bg-[var(--color-auth-input-bg)]"
              }
              focus:border-[var(--color-auth-primary)] focus:ring-2 focus:ring-[var(--color-auth-primary)]/20
              text-[var(--color-auth-ink)]`}
          />
        ))}
      </div>

      <button
        onClick={() => onVerify(code)}
        disabled={isLoading || code.length !== 6}
        className="w-full h-[46px] rounded-[8px] bg-[var(--color-auth-primary)] text-white font-semibold text-[14px] hover:bg-[var(--color-brand-primary-active)] disabled:opacity-60 transition mb-4"
      >
        {isLoading ? "Verifying…" : "Verify Phone →"}
      </button>

      <p className="text-[13px] text-[var(--color-auth-ink-muted)] text-center">
        {cooldown > 0 ? (
          <>
            Resend code in{" "}
            <span className="font-semibold text-[var(--color-auth-ink)]">
              {cooldown}s
            </span>
          </>
        ) : (
          <button
            onClick={handleResend}
            className="text-[var(--color-auth-primary)] font-semibold hover:underline"
          >
            Resend code
          </button>
        )}
      </p>

      <button
        type="button"
        onClick={onBack}
        className="mt-4 text-[13px] text-[var(--color-auth-ink-muted)] hover:underline"
      >
        ← Back to shop details
      </button>
    </div>
  );
}
