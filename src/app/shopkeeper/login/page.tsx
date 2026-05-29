"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { ShopkeeperLeftPanel } from "../../../components/ui/ShopkeeperLeftPanel";
import { apiClient } from "../../../utils/apiClient";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
type FormValues = z.infer<typeof schema>;

function EyeIcon({ open }: { open: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      {open ? (
        <>
          <path
            d="M2.5 12C4.5 7.5 8 5 12 5C16 5 19.5 7.5 21.5 12C19.5 16.5 16 19 12 19C8 19 4.5 16.5 2.5 12Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <circle
            cx="12"
            cy="12"
            r="3"
            stroke="currentColor"
            strokeWidth="1.8"
          />
        </>
      ) : (
        <path
          d="M3 3l18 18M10.5 10.68A3 3 0 0013.32 13.5M6.5 6.74C4.37 8.12 2.9 10 2.5 12c1.5 4.5 5 7 9.5 7a9.6 9.6 0 005.26-1.55M9 5.28A9.4 9.4 0 0112 5c4.5 0 8 2.5 9.5 7-.4 1.2-1.05 2.3-1.9 3.23"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

export default function ShopkeeperLoginPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

  useEffect(() => {
    const shopkeeperToken = localStorage.getItem("shopkeeper_token");
    const customerToken = localStorage.getItem("token");
    if (shopkeeperToken) {
      router.replace("/shopkeeper/dashboard");
    } else if (customerToken) {
      router.replace("/");
    } else {
      setReady(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!ready) return null;

  async function onSubmit(v: FormValues) {
    setIsLoading(true);
    setServerError(null);
    try {
      const res = await apiClient.post("/api/shopkeeper/login", {
        email: v.email,
        password: v.password,
      });
      const { token: t } = res.data as { token: string };
      localStorage.setItem("shopkeeper_token", t);
      router.replace("/shopkeeper/dashboard");
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setServerError(e?.response?.data?.message ?? "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  }

  const inputCls = (hasErr: boolean) =>
    `h-[46px] w-full rounded-[8px] bg-[var(--color-auth-input-bg)] px-4 text-[14px] text-[var(--color-auth-ink)] placeholder:text-[var(--color-auth-ink-muted)]/50 outline-none border transition ${
      hasErr
        ? "border-red-400 ring-1 ring-red-300"
        : "border-transparent focus:border-[var(--color-auth-primary)] focus:ring-1 focus:ring-[var(--color-auth-primary)]"
    }`;

  return (
    <div className="flex flex-1 bg-[var(--color-bg-page)]">
      <ShopkeeperLeftPanel />

      <div className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-[480px]">
          {/* Logo */}
          <div className="flex items-center gap-2 text-[var(--color-auth-ink)] mb-8 justify-center">
            <Image
              src="/ShopRoomIcon.svg"
              alt="ShopRoom"
              width={24}
              height={21}
            />
            <span className="text-[24px] leading-[32px] tracking-[-1.2px] font-bold">
              ShopRoom
            </span>
          </div>

          {/* Role toggle */}
          <div className="flex rounded-[10px] bg-[var(--color-auth-input-bg)] p-1 mb-6">
            <Link
              href="/login"
              className="flex-1 text-center text-[13px] font-medium py-2 rounded-[8px] text-[var(--color-auth-ink-muted)] hover:text-[var(--color-auth-ink)] transition"
            >
              Customer
            </Link>
            <div className="flex-1 text-center text-[13px] font-semibold py-2 rounded-[8px] bg-[var(--color-bg-surface)] text-[var(--color-auth-primary)] shadow-sm">
              Shopkeeper
            </div>
          </div>

          {/* Card */}
          <div className="rounded-[14px] bg-[var(--color-bg-surface)] px-10 py-10 shadow-[0_12px_40px_rgba(25,25,47,0.04)] border border-[var(--color-border-default)]">
            <div className="flex flex-col items-center mb-7">
              <h1 className="text-[26px] font-extrabold text-[var(--color-auth-ink)] tracking-[-0.65px]">
                Shopkeeper Login
              </h1>
              <p className="mt-2 text-[14px] text-[var(--color-auth-ink-muted)] text-center">
                Access your shop dashboard.
              </p>
            </div>

            {serverError && (
              <div className="mb-5 rounded-[8px] bg-red-50 border border-red-200 px-4 py-3 text-[13px] text-red-600">
                {serverError}
              </div>
            )}

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase font-bold text-[var(--color-auth-ink)] tracking-[1px]">
                  Email Address
                </label>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="you@yourshop.com"
                  className={inputCls(!!errors.email)}
                />
                {errors.email && (
                  <span className="text-[12px] text-red-500">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase font-bold text-[var(--color-auth-ink)] tracking-[1px]">
                  Password
                </label>
                <div className="relative">
                  <input
                    {...register("password")}
                    type={showPw ? "text" : "password"}
                    placeholder="Your password"
                    className={inputCls(!!errors.password)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-auth-ink-muted)] hover:text-[var(--color-auth-ink)]"
                  >
                    <EyeIcon open={showPw} />
                  </button>
                </div>
                {errors.password && (
                  <span className="text-[12px] text-red-500">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || !isValid}
                className="mt-2 h-[46px] w-full rounded-[8px] bg-[var(--color-auth-primary)] text-white font-semibold text-[14px] hover:bg-[var(--color-brand-primary-active)] disabled:opacity-60 transition"
              >
                {isLoading ? "Logging in…" : "Log In"}
              </button>
            </form>

            <p className="mt-5 text-center text-[13px] text-[var(--color-auth-ink-muted)]">
              New here?{" "}
              <Link
                href="/shopkeeper/signup"
                className="text-[var(--color-auth-primary)] font-semibold hover:underline"
              >
                Register your shop
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
