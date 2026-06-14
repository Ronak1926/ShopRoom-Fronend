"use client";

import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

interface Props {
  address: string;
  city: string;
  state: string;
  pincode: string;
  phoneNumber: string;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
}

export default function ProfileShopDetailsCard({
  address,
  city,
  state,
  pincode,
  phoneNumber,
  latitude,
  longitude,
  description,
}: Props) {
  return (
    <div className="bg-(--color-bg-surface) border border-(--color-border-default) rounded-2xl p-6 flex flex-col gap-5">
      <h3 className="text-[16px] font-bold text-(--color-text-primary)">
        Shop Details
      </h3>

      {/* Address */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-(--color-text-hint) mb-1.5">
          Address
        </p>
        <div className="bg-(--color-bg-page) border border-(--color-border-default) rounded-xl px-4 py-3">
          <p className="text-[14px] text-(--color-text-primary) leading-relaxed">
            {address},
            <br />
            {city}, {state} – {pincode}
          </p>
        </div>
      </div>

      {/* Phone */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-(--color-brand-primary-light) flex items-center justify-center shrink-0">
          <LocalPhoneOutlinedIcon
            sx={{ fontSize: 16, color: "var(--color-brand-primary)" }}
          />
        </div>
        <div>
          <p className="text-[11px] text-(--color-text-hint) uppercase tracking-wide">
            Phone
          </p>
          <p className="text-[14px] font-medium text-(--color-text-primary)">
            {phoneNumber}
          </p>
        </div>
      </div>

      {/* Coordinates — only if both exist */}
      {latitude != null && longitude != null && (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-(--color-brand-primary-light) flex items-center justify-center shrink-0">
            <LocationOnOutlinedIcon
              sx={{ fontSize: 16, color: "var(--color-brand-primary)" }}
            />
          </div>
          <div>
            <p className="text-[11px] text-(--color-text-hint) uppercase tracking-wide">
              Location coordinates
            </p>
            <p className="font-mono text-[13px] text-(--color-text-primary)">
              {latitude.toFixed(4)}, {longitude.toFixed(4)}
            </p>
          </div>
        </div>
      )}

      {/* Description */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-(--color-text-hint) mb-1.5">
          Description
        </p>
        {description ? (
          <p className="text-[14px] text-(--color-text-primary) leading-relaxed">
            {description}
          </p>
        ) : (
          <p className="text-[14px] text-(--color-text-hint)">
            No description set.{" "}
            <a
              href="/shopkeeper/settings"
              className="text-(--color-text-link) hover:text-(--color-text-link-hover) transition-colors"
            >
              Add description →
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
