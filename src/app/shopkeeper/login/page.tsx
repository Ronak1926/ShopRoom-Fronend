"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * /shopkeeper/login is kept for backward-compat with any bookmarked or
 * hard-coded links. It immediately redirects to the unified /login page
 * with the shopkeeper tab pre-selected.
 */
export default function ShopkeeperLoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login?tab=shopkeeper");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
