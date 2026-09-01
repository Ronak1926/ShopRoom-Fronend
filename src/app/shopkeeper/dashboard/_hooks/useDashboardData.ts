"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/utils/apiClient";
import { getCookie, deleteCookie } from "@/utils/cookieUtils";
import { listDesigns, type DesignSummary } from "@/features/notifications/api";

/** Distance bands the audience donut splits members into. */
export const DISTANCE_BANDS = [
  { label: "0 – 2 km", max: 2 },
  { label: "2 – 5 km", max: 5 },
  { label: "5 – 10 km", max: 10 },
] as const;

/** The radius the "people near the shop" figures are measured against. */
export const NEARBY_RADIUS_KM = 10;

export interface RoomMember {
  customerId: string;
  customerName: string;
  joinedAt: string;
  /** Null when the member shares no location, or the shop has no coordinates. */
  distanceKm: number | null;
}

export interface AudienceStats {
  /** Members inside NEARBY_RADIUS_KM. */
  nearby: number;
  bands: { label: string; count: number }[];
  /** Members whose location cannot be placed — off, or no shop coordinates. */
  unknown: number;
}

export interface DashboardSnapshot {
  shopName: string;
  category: string;
  logoUrl: string | null;
  place: string;
  hasCoordinates: boolean;
  planType: string;
  roomId: string | null;
  inviteCode: string | null;
  inviteLink: string | null;
  members: RoomMember[];
  membersTotal: number;
  designs: DesignSummary[];
  designTotal: number;
  draftTotal: number;
  audience: AudienceStats;
}

interface DashboardResponse {
  shop: { shopName: string; category: string; logoUrl: string | null };
  room: {
    roomId: string;
    inviteCode: string;
    inviteLink: string;
    membersCount: number;
  } | null;
}

interface ProfileResponse {
  shop: { address: string; city: string; latitude: number | null; longitude: number | null };
  plan: { planType: string };
}

interface RoomMembersResponse {
  members: RoomMember[];
  total: number;
}

function buildAudience(members: RoomMember[]): AudienceStats {
  // Each band is (previous max, max]; the first also takes members standing at
  // the shop itself, hence the -1 floor.
  const bands = DISTANCE_BANDS.map((band, i) => {
    const min = i === 0 ? -1 : DISTANCE_BANDS[i - 1].max;
    return {
      label: band.label,
      count: members.filter(
        (m) => m.distanceKm !== null && m.distanceKm > min && m.distanceKm <= band.max,
      ).length,
    };
  });

  return {
    nearby: members.filter((m) => m.distanceKm !== null && m.distanceKm <= NEARBY_RADIUS_KM)
      .length,
    bands,
    unknown: members.filter((m) => m.distanceKm === null).length,
  };
}

/** Joins per day across the window, oldest first. Exact — every member is here. */
export function joinsByDay(members: RoomMember[], days: number): { date: Date; count: number }[] {
  const dayMs = 86_400_000;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const first = today.getTime() - (days - 1) * dayMs;

  const buckets = new Map<number, number>();
  for (const member of members) {
    const at = new Date(member.joinedAt);
    at.setHours(0, 0, 0, 0);
    const key = at.getTime();
    if (key >= first) buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }

  return Array.from({ length: days }, (_, i) => {
    const date = new Date(first + i * dayMs);
    return { date, count: buckets.get(date.getTime()) ?? 0 };
  });
}

/** Members who joined inside the window, and the change against the one before. */
export function joinTrend(members: RoomMember[], days: number): { count: number; delta: number } {
  const dayMs = 86_400_000;
  const now = Date.now();
  const inWindow = (from: number, to: number) =>
    members.filter((m) => {
      const at = new Date(m.joinedAt).getTime();
      return at >= from && at < to;
    }).length;

  const count = inWindow(now - days * dayMs, now + 1);
  const previous = inWindow(now - 2 * days * dayMs, now - days * dayMs);
  return {
    count,
    delta: previous ? Math.round(((count - previous) / previous) * 1000) / 10 : 0,
  };
}

/**
 * Everything the dashboard draws.
 *
 * Shop, profile and designs go out together; the member list needs the room id
 * from the first wave, and is worth the extra round trip because it carries
 * every member with a distance from the shop — which is what makes the audience
 * figures exact rather than sampled.
 */
export function useDashboardData() {
  const router = useRouter();
  const [data, setData] = useState<DashboardSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const token = getCookie("shopkeeper_token");
    if (!token) {
      router.replace("/customer/login?tab=shopkeeper");
      return;
    }
    const auth = { headers: { Authorization: `Bearer ${token}` } };

    setLoading(true);
    try {
      const [dashboard, profile, designs, drafts] = await Promise.all([
        apiClient.get<DashboardResponse>("/api/shop/dashboard", auth),
        apiClient.get<ProfileResponse>("/api/shop/profile", auth),
        listDesigns({ archived: false, limit: 6 }),
        listDesigns({ archived: false, status: "DRAFT", limit: 1 }),
      ]);

      const room = dashboard.data.room;
      let members: RoomMember[] = [];
      if (room) {
        const roomMembers = await apiClient.get<RoomMembersResponse>(
          `/api/rooms/${room.roomId}/members`,
          auth,
        );
        members = roomMembers.data.members;
      }

      setData({
        shopName: dashboard.data.shop.shopName,
        category: dashboard.data.shop.category,
        logoUrl: dashboard.data.shop.logoUrl,
        place: [profile.data.shop.address, profile.data.shop.city].filter(Boolean).join(", "),
        hasCoordinates:
          profile.data.shop.latitude !== null && profile.data.shop.longitude !== null,
        planType: profile.data.plan.planType,
        roomId: room?.roomId ?? null,
        inviteCode: room?.inviteCode ?? null,
        inviteLink: room?.inviteLink ?? null,
        members,
        membersTotal: room?.membersCount ?? members.length,
        designs: designs.items,
        designTotal: designs.total,
        draftTotal: drafts.total,
        audience: buildAudience(members),
      });
      setError(null);
    } catch (err) {
      const status =
        typeof err === "object" && err !== null && "response" in err
          ? (err as { response?: { status?: number } }).response?.status
          : undefined;
      if (status === 401) {
        deleteCookie("shopkeeper_token");
        router.replace("/customer/login?tab=shopkeeper");
        return;
      }
      setError("Could not load your dashboard. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void load();
  }, [load]);

  return { data, loading, error, reload: load };
}
