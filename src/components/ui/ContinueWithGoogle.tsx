"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";

import { firebaseAuth, googleProvider, popupResolver } from "../../lib/firebase";
import { googleAuthCustomer } from "../../features/auth/authSlice";
import { useAppDispatch } from "../../hooks/redux";
import { nextAfterAuth } from "../../lib/safeRedirect";

/** Set just before leaving for Google's page, so only the return trip asks Firebase for a redirect result. */
const REDIRECT_PENDING_KEY = "shoproom_google_redirect";

function redirectPending(): boolean {
  try {
    return sessionStorage.getItem(REDIRECT_PENDING_KEY) === "1";
  } catch {
    return false;
  }
}

function setRedirectPending(pending: boolean): void {
  try {
    if (pending) sessionStorage.setItem(REDIRECT_PENDING_KEY, "1");
    else sessionStorage.removeItem(REDIRECT_PENDING_KEY);
  } catch {
    // Storage blocked: the sign-in just won't resume after a redirect.
  }
}

interface Props {
  /** Google accepted the person but their account needs a code from its authenticator app. */
  onMfaRequired?: (mfaToken: string) => void;
}

export function ContinueWithGoogle({ onMfaRequired }: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pick up result after a signInWithRedirect (popup-blocked fallback)
  useEffect(() => {
    // Looking for a redirect result loads Google's scripts, so it is only done when we sent the person away.
    if (!redirectPending()) return;
    setRedirectPending(false);
    let cancelled = false;
    getRedirectResult(firebaseAuth, popupResolver)
      .then(async (result) => {
        if (cancelled || !result) return;
        setLoading(true);
        const idToken = await result.user.getIdToken();
        const action = await dispatch(googleAuthCustomer({ idToken }));
        if (cancelled) return;
        if (googleAuthCustomer.fulfilled.match(action)) {
          if ("mfaRequired" in action.payload) {
            setLoading(false);
            onMfaRequired?.(action.payload.mfaToken);
            return;
          }
          router.push(nextAfterAuth());
        } else {
          setError((action.payload as string) ?? "Google sign-in failed");
          setLoading(false);
        }
      })
      .catch((err: any) => {
        if (!cancelled) {
          console.error("[Google Auth redirect result]", err);
          setError(err?.message ?? "Google sign-in failed");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [dispatch, router, onMfaRequired]);

  // NOT async — signInWithPopup must be called synchronously so the browser
  // recognises it as a direct user gesture (prevents popup-blocked errors)
  function handleClick() {
    setError(null);
    signInWithPopup(firebaseAuth, googleProvider, popupResolver)
      .then(async (result) => {
        setLoading(true);
        const idToken = await result.user.getIdToken();
        const action = await dispatch(googleAuthCustomer({ idToken }));
        if (googleAuthCustomer.fulfilled.match(action)) {
          if ("mfaRequired" in action.payload) {
            setLoading(false);
            onMfaRequired?.(action.payload.mfaToken);
            return;
          }
          router.push(nextAfterAuth());
        } else {
          setError((action.payload as string) ?? "Google sign-in failed");
          setLoading(false);
        }
      })
      .catch((err: any) => {
        if (err?.code === "auth/popup-blocked") {
          // Popup was blocked — fall back to full-page redirect
          setRedirectPending(true);
          signInWithRedirect(firebaseAuth, googleProvider, popupResolver).catch((e) => {
            setRedirectPending(false);
            setError(e?.message ?? "Google sign-in failed");
          });
        } else if (err?.code !== "auth/popup-closed-by-user") {
          console.error("[Google Auth popup]", err);
          setError(err?.message ?? "Google sign-in failed");
        }
      });
  }

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="w-full h-[50px] rounded-[8px] border border-(--color-border-default)/30 px-6 py-[14px] flex items-center justify-center gap-3 bg-(--color-bg-surface) hover:bg-(--color-bg-surface-hover) transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <Image
          src="/Google.svg"
          alt="Google"
          width={20}
          height={20}
          className="shrink-0"
        />
        <span className="text-[14px] leading-[20px] font-medium text-[var(--color-auth-ink)]">
          {loading ? "Signing in…" : "Continue with Google"}
        </span>
      </button>
      {error && (
        <p className="mt-2 text-center text-xs text-(--color-danger)">{error}</p>
      )}
    </div>
  );
}
