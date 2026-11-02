"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";

import { AuthCard } from "@/components/ui/AuthCard";
import { authInputCls, authLabelCls } from "@/components/ui/authInput";
import { emailOnlySchema, type EmailOnlyValues } from "@/features/account/passwordSchema";
import { apiMessage, requestPasswordReset, type AccountRole } from "@/features/account/passwordApi";

export default function ForgotPasswordForm({ role }: { role: AccountRole }) {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<EmailOnlyValues>({ resolver: zodResolver(emailOnlySchema), mode: "onTouched" });

  const loginHref = role === "shopkeeper" ? "/customer/login?tab=shopkeeper" : "/customer/login";

  async function onSubmit({ email }: EmailOnlyValues) {
    setServerError(null);
    try {
      await requestPasswordReset(role, email);
      setSentTo(email);
    } catch (err) {
      setServerError(apiMessage(err, "Something went wrong. Please try again."));
    }
  }

  if (sentTo) {
    return (
      <AuthCard
        title="Check your email"
        subtitle={`If ${sentTo} has a ShopRoom account, we've sent a link to reset the password. It works for 30 minutes.`}
      >
        <div className="flex flex-col items-center gap-5 text-center">
          <MarkEmailReadOutlinedIcon sx={{ fontSize: 44 }} className="text-(--color-auth-primary)" />
          <p className="text-[13px] text-(--color-auth-ink-muted)">
            Nothing arrived? Check your spam folder, or try again in a few minutes.
          </p>
          <Link href={loginHref} className="text-[13px] font-bold text-(--color-auth-primary)">
            Back to log in
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Forgot your password?" subtitle="Enter your email and we'll send you a link to choose a new one.">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className={authLabelCls}>
            Email Address
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-(--color-auth-ink-muted)">
              <EmailOutlinedIcon sx={{ fontSize: 16 }} />
            </div>
            <input
              id="email"
              {...register("email")}
              type="email"
              placeholder="cameron@example.com"
              autoComplete="email"
              className={`${authInputCls(!!errors.email)} pl-12 pr-4`}
            />
          </div>
          {errors.email && <p className="text-[11px] text-(--color-danger)">{errors.email.message}</p>}
        </div>

        {serverError && (
          <p role="alert" className="rounded-lg bg-(--color-danger-bg) px-3 py-2 text-[12px] text-(--color-danger)">
            {serverError}
          </p>
        )}

        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="mt-1 h-13 w-full rounded-lg bg-(--color-auth-primary) text-[15px] font-bold text-white transition-colors hover:bg-(--color-brand-primary-active) disabled:opacity-50"
        >
          {isSubmitting ? "Sending…" : "Send reset link"}
        </button>

        <Link href={loginHref} className="text-center text-[13px] font-bold text-(--color-auth-primary)">
          Back to log in
        </Link>
      </form>
    </AuthCard>
  );
}
