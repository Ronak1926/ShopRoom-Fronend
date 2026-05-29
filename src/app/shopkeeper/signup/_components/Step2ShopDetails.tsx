"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { step2Schema, type Step2Values, INDIAN_STATES } from "../_lib/schemas";
import { FieldError, inputCls, labelCls } from "./FormHelpers";

interface Step2ShopDetailsProps {
  isLoading: boolean;
  initialValues: Step2Values | null;
  onSubmit: (
    v: Step2Values,
    logoFile: File | null,
    coords: { lat: number; lng: number } | null,
  ) => void;
  onBack: () => void;
}

export function Step2ShopDetails({
  isLoading,
  initialValues,
  onSubmit,
  onBack,
}: Step2ShopDetailsProps) {
  const {
    register,
    handleSubmit,
    formState: { errors: e },
    reset,
  } = useForm<Step2Values>({
    resolver: zodResolver(step2Schema),
    mode: "onTouched",
  });

  // Pre-fill from restored draft
  useEffect(() => {
    if (initialValues) reset(initialValues);
  }, [initialValues, reset]);

  // Logo
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (logoPreview?.startsWith("blob:")) URL.revokeObjectURL(logoPreview);
    };
  }, [logoPreview]);

  function handleLogoChange(ev: React.ChangeEvent<HTMLInputElement>) {
    const file = ev.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setLogoError("Logo must be under 2 MB");
      return;
    }
    setLogoError(null);
    setLogoFile(file);
    if (logoPreview?.startsWith("blob:")) URL.revokeObjectURL(logoPreview);
    setLogoPreview(URL.createObjectURL(file));
  }

  // Location
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [locationGranted, setLocationGranted] = useState<boolean | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  function handleRequestLocation() {
    if (!navigator.geolocation) {
      setLocationGranted(false);
      return;
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationGranted(true);
        setLocationLoading(false);
      },
      () => {
        setLocationGranted(false);
        setLocationLoading(false);
      },
    );
  }

  return (
    <div>
      <h1 className="text-[22px] font-extrabold text-[var(--color-auth-ink)] tracking-[-0.5px] mb-1">
        Tell us about your shop
      </h1>
      <p className="text-[13px] text-[var(--color-auth-ink-muted)] mb-6">
        Add your shop details so customers can find you.
      </p>

      <form
        onSubmit={handleSubmit((v) => onSubmit(v, logoFile, coords))}
        noValidate
        className="flex flex-col gap-4"
      >
        {/* Shop Logo */}
        <div className="flex flex-col gap-2">
          <label className={labelCls()}>
            Shop Logo{" "}
            <span className="font-normal normal-case text-[var(--color-auth-ink-muted)]">
              (optional)
            </span>
          </label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              className="w-16 h-16 rounded-[10px] border-2 border-dashed border-[var(--color-auth-border)] bg-[var(--color-auth-input-bg)] flex items-center justify-center hover:border-[var(--color-auth-primary)] transition overflow-hidden shrink-0"
            >
              {logoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--color-auth-ink-muted)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              )}
            </button>
            <div>
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="text-[13px] font-medium text-[var(--color-auth-primary)] hover:underline"
              >
                {logoPreview ? "Change logo" : "Upload logo"}
              </button>
              <p className="text-[11px] text-[var(--color-auth-ink-muted)] mt-0.5">
                PNG, JPG · max 2 MB
              </p>
            </div>
          </div>
          {logoError && (
            <span className="text-[12px] text-red-500">{logoError}</span>
          )}
          <input
            ref={logoInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleLogoChange}
          />
        </div>

        {/* Shop Name */}
        <div className="flex flex-col gap-1">
          <label className={labelCls()}>Shop Name</label>
          <input
            {...register("shopName")}
            placeholder="e.g. Patel Fashion House"
            className={inputCls(!!e.shopName)}
          />
          <FieldError msg={e.shopName?.message} />
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1">
          <label className={labelCls()}>Category</label>
          <input
            {...register("shopCategory")}
            placeholder="e.g. Apparel & Fashion, Electronics, Footwear…"
            className={inputCls(!!e.shopCategory)}
          />
          <p className="text-[11px] text-[var(--color-auth-ink-muted)]">
            Type freely — Clothing, Footwear & Accessories → Apparel & Fashion
          </p>
          <FieldError msg={e.shopCategory?.message} />
        </div>

        {/* Street Address */}
        <div className="flex flex-col gap-1">
          <label className={labelCls()}>Street Address</label>
          <input
            {...register("address")}
            placeholder="e.g. 12, MG Road, Opp. City Mall"
            className={inputCls(!!e.address)}
          />
          <FieldError msg={e.address?.message} />
        </div>

        {/* City + State */}
        <div className="flex gap-3">
          <div className="flex flex-col gap-1 flex-1">
            <label className={labelCls()}>City</label>
            <input
              {...register("city")}
              placeholder="e.g. Surat"
              className={inputCls(!!e.city)}
            />
            <FieldError msg={e.city?.message} />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label className={labelCls()}>State</label>
            <div className="relative">
              <select
                {...register("state")}
                defaultValue=""
                className={`appearance-none h-11.5 w-full rounded-lg bg-(--color-auth-input-bg) px-4 pr-10 text-[14px] outline-none border transition cursor-pointer ${
                  !!e.state
                    ? "border-red-400 ring-1 ring-red-300 text-(--color-auth-ink)"
                    : "border-transparent focus:border-(--color-auth-primary) focus:ring-1 focus:ring-(--color-auth-primary) text-(--color-auth-ink)"
                }`}
              >
                <option
                  value=""
                  disabled
                  className="text-(--color-auth-ink-muted)"
                >
                  Select state
                </option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <svg
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-(--color-auth-ink-muted)"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
            <FieldError msg={e.state?.message} />
          </div>
        </div>

        {/* Pincode */}
        <div className="flex flex-col gap-1">
          <label className={labelCls()}>Pincode</label>
          <input
            {...register("pincode")}
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="e.g. 395001"
            className={inputCls(!!e.pincode)}
          />
          <FieldError msg={e.pincode?.message} />
        </div>

        {/* Location access + map preview */}
        <div className="flex flex-col gap-2">
          <label className={labelCls()}>Location</label>

          {locationGranted === null || locationGranted === false ? (
            <button
              type="button"
              onClick={handleRequestLocation}
              disabled={locationLoading}
              className="flex items-center gap-2 h-[46px] px-4 rounded-[8px] bg-[var(--color-auth-input-bg)] border border-transparent hover:border-[var(--color-auth-primary)] text-[14px] text-[var(--color-auth-ink-muted)] transition disabled:opacity-60"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
              </svg>
              {locationLoading ? "Requesting access…" : "Allow location access"}
            </button>
          ) : (
            <div className="flex items-center gap-2 h-[46px] px-4 rounded-[8px] bg-emerald-50 border border-emerald-200 text-[13px] text-emerald-700 font-medium">
              <svg width="15" height="15" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2 6l3 3 5-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Location access granted
              <button
                type="button"
                onClick={() => {
                  setCoords(null);
                  setLocationGranted(null);
                }}
                className="ml-auto text-[11px] text-emerald-600 hover:underline"
              >
                Remove
              </button>
            </div>
          )}

          {locationGranted === false && !locationLoading && (
            <p className="text-[11px] text-[var(--color-auth-ink-muted)]">
              Location access was denied. You can enable it in your browser
              settings.
            </p>
          )}

          {/* Map preview */}
          {coords && (
            <div className="rounded-[10px] overflow-hidden border border-[var(--color-auth-border)] h-[150px] relative mt-1">
              <iframe
                title="Shop location preview"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${coords.lng - 0.005}%2C${coords.lat - 0.005}%2C${coords.lng + 0.005}%2C${coords.lat + 0.005}&layer=mapnik&marker=${coords.lat}%2C${coords.lng}`}
                className="w-full h-full border-0"
                loading="lazy"
              />
              <div className="absolute bottom-1.5 right-1.5 bg-white/80 backdrop-blur-sm rounded px-1.5 py-0.5 text-[10px] text-[var(--color-auth-ink-muted)]">
                {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
              </div>
            </div>
          )}
        </div>

        {/* Phone Number */}
        <div className="flex flex-col gap-1">
          <label className={labelCls()}>Phone Number</label>
          <div className="flex">
            <div className="h-[46px] flex items-center px-3 rounded-l-[8px] bg-[var(--color-auth-input-bg)] border-r border-[var(--color-auth-border)] text-[14px] text-[var(--color-auth-ink-muted)] font-semibold select-none shrink-0">
              +91
            </div>
            <input
              {...register("phoneNumber")}
              type="tel"
              maxLength={10}
              placeholder="9876543210"
              className={`flex-1 h-[46px] rounded-r-[8px] bg-[var(--color-auth-input-bg)] px-4 text-[14px] text-[var(--color-auth-ink)] placeholder:text-[var(--color-auth-ink-muted)]/50 outline-none border transition ${
                e.phoneNumber
                  ? "border-red-400 ring-1 ring-red-300"
                  : "border-transparent focus:border-[var(--color-auth-primary)] focus:ring-1 focus:ring-[var(--color-auth-primary)]"
              }`}
            />
          </div>
          <p className="text-[11px] text-[var(--color-auth-ink-muted)]">
            A 6-digit OTP will be sent to verify this number
          </p>
          <FieldError msg={e.phoneNumber?.message} />
        </div>

        <div className="flex gap-3 mt-1">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 h-[46px] rounded-[8px] border border-[var(--color-border-default)] text-[var(--color-auth-ink)] font-semibold text-[14px] hover:bg-[var(--color-auth-input-bg)] transition"
          >
            ← Back
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 h-[46px] rounded-[8px] bg-[var(--color-auth-primary)] text-white font-semibold text-[14px] hover:bg-[var(--color-brand-primary-active)] disabled:opacity-60 transition"
          >
            {isLoading ? "Sending OTP…" : "Continue →"}
          </button>
        </div>
      </form>
    </div>
  );
}
