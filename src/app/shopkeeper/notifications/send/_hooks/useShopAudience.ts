"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/utils/apiClient";
import { getCookie } from "@/utils/cookieUtils";

/** What the send flow needs to know about the shop it is sending from. */
export interface ShopAudience {
  shopName: string;
  logoUrl: string | null;
  /** "Bandra, Mumbai" — the centre point radius targeting measures from. */
  place: string;
  /** False when the shop has no coordinates, which rules out radius targeting. */
  hasCoordinates: boolean;
  membersCount: number;
}

interface ProfileResponse {
  shop: {
    shopName: string;
    logoUrl: string | null;
    address: string;
    city: string;
    latitude: number | null;
    longitude: number | null;
  };
  room: { membersCount: number };
}

export function useShopAudience() {
  const [shop, setShop] = useState<ShopAudience | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    apiClient
      .get<ProfileResponse>("/api/shop/profile", {
        headers: { Authorization: `Bearer ${getCookie("shopkeeper_token")}` },
      })
      .then(({ data }) => {
        if (cancelled) return;
        setShop({
          shopName: data.shop.shopName,
          logoUrl: data.shop.logoUrl,
          place: [data.shop.address, data.shop.city].filter(Boolean).join(", "),
          hasCoordinates: data.shop.latitude !== null && data.shop.longitude !== null,
          membersCount: data.room.membersCount,
        });
      })
      .catch(() => {
        // The page still composes without it: the audience tile falls back to
        // "counted at send time" and radius targeting explains it is unset.
        if (!cancelled) setShop(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { shop, loading };
}
