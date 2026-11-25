"use client";

import SignOutConfirmation from "@/components/ui/SignOutConfirmation";
import { unregisterCurrentDevice } from "@/features/push/pushDevice";

export default function CustomerLogoutPage() {
  return (
    <SignOutConfirmation
      role="customer"
      redirectTo="/customer/login"
      description="You'll need to sign back in to browse rooms and connect with your favourite shops."
      onBeforeSignOut={unregisterCurrentDevice}
    />
  );
}
