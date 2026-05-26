"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { AuthLeftPanel } from "../../components/ui/AuthLeftPanel";
import { ContinueWithGoogle } from "../../components/ui/ContinueWithGoogle";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { hydrateToken, loginCustomer } from "../../features/auth/authSlice";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { status, token } = useAppSelector((s) => s.auth);
  const isLoading = status === "loading";

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  useEffect(() => {
    dispatch(hydrateToken());
  }, [dispatch]);

  useEffect(() => {
    if (token) router.push("/");
  }, [token, router]);

  async function onSubmit(values: LoginFormValues) {
    setServerError(null);
    const action = await dispatch(
      loginCustomer({ email: values.email, password: values.password }),
    );
    if (!loginCustomer.fulfilled.match(action)) {
      setServerError((action.payload as string) ?? "Invalid email or password");
    }
  }

  return (
    <div className="flex flex-1 bg-[var(--color-bg-page)]">
      <AuthLeftPanel />

      {/* Right panel — login form */}
      <div className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-[480px] rounded-[12px] bg-[var(--color-bg-surface)] px-10 py-10 shadow-[0_12px_40px_rgba(25,25,47,0.04)] border border-[var(--color-border-default)]">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 text-[var(--color-auth-ink)]">
              <Image
                src="/ShopRoomIcon.svg"
                alt="ShopRoom"
                width={24}
                height={21}
                className="align-middle"
              />
              <div className="text-[24px] leading-[32px] tracking-[-1.2px] font-bold">
                ShopRoom
              </div>
            </div>

            <h1 className="mt-6 text-[26px] leading-[39px] tracking-[-0.65px] font-extrabold text-[var(--color-auth-ink)] text-center">
              Log in
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

            <form
              className="w-[400px] flex flex-col gap-4"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              {/* Email */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] leading-[15px] tracking-[1px] uppercase font-bold text-[var(--color-auth-ink)]">
                  Email Address
                </label>
                <div className="relative">
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
                    {...register("email")}
                    type="email"
                    placeholder="cameron@example.com"
                    autoComplete="email"
                    className={`w-full h-[48px] rounded-[8px] bg-[var(--color-auth-input-bg)] pl-12 pr-4 text-sm text-[var(--color-auth-ink)] placeholder:text-[var(--color-auth-ink-muted)] outline-none focus:ring-2 focus:ring-[var(--color-auth-primary)]/30 transition-shadow ${errors.email ? "ring-2 ring-red-400" : ""}`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-[11px] text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] leading-[15px] tracking-[1px] uppercase font-bold text-[var(--color-auth-ink)]">
                  Password
                </label>
                <div className="relative">
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className={`w-full h-[48px] rounded-[8px] bg-[var(--color-auth-input-bg)] pl-4 pr-12 text-sm text-[var(--color-auth-ink)] placeholder:text-[var(--color-auth-ink-muted)] outline-none focus:ring-2 focus:ring-[var(--color-auth-primary)]/30 transition-shadow ${errors.password ? "ring-2 ring-red-400" : ""}`}
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
                {errors.password && (
                  <p className="mt-1 text-[11px] text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {serverError && (
                <div className="rounded-[8px] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 text-center">
                  {serverError}
                </div>
              )}

              <button
                type="submit"
                disabled={!isValid || isLoading}
                className="w-full h-[56px] rounded-[8px] bg-[var(--color-auth-primary)] text-white text-[16px] leading-[24px] font-bold disabled:opacity-50 mt-2"
              >
                {isLoading ? "Signing in…" : "Log in"}
              </button>

              <div className="text-center text-[14px] leading-[20px] font-normal text-[var(--color-auth-ink-muted)]">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="font-bold text-[14px] leading-[20px] text-[var(--color-auth-primary)]"
                >
                  Sign up
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
