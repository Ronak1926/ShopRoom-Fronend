"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

import { AuthLeftPanel } from "../../components/ui/AuthLeftPanel";
import { ShopkeeperLeftPanel } from "../../components/ui/ShopkeeperLeftPanel";
import { ContinueWithGoogle } from "../../components/ui/ContinueWithGoogle";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { hydrateToken, loginCustomer } from "../../features/auth/authSlice";
import { apiClient } from "../../utils/apiClient";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
type FormValues = z.infer<typeof schema>;

const inputCls = (hasErr: boolean) =>
  `w-full h-[48px] rounded-lg bg-(--color-auth-input-bg) text-sm text-(--color-auth-ink) placeholder:text-(--color-auth-ink-muted) outline-none focus:ring-2 focus:ring-(--color-auth-primary)/30 transition-shadow border border-transparent ${
    hasErr ? "ring-2 ring-red-400" : ""
  }`;

// ── Customer login form ──────────────────────────────────────────────────────

function CustomerForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { status } = useAppSelector((s) => s.auth);
  const isLoading = status === "loading";
  const [showPw, setShowPw] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<FormValues>({ resolver: zodResolver(schema), mode: "onTouched" });

  async function onSubmit(values: FormValues) {
    const action = await dispatch(
      loginCustomer({ email: values.email, password: values.password }),
    );
    if (loginCustomer.fulfilled.match(action)) {
      router.replace("/customer/home");
    } else {
      setError("password", { message: "Incorrect email or password" });
    }
  }

  return (
    <>
      <ContinueWithGoogle />

      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-(--color-border-default)" />
        <span className="text-[10px] tracking-[1px] text-(--color-auth-ink-muted) uppercase opacity-50">
          OR
        </span>
        <div className="h-px flex-1 bg-(--color-border-default)" />
      </div>

      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="flex flex-col gap-1">
          <label className="text-[10px] tracking-[1px] uppercase font-bold text-(--color-auth-ink)">
            Email Address
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-(--color-auth-ink-muted)">
              <EmailOutlinedIcon sx={{ fontSize: 16 }} />
            </div>
            <input
              {...register("email")}
              type="email"
              placeholder="cameron@example.com"
              autoComplete="email"
              className={`${inputCls(!!errors.email)} pl-12 pr-4`}
            />
          </div>
          {errors.email && (
            <p className="text-[11px] text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] tracking-[1px] uppercase font-bold text-(--color-auth-ink)">
            Password
          </label>
          <div className="relative">
            <input
              {...register("password")}
              type={showPw ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              className={`${inputCls(!!errors.password)} pl-4 pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center text-(--color-auth-ink-muted)"
            >
              {showPw ? (
                <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} />
              ) : (
                <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-[11px] text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isValid || isLoading}
          className="w-full h-13 rounded-lg bg-(--color-auth-primary) text-white text-[15px] font-bold disabled:opacity-50 mt-1 hover:bg-(--color-brand-primary-active) transition-colors"
        >
          {isLoading ? "Signing in…" : "Log in"}
        </button>

        <p className="text-center text-[13px] text-(--color-auth-ink-muted)">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-bold text-(--color-auth-primary)"
          >
            Sign up
          </Link>
        </p>
      </form>
    </>
  );
}

// ── Shopkeeper login form ────────────────────────────────────────────────────

function ShopkeeperForm() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<FormValues>({ resolver: zodResolver(schema), mode: "onTouched" });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    try {
      const res = await apiClient.post("/api/shopkeeper/login", {
        email: values.email,
        password: values.password,
      });
      const { token } = res.data as { token: string };
      localStorage.setItem("shopkeeper_token", token);
      router.replace("/shopkeeper/dashboard");
    } catch {
      setError("password", { message: "Incorrect email or password" });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className="flex flex-col gap-1">
        <label className="text-[10px] tracking-[1px] uppercase font-bold text-(--color-auth-ink)">
          Email Address
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-(--color-auth-ink-muted)">
            <EmailOutlinedIcon sx={{ fontSize: 16 }} />
          </div>
          <input
            {...register("email")}
            type="email"
            placeholder="you@yourshop.com"
            autoComplete="email"
            className={`${inputCls(!!errors.email)} pl-12 pr-4`}
          />
        </div>
        {errors.email && (
          <p className="text-[11px] text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <label className="text-[10px] tracking-[1px] uppercase font-bold text-(--color-auth-ink)">
            Password
          </label>
        </div>
        <div className="relative">
          <input
            {...register("password")}
            type={showPw ? "text" : "password"}
            placeholder="Your password"
            autoComplete="current-password"
            className={`${inputCls(!!errors.password)} pl-4 pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center text-(--color-auth-ink-muted)"
          >
            {showPw ? (
              <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} />
            ) : (
              <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-[11px] text-red-500">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={!isValid || isLoading}
        className="w-full h-13 rounded-lg bg-(--color-auth-primary) text-white text-[15px] font-bold disabled:opacity-50 mt-1 hover:bg-(--color-brand-primary-active) transition-colors"
      >
        {isLoading ? "Logging in…" : "Log In"}
      </button>

      <p className="text-center text-[13px] text-(--color-auth-ink-muted)">
        New here?{" "}
        <Link
          href="/shopkeeper/signup"
          className="font-bold text-(--color-auth-primary)"
        >
          Register your shop
        </Link>
      </p>
    </form>
  );
}

// ── Inner page (reads searchParams) ─────────────────────────────────────────

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<"customer" | "shopkeeper">("customer");

  // Initialise tab from ?tab= param and guard against already-logged-in users
  useEffect(() => {
    const t = searchParams.get("tab");
    if (t === "shopkeeper") setTab("shopkeeper");

    const customerToken = localStorage.getItem("token");
    const shopkeeperToken = localStorage.getItem("shopkeeper_token");
    if (customerToken) {
      dispatch(hydrateToken());
      router.replace("/customer/home");
    } else if (shopkeeperToken) {
      router.replace("/shopkeeper/dashboard");
    } else {
      dispatch(hydrateToken());
      setReady(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function switchTab(next: "customer" | "shopkeeper") {
    setTab(next);
    router.replace(`/login${next === "shopkeeper" ? "?tab=shopkeeper" : ""}`, {
      scroll: false,
    });
  }

  if (!ready) return null;

  const isShopkeeper = tab === "shopkeeper";

  return (
    <div className="flex flex-1 bg-(--color-bg-page)">
      {/* Left panel switches with tab */}
      {isShopkeeper ? <ShopkeeperLeftPanel /> : <AuthLeftPanel />}

      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-120">
          {/* Logo */}
          <div className="flex items-center gap-2 text-(--color-auth-ink) mb-6 justify-center">
            <Image
              src="/ShopRoomIcon.svg"
              alt="ShopRoom"
              width={24}
              height={21}
            />
            <span className="text-[24px] leading-8 tracking-[-1.2px] font-bold">
              ShopRoom
            </span>
          </div>

          {/* Tab switcher */}
          <div className="flex rounded-[10px] bg-(--color-auth-input-bg) p-1 mb-6">
            <button
              type="button"
              onClick={() => switchTab("customer")}
              className={`flex-1 text-center text-[13px] py-2 rounded-lg transition font-[inherit] ${
                !isShopkeeper
                  ? "font-semibold bg-(--color-bg-surface) text-(--color-auth-primary) shadow-sm"
                  : "font-medium text-(--color-auth-ink-muted) hover:text-(--color-auth-ink)"
              }`}
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => switchTab("shopkeeper")}
              className={`flex-1 text-center text-[13px] py-2 rounded-lg transition font-[inherit] ${
                isShopkeeper
                  ? "font-semibold bg-(--color-bg-surface) text-(--color-auth-primary) shadow-sm"
                  : "font-medium text-(--color-auth-ink-muted) hover:text-(--color-auth-ink)"
              }`}
            >
              Shopkeeper
            </button>
          </div>

          {/* Card */}
          <div className="rounded-[14px] bg-(--color-bg-surface) px-10 py-10 shadow-[0_12px_40px_rgba(25,25,47,0.04)] border border-(--color-border-default)">
            <div className="flex flex-col items-center mb-7">
              <h1 className="text-[26px] font-extrabold text-(--color-auth-ink) tracking-[-0.65px]">
                {isShopkeeper ? "Shopkeeper Login" : "Welcome back"}
              </h1>
              <p className="mt-2 text-[14px] text-(--color-auth-ink-muted) text-center">
                {isShopkeeper
                  ? "Access your shop dashboard."
                  : "Find rooms near your favourite shops."}
              </p>
            </div>

            {isShopkeeper ? <ShopkeeperForm /> : <CustomerForm />}
          </div>

          <div className="mt-8 flex items-center justify-center gap-8 text-[10px] tracking-[2px] uppercase text-(--color-auth-ink-muted) opacity-50">
            <span>© 2026 SHOPROOM</span>
            <span>PRIVACY POLICY</span>
            <span>HELP CENTER</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page export (wraps in Suspense for useSearchParams) ──────────────────────

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageInner />
    </Suspense>
  );
}
