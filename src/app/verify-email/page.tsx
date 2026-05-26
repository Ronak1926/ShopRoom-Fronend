"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { AuthLeftPanel } from "../../components/ui/AuthLeftPanel";
import { apiClient } from "../../utils/apiClient";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendSuccess, setResendSuccess] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  function handleDigitChange(idx: number, value: string) {
    // Handle paste of full code
    if (value.length > 1) {
      const cleaned = value.replace(/\D/g, "").slice(0, 6);
      if (cleaned.length === 6) {
        const next = cleaned.split("");
        setDigits(next);
        inputRefs.current[5]?.focus();
        return;
      }
    }
    const char = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[idx] = char;
    setDigits(next);
    if (char && idx < 5) {
      inputRefs.current[idx + 1]?.focus();
    }
  }

  function handleKeyDown(
    idx: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  }

  async function handleVerify() {
    const code = digits.join("");
    if (code.length < 6) {
      setError("Please enter all 6 digits.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await apiClient.post("/api/otp/verify", { email, code });
      router.push("/");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Invalid or expired code. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (resendCooldown > 0) return;
    setResendSuccess(false);
    setError(null);
    try {
      await apiClient.post("/api/otp/send", { email });
      setResendCooldown(60);
      setResendSuccess(true);
      setDigits(Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } catch {
      setError("Failed to resend code. Please try again.");
    }
  }

  return (
    <div className="flex flex-1 bg-[var(--color-bg-page)]">
      <AuthLeftPanel />

      <div className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-[480px] rounded-[12px] bg-[var(--color-bg-surface)] px-10 py-10 shadow-[0_12px_40px_rgba(25,25,47,0.04)] border border-[var(--color-border-default)]">
          {/* Header */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 text-[var(--color-auth-ink)]">
              <Image
                src="/ShopRoomIcon.svg"
                alt="ShopRoom"
                width={26}
                height={23}
                className="align-middle"
              />
              <div className="text-[24px] leading-[32px] tracking-[-1.2px] font-bold">
                ShopRoom
              </div>
            </div>

            {/* Mail icon */}
            <div className="mt-8 w-[64px] h-[64px] rounded-[16px] bg-[var(--color-auth-panel-bg)] border border-[var(--color-auth-border)] flex items-center justify-center">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                className="text-[var(--color-auth-primary)]"
              >
                <path
                  d="M4 7.5C4 6.67157 4.67157 6 5.5 6H18.5C19.3284 6 20 6.67157 20 7.5V16.5C20 17.3284 19.3284 18 18.5 18H5.5C4.67157 18 4 17.3284 4 16.5V7.5Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="M6.5 8.5L12 12.5L17.5 8.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h1 className="mt-5 text-[26px] font-extrabold tracking-[-0.65px] text-[var(--color-auth-ink)] text-center">
              Check your email
            </h1>
            <p className="mt-2 text-[14px] text-[var(--color-auth-ink-muted)] text-center max-w-[320px]">
              We sent a 6-digit verification code to{" "}
              <span className="font-semibold text-[var(--color-auth-ink)]">
                {email}
              </span>
            </p>
          </div>

          {/* OTP inputs */}
          <div className="mt-8 flex flex-col items-center gap-6">
            <div className="flex gap-3">
              {digits.map((d, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={d}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  onFocus={(e) => e.target.select()}
                  className={[
                    "w-[52px] h-[60px] rounded-[10px] text-center text-[22px] font-bold",
                    "bg-[var(--color-auth-input-bg)] text-[var(--color-auth-ink)]",
                    "outline-none transition-shadow",
                    d
                      ? "ring-2 ring-[var(--color-auth-primary)]"
                      : "ring-1 ring-[var(--color-auth-border)]",
                    "focus:ring-2 focus:ring-[var(--color-auth-primary)]",
                  ].join(" ")}
                />
              ))}
            </div>

            {/* Error / success messages */}
            {error && (
              <div className="w-full rounded-[8px] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 text-center">
                {error}
              </div>
            )}
            {resendSuccess && !error && (
              <div className="w-full rounded-[8px] border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-600 text-center">
                A new code has been sent to your email.
              </div>
            )}

            {/* Verify button */}
            <button
              type="button"
              onClick={handleVerify}
              disabled={loading || digits.join("").length < 6}
              className="w-full h-[56px] rounded-[8px] bg-[var(--color-auth-primary)] text-white text-[16px] font-bold disabled:opacity-50 transition-opacity"
            >
              {loading ? "Verifying…" : "Verify Email"}
            </button>

            {/* Resend */}
            <div className="text-[14px] text-[var(--color-auth-ink-muted)] text-center">
              Didn&apos;t receive a code?{" "}
              {resendCooldown > 0 ? (
                <span className="text-[var(--color-auth-ink-muted)] opacity-60">
                  Resend in {resendCooldown}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="font-bold text-[var(--color-auth-primary)] hover:underline"
                >
                  Resend code
                </button>
              )}
            </div>

            <div className="text-[13px] text-[var(--color-auth-ink-muted)]">
              <Link href="/signup" className="hover:underline">
                ← Back to sign up
              </Link>
            </div>
          </div>

          <div className="mt-10 flex items-center justify-center gap-12 text-[10px] tracking-[2px] uppercase text-[var(--color-auth-ink-muted)] opacity-50">
            <span>© 2026 SHOPROOM</span>
            <span>PRIVACY POLICY</span>
            <span>HELP CENTER</span>
          </div>
        </div>
      </div>
    </div>
  );
}
