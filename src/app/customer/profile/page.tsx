"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import Sidebar from "@/components/customer/Sidebar";
import Avatar from "@/components/ui/Avatar";
import ProfileInfoCard from "./_components/ProfileInfoCard";
import {
  customerProfileSchema,
  type CustomerProfileFormValues,
} from "./_schemas/customerProfileSchema";
import { apiClient, setAuthToken } from "@/utils/apiClient";
import { getCookie, deleteCookie } from "@/utils/cookieUtils";

interface CustomerData {
  fullName: string;
  email: string;
  allowLocationAccess: boolean;
  createdAt: string;
}

function ProfileSkeleton() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="h-8 w-40 rounded-xl animate-pulse bg-(--color-bg-surface-hover) mb-6" />
      <div className="h-96 rounded-2xl animate-pulse bg-(--color-bg-surface-hover)" />
    </div>
  );
}

export default function CustomerProfilePage() {
  const router = useRouter();
  const [initialLoading, setInitialLoading] = useState(true);
  const [data, setData] = useState<CustomerData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CustomerProfileFormValues>({ resolver: zodResolver(customerProfileSchema) });

  useEffect(() => {
    const token = getCookie("token");
    if (!token) {
      router.replace("/customer/login");
      return;
    }
    setAuthToken(token);

    apiClient
      .get<{ customer: CustomerData }>("/api/customers/me")
      .then((res) => {
        setData(res.data.customer);
        reset({
          fullName: res.data.customer.fullName,
          allowLocationAccess: res.data.customer.allowLocationAccess,
        });
      })
      .catch((err: { response?: { status: number } }) => {
        if (err?.response?.status === 401) {
          deleteCookie("token");
          router.replace("/customer/login");
        }
      })
      .finally(() => setInitialLoading(false));
  }, [router, reset]);

  function handleNavChange(id: string) {
    if (id === "discover") router.push("/customer/home");
    else if (id === "myrooms") router.push("/customer/myrooms");
  }

  async function onSubmit(values: CustomerProfileFormValues) {
    setSaving(true);
    try {
      await apiClient.patch("/api/customers/me", values);
      setData((prev) => (prev ? { ...prev, ...values } : prev));
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    if (!data) return;
    reset({ fullName: data.fullName, allowLocationAccess: data.allowLocationAccess });
    setIsEditing(false);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-(--color-bg-page) text-(--color-text-primary)">
      <Sidebar activeNav="profile" onNavChange={handleNavChange} />

      <div className="flex-1 overflow-y-auto p-6">
        {initialLoading ? (
          <ProfileSkeleton />
        ) : data ? (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-(--color-text-primary)">My Profile</h1>
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

            <div className="flex flex-col items-center text-center gap-3 mb-6">
              <Avatar name={data.fullName} size="xl" />
            </div>

            <ProfileInfoCard
              fullName={data.fullName}
              email={data.email}
              createdAt={data.createdAt}
              editing={isEditing}
              register={register}
              errors={errors}
              allowLocationAccess={watch("allowLocationAccess") ?? data.allowLocationAccess}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-(--color-text-secondary)">Failed to load profile. Please try again.</p>
          </div>
        )}
      </div>
    </div>
  );
}
