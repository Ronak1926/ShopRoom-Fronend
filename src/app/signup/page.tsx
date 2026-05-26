"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { AuthLeftPanel } from "../../components/ui/AuthLeftPanel";
import { ContinueWithGoogle } from "../../components/ui/ContinueWithGoogle";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [allowLocation, setAllowLocation] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      fullName.trim().length > 0 &&
      email.trim().length > 0 &&
      password.length > 0 &&
      confirmPassword.length > 0
    );
  }, [fullName, email, password, confirmPassword]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
  }

  return (
    <div className="flex flex-1 bg-[var(--color-bg-page)]">
      <AuthLeftPanel />

      <div className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-[480px] rounded-[12px] bg-[var(--color-bg-surface)] px-10 py-10 shadow-[0_12px_40px_rgba(25,25,47,0.04)] border border-[var(--color-border-default)]">
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

            <h1 className="mt-6 text-[26px] leading-[39px] tracking-[-0.65px] font-extrabold text-[var(--color-auth-ink)] text-center">
              Create your account
            </h1>
            <p className="mt-2 text-[14px] leading-[20px] font-normal text-[var(--color-auth-ink-muted)] text-center">
              Find rooms near your favourite shops.
            </p>
          </div>

          <div className="mt-8 flex flex-col items-center">
            <div className="w-[400px]">
              <ContinueWithGoogle />
            </div>

            <div className="my-6 flex items-center gap-4 w-[400px]">
              <div className="h-px flex-1 bg-[var(--color-border-default)]" />
              <div className="text-[10px] leading-[15px] tracking-[1px] text-[var(--color-auth-ink-muted)] uppercase opacity-50">
                OR
              </div>
              <div className="h-px flex-1 bg-[var(--color-border-default)]" />
            </div>

            <form className="w-[400px] flex flex-col gap-4" onSubmit={onSubmit}>
              <label className="flex flex-col gap-2">
                <span className="text-[10px] leading-[15px] tracking-[1px] uppercase font-bold text-[var(--color-auth-ink)]">
                  Full Name
                </span>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Cameron Williamson"
                  className="w-[400px] h-[48px] rounded-[8px] bg-[var(--color-auth-input-bg)] px-4 py-[14px] text-sm text-[var(--color-auth-ink)] placeholder:text-[var(--color-auth-ink-muted)] outline-none"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-[10px] leading-[15px] tracking-[1px] uppercase font-bold text-[var(--color-auth-ink)]">
                  Email Address
                </span>
                <div className="relative w-[400px]">
                  <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-auth-ink-muted)]">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
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
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="cameron@example.com"
                    autoComplete="email"
                    className="w-[400px] h-[48px] rounded-[8px] bg-[var(--color-auth-input-bg)] pl-12 pr-4 py-[14px] text-sm text-[var(--color-auth-ink)] placeholder:text-[var(--color-auth-ink-muted)] outline-none"
                  />
                </div>
              </label>

              <div className="grid grid-cols-2 gap-4 w-[400px]">
                <label className="flex flex-col gap-2">
                  <span className="text-[10px] leading-[15px] tracking-[1px] uppercase font-bold text-[var(--color-auth-ink)]">
                    Password
                  </span>
                  <div className="relative">
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      className="w-full h-[48px] rounded-[8px] bg-[var(--color-auth-input-bg)] pl-4 pr-12 py-[14px] text-sm text-[var(--color-auth-ink)] placeholder:text-[var(--color-auth-ink-muted)] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center text-[var(--color-auth-ink-muted)]"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.5 12C4.5 7.5 8 5 12 5C16 5 19.5 7.5 21.5 12C19.5 16.5 16 19 12 19C8 19 4.5 16.5 2.5 12Z"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        />
                        <path
                          d="M12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12C15 13.6569 13.6569 15 12 15Z"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        />
                      </svg>
                    </button>
                  </div>
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-[10px] leading-[15px] tracking-[1px] uppercase font-bold text-[var(--color-auth-ink)]">
                    Confirm
                  </span>
                  <input
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    className="w-full h-[48px] rounded-[8px] bg-[var(--color-auth-input-bg)] pl-4 pr-12 py-[14px] text-sm text-[var(--color-auth-ink)] placeholder:text-[var(--color-auth-ink-muted)] outline-none"
                  />
                </label>
              </div>

              <div className="w-[400px] h-[72.5px] rounded-[8px] border border-[var(--color-auth-border)] bg-[var(--color-auth-panel-bg)]/50 p-4 flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="text-[14px] leading-[20px] font-bold text-[var(--color-auth-ink)]">
                    Allow location access
                  </div>
                  <div className="text-[11px] leading-[16.5px] font-normal text-[var(--color-auth-ink-muted)]">
                    Show rooms near your current position.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setAllowLocation((v) => !v)}
                  className={[
                    "relative w-[44px] h-[24px] rounded-full transition-colors",
                    allowLocation
                      ? "bg-[var(--color-auth-primary)]"
                      : "bg-[var(--color-auth-border)]/60",
                  ].join(" ")}
                  aria-pressed={allowLocation}
                >
                  <span
                    className={[
                      "absolute top-[3px] left-[3px] h-[18px] w-[18px] rounded-full bg-white transition-transform",
                      allowLocation ? "translate-x-[20px]" : "translate-x-0",
                    ].join(" ")}
                  />
                </button>
              </div>

              <button
                type="submit"
                disabled={!canSubmit}
                className="w-[400px] h-[56px] rounded-[8px] bg-[var(--color-auth-primary)] text-white text-[16px] leading-[24px] font-bold disabled:opacity-50"
              >
                Create Account
              </button>

              <div className="text-center text-[14px] leading-[20px] font-normal text-[var(--color-auth-ink-muted)]">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-bold text-[14px] leading-[20px] text-[var(--color-auth-primary)]"
                >
                  Log in
                </Link>
              </div>
            </form>
          </div>

          <div className="mt-12 flex items-center justify-center gap-12 text-[10px] leading-[15px] tracking-[2px] uppercase text-[var(--color-auth-ink-muted)] opacity-50">
            <span>© 2026 SHOPROOM</span>
            <span>PRIVACY POLICY</span>
            <span>HELP CENTER</span>
          </div>
        </div>
      </div>
    </div>
  );
}
