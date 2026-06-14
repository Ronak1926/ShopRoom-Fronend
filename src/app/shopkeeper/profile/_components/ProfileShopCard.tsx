"use client";

import Image from "next/image";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";

interface Props {
  shopName: string;
  category: string;
  logoUrl: string | null;
  createdAt: string;
}

function formatMonthYear(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

export default function ProfileShopCard({
  shopName,
  category,
  logoUrl,
  createdAt,
}: Props) {
  return (
    <div className="bg-(--color-bg-surface) border border-(--color-border-default) rounded-2xl p-6 flex flex-col items-center text-center gap-4">
      {/* Logo */}
      <div className="w-24 h-24 rounded-full bg-(--color-brand-primary-light) flex items-center justify-center overflow-hidden">
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
      </div>

      {/* Name + category */}
      <div>
        <h2 className="text-[20px] font-bold text-(--color-text-primary) leading-snug">
          {shopName}
        </h2>
        <span className="inline-block mt-2 px-3 py-1 rounded-full text-[12px] font-semibold bg-(--color-brand-primary-light) text-(--color-brand-primary)">
          {category}
        </span>
      </div>

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

      {/* Edit logo — placeholder */}
      <button
        type="button"
        className="text-[13px] font-medium border border-(--color-border-strong) text-(--color-text-secondary) rounded-lg px-4 py-1.5 cursor-pointer bg-transparent hover:text-(--color-text-primary) hover:border-(--color-border-focus) transition-colors"
      >
        Edit Logo
      </button>
    </div>
  );
}
