"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getCookie, deleteCookie } from "../../../utils/cookieUtils";

export default function ShopkeeperLogoutPage() {
  const router = useRouter();
  const [shopName, setShopName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    // If not logged in, redirect immediately
    const token = getCookie("shopkeeper_token");
    if (!token) {
      router.replace("/login?tab=shopkeeper");
      return;
    }
    // Decode email from JWT payload (base64, no verification — display only)
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.email) setEmail(payload.email);
      if (payload.shopName) setShopName(payload.shopName);
    } catch {
      // ignore — display fields stay null
    }
  }, [router]);

  function handleSignOut() {
    setSigningOut(true);
    deleteCookie("shopkeeper_token");
    // Small delay so the button animation is visible before redirect
    setTimeout(() => {
      router.replace("/login?tab=shopkeeper");
    }, 600);
  }

  return (
    <div className="min-h-screen bg-(--color-bg-page) flex items-center justify-center px-4">
      <div className="w-full max-w-105">
        {/* Card */}
        <div className="rounded-2xl bg-(--color-bg-surface) border border-(--color-border-default) shadow-[0_16px_48px_rgba(25,25,47,0.07)] overflow-hidden">
          {/* Top accent bar */}
          <div className="h-1 w-full bg-linear-to-r from-(--color-brand-primary) to-[#8b74f5]" />

          <div className="px-8 py-9">
            {/* Brand */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <Image
                src="/ShopRoomIcon.svg"
                alt="ShopRoom"
                width={22}
                height={20}
              />
              <span className="text-[20px] font-bold text-(--color-auth-ink) tracking-[-0.5px]">
                ShopRoom
              </span>
            </div>

            {/* Icon */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-17 h-17 rounded-2xl bg-(--color-danger-light) flex items-center justify-center mb-5 shadow-[0_4px_12px_rgba(226,75,74,0.12)]">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M16 17l5-5-5-5"
                    stroke="var(--color-danger)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 12H9"
                    stroke="var(--color-danger)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"
                    stroke="var(--color-danger)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <h1 className="text-[22px] font-extrabold text-(--color-auth-ink) tracking-[-0.5px] mb-1.5">
                Sign out?
              </h1>
              <p className="text-[13.5px] text-(--color-text-secondary) text-center leading-relaxed max-w-75">
                You&apos;ll need to sign back in to manage your shop and send
                stock alerts to your room.
              </p>
            </div>

            {/* Account info pill */}
            {email && (
              <div className="flex items-center gap-3 bg-(--color-bg-page) border border-(--color-border-default) rounded-xl px-4 py-3 mb-7">
                <div className="w-8 h-8 rounded-full bg-(--color-brand-primary-light) flex items-center justify-center shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="12"
                      cy="8"
                      r="4"
                      stroke="var(--color-brand-primary)"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
                      stroke="var(--color-brand-primary)"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div className="min-w-0">
                  {shopName && (
                    <div className="text-[13px] font-semibold text-(--color-text-primary) truncate">
                      {shopName}
                    </div>
                  )}
                  <div className="text-[12px] text-(--color-text-secondary) truncate">
                    {email}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className="w-full h-11.5 rounded-xl bg-(--color-danger) hover:bg-[#c93e3d] active:bg-[#b53535] text-white font-semibold text-[14px] border-0 cursor-pointer transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(226,75,74,0.22)]"
              >
                {signingOut ? (
                  <>
                    <svg
                      className="animate-spin"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="2.5"
                      />
                      <path
                        d="M12 2a10 10 0 0110 10"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
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

        {/* Footer note */}
        <p className="text-center text-[12px] text-(--color-text-hint) mt-5">
          Your room and data will remain intact. You can sign back in at any
          time.
        </p>
      </div>
    </div>
  );
}
