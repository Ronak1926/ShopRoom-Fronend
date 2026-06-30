"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { step1Schema, type Step1Values } from "../_lib/schemas";
import { EyeIcon, FieldError, inputCls, labelCls } from "./FormHelpers";

interface Step1AccountProps {
  isLoading: boolean;
  onSubmit: (v: Step1Values) => void;
}

export function Step1Account({ isLoading, onSubmit }: Step1AccountProps) {
  const {
    register,
    handleSubmit,
    formState: { errors: e },
  } = useForm<Step1Values>({
    resolver: zodResolver(step1Schema),
    mode: "onTouched",
    defaultValues: { isShopkeeper: false as unknown as true },
  });

  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);

  return (
    <div>
      <h1 className="text-[22px] font-extrabold text-[var(--color-auth-ink)] tracking-[-0.5px] mb-1">
        Create your account
      </h1>
      <p className="text-[13px] text-[var(--color-auth-ink-muted)] mb-6">
        Start by setting up your login credentials.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-4"
      >
        {/* Work Email */}
        <div className="flex flex-col gap-1">
          <label className={labelCls()}>Work Email</label>
          <input
            {...register("email")}
            type="email"
            placeholder="you@yourshop.com"
            className={inputCls(!!e.email)}
          />
          <FieldError msg={e.email?.message} />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <label className={labelCls()}>Password</label>
          <div className="relative">
            <input
              {...register("password")}
              type={showPw ? "text" : "password"}
              placeholder="Min. 8 characters"
              className={`${inputCls(!!e.password)} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-auth-ink-muted)] hover:text-[var(--color-auth-ink)]"
            >
              <EyeIcon open={showPw} />
            </button>
          </div>
          <FieldError msg={e.password?.message} />
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1">
          <label className={labelCls()}>Confirm Password</label>
          <div className="relative">
            <input
              {...register("confirmPassword")}
              type={showCpw ? "text" : "password"}
              placeholder="Repeat your password"
              className={`${inputCls(!!e.confirmPassword)} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowCpw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-auth-ink-muted)] hover:text-[var(--color-auth-ink)]"
            >
              <EyeIcon open={showCpw} />
            </button>
          </div>
          <FieldError msg={e.confirmPassword?.message} />
        </div>

        {/* Shopkeeper confirmation */}
        <label className="flex items-start gap-3 cursor-pointer mt-1">
          <input
            {...register("isShopkeeper")}
            type="checkbox"
            className="mt-0.5 accent-[var(--color-auth-primary)] w-4 h-4 shrink-0"
          />
          <span className="text-[13px] text-[var(--color-auth-ink-muted)] leading-snug">
            I confirm that I am a shopkeeper registering on behalf of my
            business
          </span>
        </label>
        <FieldError msg={e.isShopkeeper?.message} />

        <button
          type="submit"
          disabled={isLoading}
          className="mt-1 h-[46px] w-full rounded-[8px] bg-[var(--color-auth-primary)] text-white font-semibold text-[14px] hover:bg-[var(--color-brand-primary-active)] disabled:opacity-60 transition"
        >
          {isLoading ? "Please wait…" : "Continue →"}
        </button>
      </form>

      <p className="mt-5 text-center text-[13px] text-[var(--color-auth-ink-muted)]">
        Already have an account?{" "}
        <Link
          href="/customer/login?tab=shopkeeper"
          className="text-[var(--color-auth-primary)] font-semibold hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
