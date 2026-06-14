"use client";

import Image from "next/image";
import Link from "next/link";

export default function ShopkeeperSuccessPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] flex items-center justify-center px-6">
      <div className="w-full max-w-[440px] rounded-[14px] bg-[var(--color-bg-surface)] px-8 py-10 shadow-[0_12px_40px_rgba(25,25,47,0.06)] border border-[var(--color-border-default)] text-center">
        <div className="flex items-center gap-2 justify-center mb-8 text-[var(--color-auth-ink)]">
          <Image
            src="/ShopRoomIcon.svg"
            alt="ShopRoom"
            width={24}
            height={21}
          />
          <span className="text-[22px] font-bold tracking-[-1px]">
            ShopRoom
          </span>
        </div>

        <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-5">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>

        <h1 className="text-[22px] font-extrabold text-[var(--color-auth-ink)] tracking-[-0.5px] mb-2">
          You&apos;re all set!
        </h1>
        <p className="text-[14px] text-[var(--color-auth-ink-muted)] mb-6">
          Your shop has been registered on ShopRoom. You can now log in to your
          shopkeeper dashboard and start connecting with customers.
        </p>

        <Link
          href="/login?tab=shopkeeper"
          className="block h-[46px] w-full rounded-[8px] bg-[var(--color-auth-primary)] text-white font-semibold text-[14px] leading-[46px] hover:bg-[var(--color-brand-primary-active)] transition"
        >
          Go to Login →
        </Link>
      </div>
    </div>
  );
}
