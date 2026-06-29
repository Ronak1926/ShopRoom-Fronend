"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AuthLeftPanel } from "@/components/ui/AuthLeftPanel";
import { ShopkeeperLeftPanel } from "@/components/ui/ShopkeeperLeftPanel";
import { useAppDispatch } from "@/hooks/redux";
import { hydrateToken } from "@/features/auth/authSlice";
import { getCookie } from "@/utils/cookieUtils";
import CustomerForm from "./CustomerForm";
import ShopkeeperForm from "./ShopkeeperForm";

interface Props {
  initialTab: "customer" | "shopkeeper";
}

export default function LoginClient({ initialTab }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<"customer" | "shopkeeper">(initialTab);

  useEffect(() => {
    const customerToken = getCookie("token");
    const shopkeeperToken = getCookie("shopkeeper_token");
    if (customerToken) {
      dispatch(hydrateToken());
      router.replace("/customer/home");
    } else if (shopkeeperToken) {
      router.replace("/shopkeeper/dashboard");
    } else {
      dispatch(hydrateToken());
      setReady(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function switchTab(next: "customer" | "shopkeeper") {
    setTab(next);
    router.replace(`/login${next === "shopkeeper" ? "?tab=shopkeeper" : ""}`, {
      scroll: false,
    });
  }

  if (!ready) return null;

  const isShopkeeper = tab === "shopkeeper";

  return (
    <div className="flex flex-1 bg-(--color-bg-page)">
      {isShopkeeper ? <ShopkeeperLeftPanel /> : <AuthLeftPanel />}

      <div className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-120">
          <div className="flex items-center gap-2 text-(--color-auth-ink) mb-6 justify-center">
            <Image
              src="/ShopRoomIcon.svg"
              alt="ShopRoom"
              width={24}
              height={21}
            />
            <span className="text-[24px] leading-8 tracking-[-1.2px] font-bold">
              ShopRoom
            </span>
          </div>

          <div className="flex rounded-[10px] bg-(--color-auth-input-bg) p-1 mb-6">
            <button
              type="button"
              onClick={() => switchTab("customer")}
              className={`flex-1 text-center text-[13px] py-2 rounded-lg transition font-[inherit] ${
                !isShopkeeper
                  ? "font-semibold bg-(--color-bg-surface) text-(--color-auth-primary) shadow-sm"
                  : "font-medium text-(--color-auth-ink-muted) hover:text-(--color-auth-ink)"
              }`}
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => switchTab("shopkeeper")}
              className={`flex-1 text-center text-[13px] py-2 rounded-lg transition font-[inherit] ${
                isShopkeeper
                  ? "font-semibold bg-(--color-bg-surface) text-(--color-auth-primary) shadow-sm"
                  : "font-medium text-(--color-auth-ink-muted) hover:text-(--color-auth-ink)"
              }`}
            >
              Shopkeeper
            </button>
          </div>

          <div className="rounded-[14px] bg-(--color-bg-surface) px-10 py-10 shadow-[0_12px_40px_rgba(25,25,47,0.04)] border border-(--color-border-default)">
            <div className="flex flex-col items-center mb-7">
              <h1 className="text-[26px] font-extrabold text-(--color-auth-ink) tracking-[-0.65px]">
                {isShopkeeper ? "Shopkeeper Login" : "Welcome back"}
              </h1>
              <p className="mt-2 text-[14px] text-(--color-auth-ink-muted) text-center">
                {isShopkeeper
                  ? "Access your shop dashboard."
                  : "Find rooms near your favourite shops."}
              </p>
            </div>

            {isShopkeeper ? <ShopkeeperForm /> : <CustomerForm />}
          </div>

          <div className="mt-8 flex items-center justify-center gap-8 text-[10px] tracking-[2px] uppercase text-(--color-auth-ink-muted) opacity-50">
            <span>© 2026 SHOPROOM</span>
            <span>PRIVACY POLICY</span>
            <span>HELP CENTER</span>
          </div>
        </div>
      </div>
    </div>
  );
}
