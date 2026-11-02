import Image from "next/image";
import type { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

/** The centred logo-and-card layout shared by the standalone account pages. */
export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="flex flex-1 items-center justify-center bg-(--color-bg-page) px-4 py-10 sm:px-6">
      <div className="w-full max-w-120">
        <div className="mb-6 flex items-center justify-center gap-2 text-(--color-auth-ink)">
          <Image src="/ShopRoomIcon.svg" alt="ShopRoom" width={24} height={21} />
          <span className="text-[24px] leading-8 tracking-[-1.2px] font-bold">ShopRoom</span>
        </div>
        <div className="rounded-[14px] border border-(--color-border-default) bg-(--color-bg-surface) px-6 py-8 shadow-(--shadow-md) sm:px-10 sm:py-10">
          <div className="mb-7 flex flex-col items-center">
            <h1 className="text-center text-[24px] font-extrabold tracking-[-0.65px] text-(--color-auth-ink)">{title}</h1>
            {subtitle && <p className="mt-2 text-center text-[14px] text-(--color-auth-ink-muted)">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
