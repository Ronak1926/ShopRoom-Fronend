"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../dashboard/_components/Sidebar";
import TopBar from "../dashboard/_components/TopBar";
import ProfileSkeleton from "./_components/ProfileSkeleton";
import ProfileShopCard from "./_components/ProfileShopCard";
import ProfilePlanCard from "./_components/ProfilePlanCard";
import ProfileRoomCard from "./_components/ProfileRoomCard";
import ProfileShopDetailsCard from "./_components/ProfileShopDetailsCard";
import ProfileAccountCard from "./_components/ProfileAccountCard";
import { apiClient } from "../../../utils/apiClient";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ProfileData {
  shopkeeper: { id: string; email: string; createdAt: string };
  shop: {
    shopName: string;
    category: string;
    description: string | null;
    logoUrl: string | null;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phoneNumber: string;
    latitude: number | null;
    longitude: number | null;
    createdAt: string;
  };
  plan: { planType: string; planExpiresAt: string };
  room: {
    inviteCode: string;
    coverUrl: string | null;
    membersCount: number;
    createdAt: string;
  };
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ShopkeeperProfilePage() {
  const router = useRouter();
  const [initialLoading, setInitialLoading] = useState(true);
  const [data, setData] = useState<ProfileData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("shopkeeper_token");
    if (!token) {
      router.replace("/login?tab=shopkeeper");
      return;
    }

    apiClient
      .get<ProfileData>("/api/shop/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res: { data: ProfileData }) => setData(res.data))
      .catch((err: { response?: { status: number } }) => {
        if (err?.response?.status === 401) {
          localStorage.removeItem("shopkeeper_token");
          router.replace("/login?tab=shopkeeper");
        }
      })
      .finally(() => setInitialLoading(false));
  }, [router]);

  function handleNavChange(id: string) {
    if (id === "profile") return;
    if (id === "myroom") {
      router.push("/shopkeeper/room/_");
    } else if (id === "settings") {
      router.push("/shopkeeper/settings");
    } else {
      router.push("/shopkeeper/dashboard");
    }
  }

  return (
    <div className="flex h-screen bg-(--color-bg-page) text-(--color-text-primary) overflow-hidden">
      <Sidebar activeNav="profile" onNavChange={handleNavChange} />

      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <TopBar />

        {initialLoading ? (
          <ProfileSkeleton />
        ) : data ? (
          <main className="flex-1 p-7 overflow-y-auto">
            <h1 className="text-[28px] font-bold text-(--color-text-primary) mb-6">
              Shop Profile
            </h1>

            <div className="flex gap-6 items-start">
              {/* Left column */}
              <div className="w-[340px] shrink-0 flex flex-col gap-4">
                <ProfileShopCard
                  shopName={data.shop.shopName}
                  category={data.shop.category}
                  logoUrl={data.shop.logoUrl}
                  createdAt={data.shop.createdAt}
                />
                <ProfilePlanCard
                  planType={data.plan.planType}
                  planExpiresAt={data.plan.planExpiresAt}
                />
                <ProfileRoomCard
                  membersCount={data.room.membersCount}
                  inviteCode={data.room.inviteCode}
                  createdAt={data.room.createdAt}
                  coverUrl={data.room.coverUrl}
                />
              </div>

              {/* Right column */}
              <div className="flex-1 flex flex-col gap-4">
                <ProfileShopDetailsCard
                  address={data.shop.address}
                  city={data.shop.city}
                  state={data.shop.state}
                  pincode={data.shop.pincode}
                  phoneNumber={data.shop.phoneNumber}
                  latitude={data.shop.latitude}
                  longitude={data.shop.longitude}
                  description={data.shop.description}
                />
                <ProfileAccountCard
                  id={data.shopkeeper.id}
                  email={data.shopkeeper.email}
                  createdAt={data.shopkeeper.createdAt}
                />
              </div>
            </div>
          </main>
        ) : (
          <main className="flex-1 p-7 flex items-center justify-center">
            <p className="text-(--color-text-secondary)">
              Failed to load profile. Please try again.
            </p>
          </main>
        )}
      </div>
    </div>
  );
}
