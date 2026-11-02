"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import LinkOffOutlinedIcon from "@mui/icons-material/LinkOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

import { AuthCard } from "@/components/ui/AuthCard";
import { authInputCls, authLabelCls } from "@/components/ui/authInput";
import { resetPasswordSchema, type ResetPasswordValues } from "@/features/account/passwordSchema";
import { apiMessage, isAccountRole, resetPassword, type AccountRole } from "@/features/account/passwordApi";

interface ResetLink {
  token: string;
  role: AccountRole;
}

/** The emailed link is /reset-password#token=…&role=…; a fragment never reaches a server or a Referer header. */
function readLink(hash: string): ResetLink | null {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  const token = params.get("token");
  const role = params.get("role");
  return token && isAccountRole(role) ? { token, role } : null;
}

// The fragment is wiped from the address bar once read, so the link it held is remembered here.
let capturedHash = "";
let capturedLink: ResetLink | null = null;

function currentLink(): ResetLink | null {
  const hash = window.location.hash;
  if (hash && hash !== capturedHash) {
    capturedHash = hash;
    capturedLink = readLink(hash);
  }
  return capturedLink;
}

const subscribe = () => () => {};
const NOT_READ = Symbol("not read yet");

export default function ResetPasswordForm() {
  // The server (and the hydrating client) cannot see the fragment, so they render nothing first.
  const read = useSyncExternalStore<ResetLink | null | typeof NOT_READ>(subscribe, currentLink, () => NOT_READ);
  const link = read === NOT_READ ? null : read;
  const checked = read !== NOT_READ;
  const [done, setDone] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ResetPasswordValues>({ resolver: zodResolver(resetPasswordSchema), mode: "onTouched" });

  useEffect(() => {
    // The token now lives only in memory: take it out of the address bar and history.
    if (window.location.hash) window.history.replaceState(null, "", window.location.pathname);
  }, []);

  if (!checked) return null;

  if (!link) {
    return (
      <AuthCard title="This link doesn't work" subtitle="It may be incomplete, already used, or expired.">
        <div className="flex flex-col items-center gap-5 text-center">
          <LinkOffOutlinedIcon sx={{ fontSize: 44 }} className="text-(--color-auth-ink-muted)" />
          <Link href="/forgot-password" className="text-[13px] font-bold text-(--color-auth-primary)">
            Request a new link
          </Link>
        </div>
      </AuthCard>
    );
  }

  const loginHref = link.role === "shopkeeper" ? "/customer/login?tab=shopkeeper" : "/customer/login";

  if (done) {
    return (
      <AuthCard title="Password updated" subtitle="You can sign in with your new password now. Other devices have been signed out.">
        <div className="flex flex-col items-center gap-5">
          <CheckCircleOutlinedIcon sx={{ fontSize: 44 }} className="text-(--color-success)" />
          <Link
            href={loginHref}
            className="flex h-13 w-full items-center justify-center rounded-lg bg-(--color-auth-primary) text-[15px] font-bold text-white transition-colors hover:bg-(--color-brand-primary-active)"
          >
            Log in
          </Link>
        </div>
      </AuthCard>
    );
  }

  async function onSubmit(values: ResetPasswordValues) {
    if (!link) return;
    setServerError(null);
    try {
      await resetPassword(link.role, link.token, values.password);
      setDone(true);
    } catch (err) {
      setServerError(apiMessage(err, "Could not update the password. Please try again."));
    }
  }

  return (
    <AuthCard title="Choose a new password" subtitle="Use at least 8 characters.">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className={authLabelCls}>
            New password
          </label>
          <div className="relative">
            <input
              id="password"
              {...register("password")}
              type={showPw ? "text" : "password"}
              autoComplete="new-password"
              className={`${authInputCls(!!errors.password)} pl-4 pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              aria-label={showPw ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-(--color-auth-ink-muted)"
            >
              {showPw ? <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} /> : <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />}
            </button>
          </div>
          {errors.password && <p className="text-[11px] text-(--color-danger)">{errors.password.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="confirm" className={authLabelCls}>
            Confirm new password
          </label>
          <input
            id="confirm"
            {...register("confirm")}
            type={showPw ? "text" : "password"}
            autoComplete="new-password"
            className={`${authInputCls(!!errors.confirm)} px-4`}
          />
          {errors.confirm && <p className="text-[11px] text-(--color-danger)">{errors.confirm.message}</p>}
        </div>

        {serverError && (
          <p role="alert" className="rounded-lg bg-(--color-danger-bg) px-3 py-2 text-[12px] text-(--color-danger)">
            {serverError}{" "}
            <Link href="/forgot-password" className="font-bold underline">
              Request a new link
            </Link>
          </p>
        )}

        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="mt-1 h-13 w-full rounded-lg bg-(--color-auth-primary) text-[15px] font-bold text-white transition-colors hover:bg-(--color-brand-primary-active) disabled:opacity-50"
        >
          {isSubmitting ? "Saving…" : "Update password"}
        </button>
      </form>
    </AuthCard>
  );
}
