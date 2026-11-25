"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authInputCls, authLabelCls } from "@/components/ui/authInput";
import { changePasswordSchema, type ChangePasswordValues } from "@/features/account/passwordSchema";
import { apiMessage, changePassword, type AccountRole } from "@/features/account/passwordApi";

interface ChangePasswordCardProps {
  role: AccountRole;
  /** Called after the session has been replaced, for state that mirrors it (the customer's Redux slice). */
  onTokenRefreshed?: () => void;
}

const FIELDS = [
  { name: "currentPassword", label: "Current password", autoComplete: "current-password" },
  { name: "newPassword", label: "New password", autoComplete: "new-password" },
  { name: "confirm", label: "Confirm new password", autoComplete: "new-password" },
] as const;

export default function ChangePasswordCard({ role, onTokenRefreshed }: ChangePasswordCardProps) {
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordValues>({ resolver: zodResolver(changePasswordSchema), mode: "onTouched" });

  async function onSubmit(values: ChangePasswordValues) {
    setMessage(null);
    try {
      const result = await changePassword(role, values.currentPassword, values.newPassword);
      // Every other device was signed out; the API already replaced this browser's session cookie.
      onTokenRefreshed?.();
      reset();
      setMessage({ ok: true, text: result.message });
    } catch (err) {
      setMessage({ ok: false, text: apiMessage(err, "Could not change the password. Please try again.") });
    }
  }

  return (
    <section className="rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-6">
      <h2 className="text-[16px] font-bold text-(--color-text-primary)">Change password</h2>
      <p className="mt-1 text-[13px] text-(--color-text-secondary)">You&apos;ll stay signed in here; every other device is signed out.</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-4 flex max-w-md flex-col gap-4">
        {FIELDS.map(({ name, label, autoComplete }) => (
          <div key={name} className="flex flex-col gap-1">
            <label htmlFor={`${role}-${name}`} className={authLabelCls}>
              {label}
            </label>
            <input id={`${role}-${name}`} type="password" autoComplete={autoComplete} {...register(name)} className={`${authInputCls(!!errors[name])} px-4`} />
            {errors[name] && <p className="text-[11px] text-(--color-danger)">{errors[name]?.message}</p>}
          </div>
        ))}

        {message && (
          <p
            role={message.ok ? "status" : "alert"}
            className={`rounded-lg px-3 py-2 text-[12px] ${message.ok ? "bg-(--color-success-light) text-(--color-success-text)" : "bg-(--color-danger-bg) text-(--color-danger)"}`}
          >
            {message.text}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="h-11 w-full rounded-lg bg-(--color-brand-primary) text-[14px] font-semibold text-white transition-colors hover:bg-(--color-brand-primary-hover) disabled:opacity-60 sm:w-auto sm:px-8"
        >
          {isSubmitting ? "Saving…" : "Change password"}
        </button>
      </form>
    </section>
  );
}
