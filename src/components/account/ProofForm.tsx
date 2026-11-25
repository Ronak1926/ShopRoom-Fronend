"use client";

import "@/lib/zodJitless";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface Values {
  password: string;
  code: string;
}

interface Props {
  /** Ask for the account password (not needed when Google confirms identity instead). */
  askPassword: boolean;
  /** Ask for a 6-digit code (or recovery code) from the authenticator app. */
  askCode: boolean;
  codeLabel?: string;
  submitLabel: string;
  busyLabel: string;
  busy: boolean;
  error: string | null;
  onSubmit: (values: Values) => void;
  onCancel: () => void;
  /** Visual weight of the submit button: destructive actions are red. */
  danger?: boolean;
}

const inputCls = "w-full h-10 rounded-lg border border-(--color-border-default) bg-(--color-bg-surface) px-3 text-sm text-(--color-text-primary)";

/** The small "confirm it's you" form shared by the two-step verification actions. */
export default function ProofForm({ askPassword, askCode, codeLabel = "Code from your app", submitLabel, busyLabel, busy, error, onSubmit, onCancel, danger = false }: Props) {
  const schema = useMemo(
    () =>
      z.object({
        password: askPassword ? z.string().min(1, "Enter your password to confirm") : z.string(),
        code: askCode ? z.string().trim().min(6, "Enter the 6-digit code").max(32, "That code is too long") : z.string(),
      }),
    [askPassword, askCode],
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { password: "", code: "" } });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3" noValidate>
      {askPassword && (
        <div>
          <label htmlFor="proof-password" className="sr-only">
            Password
          </label>
          <input id="proof-password" type="password" autoComplete="current-password" placeholder="Password" {...register("password")} className={inputCls} />
          {errors.password && <p className="mt-1 text-sm text-(--color-danger-text)">{errors.password.message}</p>}
        </div>
      )}
      {askCode && (
        <div>
          <label htmlFor="proof-code" className="sr-only">
            {codeLabel}
          </label>
          <input id="proof-code" type="text" autoComplete="one-time-code" spellCheck={false} placeholder={codeLabel} {...register("code")} className={`${inputCls} tracking-[2px]`} />
          {errors.code && <p className="mt-1 text-sm text-(--color-danger-text)">{errors.code.message}</p>}
        </div>
      )}
      {error && (
        <p role="alert" className="text-sm text-(--color-danger-text)">
          {error}
        </p>
      )}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={busy}
          className="h-9 px-4 rounded-lg text-[13px] font-semibold text-(--color-text-secondary) bg-(--color-bg-surface) border border-(--color-border-default) cursor-pointer hover:bg-(--color-bg-surface-hover) disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={busy}
          className={`h-9 px-4 rounded-lg text-[13px] font-semibold text-white border-0 cursor-pointer disabled:opacity-50 ${danger ? "bg-(--color-danger) hover:bg-(--color-danger-hover)" : "bg-(--color-brand-primary) hover:bg-(--color-brand-primary-active)"}`}
        >
          {busy ? busyLabel : submitLabel}
        </button>
      </div>
    </form>
  );
}
