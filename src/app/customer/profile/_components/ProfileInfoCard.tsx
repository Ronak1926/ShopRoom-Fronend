"use client";

import { useRouter } from "next/navigation";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import type { CustomerProfileFormValues } from "../_schemas/customerProfileSchema";

interface Props {
  fullName: string;
  email: string;
  createdAt: string;
  editing: boolean;
  register: UseFormRegister<CustomerProfileFormValues>;
  errors: FieldErrors<CustomerProfileFormValues>;
  allowLocationAccess: boolean;
}

const inputCls =
  "w-full h-9 rounded-lg bg-(--color-bg-page) border border-(--color-border-default) px-3 text-[14px] text-(--color-text-primary) outline-none focus:border-(--color-brand-primary) transition-colors";

function formatFullDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ProfileInfoCard({
  fullName,
  email,
  createdAt,
  editing,
  register,
  errors,
  allowLocationAccess,
}: Props) {
  const router = useRouter();

  return (
    <div className="bg-(--color-bg-surface) border border-(--color-border-default) rounded-2xl p-6 flex flex-col gap-4">
      <h3 className="text-[16px] font-bold text-(--color-text-primary)">
        Account
      </h3>

      {/* Full name */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-(--color-brand-primary-light) flex items-center justify-center shrink-0">
          <PersonOutlinedIcon
            sx={{ fontSize: 16, color: "var(--color-brand-primary)" }}
          />
        </div>
        <div className="flex-1">
          <p className="text-[11px] text-(--color-text-hint) uppercase tracking-wide">
            Full name
          </p>
          {editing ? (
            <>
              <input
                className={`${inputCls} mt-1`}
                placeholder="Full name"
                {...register("fullName")}
              />
              {errors.fullName?.message && (
                <p className="text-[11px] text-(--color-danger) mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </>
          ) : (
            <p className="text-[14px] font-medium text-(--color-text-primary)">
              {fullName}
            </p>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-(--color-brand-primary-light) flex items-center justify-center shrink-0">
          <EmailOutlinedIcon
            sx={{ fontSize: 16, color: "var(--color-brand-primary)" }}
          />
        </div>
        <div>
          <p className="text-[11px] text-(--color-text-hint) uppercase tracking-wide">
            Email address
          </p>
          <p className="text-[14px] font-medium text-(--color-text-primary)">
            {email}
          </p>
        </div>
      </div>

      {/* Location sharing */}
      <div className="flex items-center gap-3 justify-between py-3 border-t border-(--color-border-default)">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-(--color-brand-primary-light) flex items-center justify-center shrink-0">
            <LocationOnOutlinedIcon
              sx={{ fontSize: 16, color: "var(--color-brand-primary)" }}
            />
          </div>
          <div>
            <p className="text-[11px] text-(--color-text-hint) uppercase tracking-wide">
              Location sharing
            </p>
            <p className="text-[14px] font-medium text-(--color-text-primary)">
              {editing ? "Toggle below" : allowLocationAccess ? "Enabled" : "Disabled"}
            </p>
          </div>
        </div>
        {editing && (
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              {...register("allowLocationAccess")}
            />
            <div className="w-10 h-6 bg-(--color-border-default) peer-checked:bg-(--color-brand-primary) rounded-full transition-colors" />
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4" />
          </label>
        )}
      </div>

      {/* Account created */}
      <div className="flex items-center justify-between">
        <span className="text-[13px] text-(--color-text-secondary)">
          Account created
        </span>
        <span
          className="text-[13px] font-medium text-(--color-text-primary)"
          suppressHydrationWarning
        >
          {formatFullDate(createdAt)}
        </span>
      </div>

      {/* Sign out */}
      <button
        type="button"
        onClick={() => router.push("/customer/logout")}
        className="flex items-center justify-center gap-2 w-full h-10 rounded-xl text-[13px] font-semibold cursor-pointer border-0 mt-2 transition-colors"
        style={{
          color: "var(--color-danger, #e53935)",
          background: "var(--color-danger-light)",
        }}
      >
        <LogoutOutlinedIcon sx={{ fontSize: 16 }} />
        Sign Out
      </button>
    </div>
  );
}
