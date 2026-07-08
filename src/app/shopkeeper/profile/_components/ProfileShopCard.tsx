"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import { apiClient } from "@/utils/apiClient";
import type { ShopProfileFormValues } from "../_schemas/shopProfileSchema";

interface Props {
  shopName: string;
  category: string;
  logoUrl: string | null;
  createdAt: string;
  editing: boolean;
  register: UseFormRegister<ShopProfileFormValues>;
  errors: FieldErrors<ShopProfileFormValues>;
  onLogoUploaded: (url: string) => void;
}

const inputCls =
  "w-full h-9 rounded-lg bg-(--color-bg-page) border border-(--color-border-default) px-3 text-[14px] text-center text-(--color-text-primary) outline-none focus:border-(--color-brand-primary) transition-colors";

function formatMonthYear(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ProfileShopCard({
  shopName,
  category,
  logoUrl,
  createdAt,
  editing,
  register,
  errors,
  onLogoUploaded,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    try {
      const base64 = await fileToBase64(file);
      const res = await apiClient.patch<{ logoUrl: string | null }>(
        "/api/shop/room/images",
        { logoBase64: base64 },
      );
      if (res.data.logoUrl) onLogoUploaded(res.data.logoUrl);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="bg-(--color-bg-surface) border border-(--color-border-default) rounded-2xl p-6 flex flex-col items-center text-center gap-4">
      {/* Logo */}
      <div className="relative w-24 h-24 rounded-full bg-(--color-brand-primary-light) flex items-center justify-center overflow-hidden">
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={shopName}
            width={96}
            height={96}
            className="object-cover w-full h-full"
          />
        ) : (
          <StorefrontOutlinedIcon
            sx={{ fontSize: 42, color: "var(--color-brand-primary)" }}
          />
        )}
        {editing && (
          <button
            type="button"
            title="Change logo"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="absolute inset-0 flex items-center justify-center bg-black/40 text-white border-0 cursor-pointer disabled:cursor-wait"
          >
            <PhotoCameraOutlinedIcon sx={{ fontSize: 22 }} />
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleLogoChange}
        />
      </div>

      {/* Name + category */}
      {editing ? (
        <div className="w-full flex flex-col gap-2">
          <input className={inputCls} placeholder="Shop name" {...register("shopName")} />
          {errors.shopName?.message && (
            <p className="text-[11px] text-(--color-danger)">{errors.shopName.message}</p>
          )}
          <input className={inputCls} placeholder="Category" {...register("category")} />
          {errors.category?.message && (
            <p className="text-[11px] text-(--color-danger)">{errors.category.message}</p>
          )}
        </div>
      ) : (
        <div>
          <h2 className="text-[20px] font-bold text-(--color-text-primary) leading-snug">
            {shopName}
          </h2>
          <span className="inline-block mt-2 px-3 py-1 rounded-full text-[12px] font-semibold bg-(--color-brand-primary-light) text-(--color-brand-primary)">
            {category}
          </span>
        </div>
      )}

      {/* Member since */}
      <p className="text-[13px] text-(--color-text-secondary)">
        Member since{" "}
        <span
          className="font-medium text-(--color-text-primary)"
          suppressHydrationWarning
        >
          {formatMonthYear(createdAt)}
        </span>
      </p>

      {uploading && (
        <p className="text-[12px] text-(--color-text-hint)">Uploading logo...</p>
      )}
    </div>
  );
}
