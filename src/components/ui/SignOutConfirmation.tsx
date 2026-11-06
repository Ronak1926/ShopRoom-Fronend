"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { isSignedIn, signOut, type SessionRole } from "../../utils/session";

/** Longest sign-out waits on cleanup; a slow network must not trap anyone signed in. */
const CLEANUP_TIMEOUT_MS = 3000;

interface Props {
  role: SessionRole;
  redirectTo: string;
  description: string;
  /**
   * Cleanup that needs the session while it still exists (e.g. unregistering a
   * push device). Best effort: failures and slow responses never block sign-out.
   */
  onBeforeSignOut?: () => Promise<void>;
}

export default function SignOutConfirmation({ role, redirectTo, description, onBeforeSignOut }: Props) {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!isSignedIn(role)) router.replace(redirectTo);
  }, [role, redirectTo, router]);

  async function handleSignOut() {
    setSigningOut(true);
    if (onBeforeSignOut) {
      await Promise.race([
        onBeforeSignOut().catch(() => {}),
        new Promise((resolve) => setTimeout(resolve, CLEANUP_TIMEOUT_MS)),
      ]);
    }
    await signOut(role).catch(() => {});
    setTimeout(() => router.replace(redirectTo), 600);
  }

  return (
    <div className="min-h-screen bg-(--color-bg-page) flex items-center justify-center px-4">
      <div className="w-full max-w-105">
        <div className="rounded-2xl bg-(--color-bg-surface) border border-(--color-border-default) shadow-(--shadow-lg) overflow-hidden">
          <div className="h-1 w-full bg-linear-to-r from-(--color-brand-primary) to-(--color-avatar-2)" />

          <div className="px-8 py-9">
            {/* Brand */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <Image src="/ShopRoomIcon.svg" alt="ShopRoom" width={22} height={20} />
              <span className="text-[20px] font-bold text-(--color-auth-ink) tracking-[-0.5px]">
                ShopRoom
              </span>
            </div>

            {/* Icon + heading */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-17 h-17 rounded-2xl bg-(--color-danger-light) flex items-center justify-center mb-5 shadow-[0_4px_12px_color-mix(in_srgb,var(--color-danger)_12%,transparent)]">
                <LogoutOutlinedIcon sx={{ fontSize: 30, color: "var(--color-danger)" }} />
              </div>
              <h1 className="text-[22px] font-extrabold text-(--color-auth-ink) tracking-[-0.5px] mb-1.5">
                Sign out?
              </h1>
              <p className="text-[13.5px] text-(--color-text-secondary) text-center leading-relaxed max-w-75">
                {description}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className="w-full h-11.5 rounded-xl bg-(--color-danger) hover:bg-(--color-danger-hover) active:bg-(--color-danger-active) text-white font-semibold text-[14px] border-0 cursor-pointer transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_4px_14px_color-mix(in_srgb,var(--color-danger)_22%,transparent)]"
              >
                {signingOut ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Signing out…
                  </>
                ) : (
                  "Sign Out"
                )}
              </button>

              <button
                onClick={() => router.back()}
                disabled={signingOut}
                className="w-full h-11.5 rounded-xl bg-transparent hover:bg-(--color-bg-page) text-(--color-text-secondary) hover:text-(--color-text-primary) font-semibold text-[14px] border border-(--color-border-default) cursor-pointer transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Cancel, take me back
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-[12px] text-(--color-text-hint) mt-5">
          Your rooms and data will remain intact. You can sign back in at any time.
        </p>
      </div>
    </div>
  );
}
