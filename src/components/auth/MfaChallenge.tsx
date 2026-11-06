"use client";

import "@/lib/zodJitless";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import { authInputCls, authLabelCls } from "@/components/ui/authInput";
import { apiMessage } from "@/features/account/passwordApi";
import { completeMfaLogin, type MfaLoginResult, type MfaRole } from "@/features/account/mfaApi";

const schema = z.object({ code: z.string().trim().min(6, "Enter the 6-digit code from your app").max(32, "That code is too long") });
type Values = z.infer<typeof schema>;

interface Props {
  role: MfaRole;
  /** From the password step; good for a few minutes and only for this step. */
  mfaToken: string;
  onVerified: (result: MfaLoginResult) => void;
  /** Back to the password form (the token is simply dropped). */
  onCancel: () => void;
}

/** The second step of signing in, for accounts that turned on two-step verification. */
export default function MfaChallenge({ role, mfaToken, onVerified, onCancel }: Props) {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  async function onSubmit({ code }: Values) {
    setServerError(null);
    try {
      onVerified(await completeMfaLogin(role, mfaToken, code));
    } catch (err) {
      setServerError(apiMessage(err, "We couldn't verify that code. Please try again."));
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex flex-col items-center gap-2 text-center">
        <ShieldOutlinedIcon sx={{ fontSize: 40 }} className="text-(--color-auth-primary)" />
        <h2 className="text-[20px] font-extrabold text-(--color-auth-ink)">Two-step verification</h2>
        <p className="text-[13px] text-(--color-auth-ink-muted)">Open your authenticator app and enter the 6-digit code for ShopRoom. Lost your phone? Use one of your recovery codes instead.</p>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="mfa-code" className={authLabelCls}>
          Code
        </label>
        <input
          id="mfa-code"
          {...register("code")}
          type="text"
          inputMode="text"
          autoComplete="one-time-code"
          autoFocus
          spellCheck={false}
          placeholder="123456"
          className={`${authInputCls(!!errors.code)} px-4 tracking-[3px]`}
        />
        {errors.code && <p className="text-[12px] text-(--color-danger)">{errors.code.message}</p>}
      </div>

      {serverError && (
        <p role="alert" className="rounded-lg bg-(--color-danger-bg) px-3 py-2 text-[12px] text-(--color-danger)">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="h-13 w-full rounded-lg bg-(--color-auth-primary) text-[15px] font-bold text-white transition-colors hover:bg-(--color-brand-primary-active) disabled:opacity-50"
      >
        {isSubmitting ? "Verifying…" : "Verify and sign in"}
      </button>
      <button type="button" onClick={onCancel} className="text-center text-[13px] font-bold text-(--color-auth-ink-muted) hover:underline">
        Use a different account
      </button>
    </form>
  );
}
