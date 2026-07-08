"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import { useRouter } from "next/navigation";
import Sidebar from "../dashboard/_components/Sidebar";
import TopBar from "../dashboard/_components/TopBar";
import ProfileSkeleton from "./_components/ProfileSkeleton";
import ProfileShopCard from "./_components/ProfileShopCard";
import ProfilePlanCard from "./_components/ProfilePlanCard";
import ProfileRoomCard from "./_components/ProfileRoomCard";
import ProfileShopDetailsCard from "./_components/ProfileShopDetailsCard";
import ProfileAccountCard from "./_components/ProfileAccountCard";
import { shopProfileSchema, type ShopProfileFormValues } from "./_schemas/shopProfileSchema";
import { apiClient, setAuthToken } from "../../../utils/apiClient";
import { getCookie, deleteCookie } from "../../../utils/cookieUtils";

// ── Types ────────────────────────────────────────────────────────────────────

interface ProfileData {
  shopkeeper: { id: string; email: string; ownerName: string | null; createdAt: string };
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

// ── Component ────────────────────────────────────────────────────────────────

export default function ShopkeeperProfilePage() {
  const router = useRouter();
  const [initialLoading, setInitialLoading] = useState(true);
  const [data, setData] = useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ShopProfileFormValues>({ resolver: zodResolver(shopProfileSchema) });

  useEffect(() => {
    const token = getCookie("shopkeeper_token");
    if (!token) {
      router.replace("/customer/login?tab=shopkeeper");
      return;
    }
    setAuthToken(token);

    apiClient
      .get<ProfileData>("/api/shop/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res: { data: ProfileData }) => {
        setData(res.data);
        setLogoUrl(res.data.shop.logoUrl);
        reset({
          shopName: res.data.shop.shopName,
          category: res.data.shop.category,
          description: res.data.shop.description ?? "",
          address: res.data.shop.address,
          city: res.data.shop.city,
          state: res.data.shop.state,
          pincode: res.data.shop.pincode,
          phoneNumber: res.data.shop.phoneNumber,
          ownerName: res.data.shopkeeper.ownerName ?? "",
        });
      })
      .catch((err: { response?: { status: number } }) => {
        if (err?.response?.status === 401) {
          deleteCookie("shopkeeper_token");
          router.replace("/customer/login?tab=shopkeeper");
        }
      })
      .finally(() => setInitialLoading(false));
  }, [router, reset]);

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

  async function onSubmit(values: ShopProfileFormValues) {
    setSaving(true);
    try {
      await apiClient.patch("/api/shop/profile", values);
      setData((prev) =>
        prev
          ? {
              ...prev,
              shopkeeper: { ...prev.shopkeeper, ownerName: values.ownerName || null },
              shop: {
                ...prev.shop,
                shopName: values.shopName,
                category: values.category,
                description: values.description || null,
                address: values.address,
                city: values.city,
                state: values.state,
                pincode: values.pincode,
                phoneNumber: values.phoneNumber,
              },
            }
          : prev,
      );
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    if (!data) return;
    reset({
      shopName: data.shop.shopName,
      category: data.shop.category,
      description: data.shop.description ?? "",
      address: data.shop.address,
      city: data.shop.city,
      state: data.shop.state,
      pincode: data.shop.pincode,
      phoneNumber: data.shop.phoneNumber,
      ownerName: data.shopkeeper.ownerName ?? "",
    });
    setIsEditing(false);
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
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-[28px] font-bold text-(--color-text-primary)">
                Shop Profile
              </h1>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={saving}
                    className="h-9 px-4 flex items-center gap-1.5 rounded-lg text-[13px] font-semibold text-(--color-text-secondary) bg-(--color-bg-surface) border border-(--color-border-default) cursor-pointer hover:bg-(--color-bg-surface-hover) disabled:opacity-50"
                  >
                    <CloseOutlinedIcon sx={{ fontSize: 16 }} /> Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit(onSubmit)}
                    disabled={saving}
                    className="h-9 px-4 flex items-center gap-1.5 rounded-lg text-[13px] font-semibold text-white bg-(--color-brand-primary) hover:bg-(--color-brand-primary-hover) border-0 cursor-pointer disabled:opacity-50"
                  >
                    <CheckOutlinedIcon sx={{ fontSize: 16 }} /> {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="h-9 px-4 flex items-center gap-1.5 rounded-lg text-[13px] font-semibold text-(--color-brand-primary) bg-(--color-brand-primary-light) border-0 cursor-pointer hover:opacity-90"
                >
                  <EditOutlinedIcon sx={{ fontSize: 16 }} /> Edit Profile
                </button>
              )}
            </div>

            <div className="flex gap-6 items-start">
              {/* Left column */}
              <div className="w-[340px] shrink-0 flex flex-col gap-4">
                <ProfileShopCard
                  shopName={data.shop.shopName}
                  category={data.shop.category}
                  logoUrl={logoUrl}
                  createdAt={data.shop.createdAt}
                  editing={isEditing}
                  register={register}
                  errors={errors}
                  onLogoUploaded={setLogoUrl}
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
                  editing={isEditing}
                  register={register}
                  errors={errors}
                />
                <ProfileAccountCard
                  id={data.shopkeeper.id}
                  email={data.shopkeeper.email}
                  ownerName={data.shopkeeper.ownerName}
                  createdAt={data.shopkeeper.createdAt}
                  editing={isEditing}
                  register={register}
                  errors={errors}
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
