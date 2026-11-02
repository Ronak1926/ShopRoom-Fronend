"use client";

import Link from "next/link";
import type { ElementType } from "react";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import ShopkeeperShell from "@/components/shopkeeper/ShopkeeperShell";
import ChangePasswordCard from "@/components/account/ChangePasswordCard";
import SignOutEverywhereCard from "@/components/account/SignOutEverywhereCard";

const SHORTCUTS: { href: string; title: string; note: string; icon: ElementType }[] = [
  { href: "/shopkeeper/notifications/preferences", title: "Notification preferences", note: "Quiet hours, weekends and expiry", icon: TuneOutlinedIcon },
  { href: "/shopkeeper/billing", title: "Plan & billing", note: "Renew your plan, see payments", icon: CreditCardOutlinedIcon },
  { href: "/shopkeeper/profile", title: "Shop profile", note: "Details, logo and deleting your account", icon: StorefrontOutlinedIcon },
];

export default function ShopkeeperSettings() {
  return (
    <ShopkeeperShell>
      <div className="mx-auto flex max-w-3xl flex-col gap-5">
        <div>
          <h1 className="text-[28px] font-bold text-(--color-text-primary)">Settings</h1>
          <p className="mt-1 text-[14px] text-(--color-text-secondary)">Your account, password and sessions.</p>
        </div>

        <ul className="grid gap-3 sm:grid-cols-3">
          {SHORTCUTS.map(({ href, title, note, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className="flex h-full items-start gap-3 rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-4 transition-colors hover:border-(--color-brand-primary)"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-(--color-brand-primary-light) text-(--color-brand-primary)">
                  <Icon sx={{ fontSize: 18 }} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-semibold text-(--color-text-primary)">{title}</span>
                  <span className="block text-[11.5px] text-(--color-text-hint)">{note}</span>
                </span>
                <ChevronRightOutlinedIcon sx={{ fontSize: 16 }} className="mt-1 text-(--color-text-hint)" />
              </Link>
            </li>
          ))}
        </ul>

        <ChangePasswordCard role="shopkeeper" />
        <SignOutEverywhereCard role="shopkeeper" />
      </div>
    </ShopkeeperShell>
  );
}
