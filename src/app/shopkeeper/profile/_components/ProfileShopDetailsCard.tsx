"use client";

import type { UseFormRegister, FieldErrors } from "react-hook-form";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import type { ShopProfileFormValues } from "../_schemas/shopProfileSchema";

interface Props {
  address: string;
  city: string;
  state: string;
  pincode: string;
  phoneNumber: string;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  editing: boolean;
  register: UseFormRegister<ShopProfileFormValues>;
  errors: FieldErrors<ShopProfileFormValues>;
}

const inputCls =
  "w-full h-9 rounded-lg bg-(--color-bg-page) border border-(--color-border-default) px-3 text-[13px] text-(--color-text-primary) outline-none focus:border-(--color-brand-primary) transition-colors";

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-[11px] text-(--color-danger) mt-1">{msg}</p>;
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
  editing,
  register,
  errors,
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
        {editing ? (
          <div className="flex flex-col gap-2">
            <input className={inputCls} placeholder="Address" {...register("address")} />
            <FieldError msg={errors.address?.message} />
            <div className="grid grid-cols-3 gap-2">
              <input className={inputCls} placeholder="City" {...register("city")} />
              <input className={inputCls} placeholder="State" {...register("state")} />
              <input className={inputCls} placeholder="Pincode" {...register("pincode")} />
            </div>
            <FieldError
              msg={errors.city?.message || errors.state?.message || errors.pincode?.message}
            />
          </div>
        ) : (
          <div className="bg-(--color-bg-page) border border-(--color-border-default) rounded-xl px-4 py-3">
            <p className="text-[14px] text-(--color-text-primary) leading-relaxed">
              {address},
              <br />
              {city}, {state} – {pincode}
            </p>
          </div>
        )}
      </div>

      {/* Phone */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-(--color-brand-primary-light) flex items-center justify-center shrink-0">
          <LocalPhoneOutlinedIcon
            sx={{ fontSize: 16, color: "var(--color-brand-primary)" }}
          />
        </div>
        <div className="flex-1">
          <p className="text-[11px] text-(--color-text-hint) uppercase tracking-wide">
            Phone
          </p>
          {editing ? (
            <>
              <input
                className={`${inputCls} mt-1`}
                placeholder="Phone number"
                {...register("phoneNumber")}
              />
              <FieldError msg={errors.phoneNumber?.message} />
            </>
          ) : (
            <p className="text-[14px] font-medium text-(--color-text-primary)">
              {phoneNumber}
            </p>
          )}
        </div>
      </div>

      {/* Coordinates — only if both exist */}
      {!editing && latitude != null && longitude != null && (
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
        {editing ? (
          <textarea
            rows={3}
            className={`${inputCls} h-auto py-2 resize-none`}
            placeholder="Tell customers about your shop..."
            {...register("description")}
          />
        ) : description ? (
          <p className="text-[14px] text-(--color-text-primary) leading-relaxed">
            {description}
          </p>
        ) : (
          <p className="text-[14px] text-(--color-text-hint)">No description set.</p>
        )}
      </div>
    </div>
  );
}
