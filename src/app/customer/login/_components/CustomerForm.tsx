"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

import { ContinueWithGoogle } from "@/components/ui/ContinueWithGoogle";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { loginCustomer } from "@/features/auth/authSlice";
import { loginSchema, type LoginFormValues, inputCls } from "../_schemas/loginSchema";

export default function CustomerForm() {
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
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  async function onSubmit(values: LoginFormValues) {
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
            <p className="text-[11px] text-(--color-danger)">{errors.email.message}</p>
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
            <p className="text-[11px] text-(--color-danger)">
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
          <Link href="/customer/signup" className="font-bold text-(--color-auth-primary)">
            Sign up
          </Link>
        </p>
      </form>
    </>
  );
}
