"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/utils/apiClient";
import { deleteCookie } from "@/utils/cookieUtils";
import type { AccountRole } from "@/features/account/passwordApi";

interface SignOutEverywhereCardProps {
  role: AccountRole;
  /** Runs first, while the session is still valid (the customer's push device is unregistered here). */
  onBeforeSignOut?: () => Promise<void>;
}

const CONFIG: Record<AccountRole, { endpoint: string; cookie: "token" | "shopkeeper_token"; loginPath: string }> = {
  customer: { endpoint: "/api/customers/me/logout-all", cookie: "token", loginPath: "/customer/login" },
  shopkeeper: { endpoint: "/api/shopkeeper/logout-all", cookie: "shopkeeper_token", loginPath: "/customer/login?tab=shopkeeper" },
};

export default function SignOutEverywhereCard({ role, onBeforeSignOut }: SignOutEverywhereCardProps) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { endpoint, cookie, loginPath } = CONFIG[role];

  async function signOutEverywhere() {
    setBusy(true);
    setError(null);
    try {
      await onBeforeSignOut?.().catch(() => undefined);
      await apiClient.post(endpoint, {});
      deleteCookie(cookie);
      router.replace(loginPath);
    } catch {
      setError("Could not sign you out everywhere. Please try again.");
      setBusy(false);
    }
  }

  return (
    <section className="rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-6">
      <h2 className="text-[16px] font-bold text-(--color-text-primary)">Sign out everywhere</h2>
      <p className="mt-1 text-[13px] text-(--color-text-secondary)">
        Lost a device, or used a shared computer? This ends every session on every device, including this one.
      </p>

      {error && (
        <p role="alert" className="mt-3 rounded-lg bg-(--color-danger-bg) px-3 py-2 text-[12px] text-(--color-danger)">
          {error}
        </p>
      )}

      {confirming ? (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => void signOutEverywhere()}
            disabled={busy}
            className="h-10 rounded-lg bg-(--color-danger) px-5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {busy ? "Signing out…" : "Yes, sign out everywhere"}
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            disabled={busy}
            className="h-10 rounded-lg border border-(--color-border-default) px-5 text-[13px] font-semibold text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover) disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="mt-4 h-10 rounded-lg border border-(--color-border-default) px-5 text-[13px] font-semibold text-(--color-text-primary) transition-colors hover:bg-(--color-bg-surface-hover)"
        >
          Sign out of all devices
        </button>
      )}
    </section>
  );
}
