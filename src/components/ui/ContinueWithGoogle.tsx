"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";

import { firebaseAuth, googleProvider } from "../../lib/firebase";
import { googleAuthCustomer } from "../../features/auth/authSlice";
import { useAppDispatch } from "../../hooks/redux";

export function ContinueWithGoogle() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pick up result after a signInWithRedirect (popup-blocked fallback)
  useEffect(() => {
    let cancelled = false;
    getRedirectResult(firebaseAuth)
      .then(async (result) => {
        if (cancelled || !result) return;
        setLoading(true);
        const idToken = await result.user.getIdToken();
        const action = await dispatch(googleAuthCustomer({ idToken }));
        if (cancelled) return;
        if (googleAuthCustomer.fulfilled.match(action)) {
          router.push("/");
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
  }, [dispatch, router]);

  // NOT async — signInWithPopup must be called synchronously so the browser
  // recognises it as a direct user gesture (prevents popup-blocked errors)
  function handleClick() {
    setError(null);
    signInWithPopup(firebaseAuth, googleProvider)
      .then(async (result) => {
        setLoading(true);
        const idToken = await result.user.getIdToken();
        const action = await dispatch(googleAuthCustomer({ idToken }));
        if (googleAuthCustomer.fulfilled.match(action)) {
          router.push("/");
        } else {
          setError((action.payload as string) ?? "Google sign-in failed");
          setLoading(false);
        }
      })
      .catch((err: any) => {
        if (err?.code === "auth/popup-blocked") {
          // Popup was blocked — fall back to full-page redirect
          signInWithRedirect(firebaseAuth, googleProvider).catch((e) => {
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
        className="w-full h-[50px] rounded-[8px] border border-[#C9C4D7]/30 px-6 py-[14px] flex items-center justify-center gap-3 bg-white hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
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
        <p className="mt-2 text-center text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
