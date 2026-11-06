"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/customer/Sidebar";
import PushNotificationsCard from "@/components/customer/PushNotificationsCard";
import ChangePasswordCard from "@/components/account/ChangePasswordCard";
import SignOutEverywhereCard from "@/components/account/SignOutEverywhereCard";
import { useAppDispatch } from "@/hooks/redux";
import { hydrateToken } from "@/features/auth/authSlice";
import { unregisterCurrentDevice } from "@/features/push/pushDevice";
import { getCookie } from "@/utils/cookieUtils";

export default function CustomerSettings() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!getCookie("token")) router.replace("/customer/login");
  }, [router]);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-(--color-bg-page) text-(--color-text-primary) lg:flex-row">
      <Sidebar />
      <div className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="mx-auto flex max-w-2xl flex-col gap-5">
          <div>
            <h1 className="text-2xl font-bold text-(--color-text-primary)">Settings</h1>
            <p className="mt-1 text-sm text-(--color-text-secondary)">Notifications, password and sessions.</p>
          </div>
          <PushNotificationsCard />
          <ChangePasswordCard role="customer" onTokenRefreshed={() => dispatch(hydrateToken())} />
          <SignOutEverywhereCard role="customer" onBeforeSignOut={unregisterCurrentDevice} />
        </div>
      </div>
    </div>
  );
}
