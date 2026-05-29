"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { AuthLeftPanel } from "../../components/ui/AuthLeftPanel";
import { ContinueWithGoogle } from "../../components/ui/ContinueWithGoogle";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { hydrateToken, registerCustomer } from "../../features/auth/authSlice";
import { apiClient } from "../../utils/apiClient";

const signupSchema = z
  .object({
    fullName: z.string().trim().min(2, "Name must be at least 2 characters"),
    email: z.string().trim().email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(200),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    allowLocationAccess: z.boolean(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

const EyeIcon = ({ open }: { open: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    {open ? (
      <>
        <path
          d="M2.5 12C4.5 7.5 8 5 12 5C16 5 19.5 7.5 21.5 12C19.5 16.5 16 19 12 19C8 19 4.5 16.5 2.5 12Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      </>
    ) : (
      <>
        <path
          d="M3 3l18 18M10.5 10.68A3 3 0 0013.32 13.5M6.5 6.74C4.37 8.12 2.9 10 2.5 12c1.5 4.5 5 7 9.5 7a9.6 9.6 0 005.26-1.55M9 5.28A9.4 9.4 0 0112 5c4.5 0 8 2.5 9.5 7-.4 1.2-1.05 2.3-1.9 3.23"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </>
    )}
  </svg>
);

export default function SignupPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { status, token } = useAppSelector((s) => s.auth);
  const isLoading = status === "loading";

  const [ready, setReady] = useState(false);

  useEffect(() => {
    const customerToken = localStorage.getItem("token");
    const shopkeeperToken = localStorage.getItem("shopkeeper_token");
    if (customerToken) {
      dispatch(hydrateToken());
      router.replace("/customer/home");
    } else if (shopkeeperToken) {
      router.replace("/shopkeeper/dashboard");
    } else {
      dispatch(hydrateToken());
      setReady(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [locationCoords, setLocationCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onTouched",
    defaultValues: { allowLocationAccess: false },
  });

  const allowLocation = watch("allowLocationAccess");

  async function handleLocationToggle() {
    if (allowLocation) {
      // Turning off — clear stored coords
      setValue("allowLocationAccess", false);
      setLocationCoords(null);
      setLocationError(null);
      return;
    }
    // Turning on — request permission
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }
    setLocationLoading(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setValue("allowLocationAccess", true);
        setLocationLoading(false);
      },
      () => {
        setLocationError(
          "Location access was denied. Please allow it in your browser settings.",
        );
        setLocationLoading(false);
      },
      { timeout: 10000 },
    );
  }

  async function onSubmit(values: SignupFormValues) {
    setServerError(null);

    const action = await dispatch(
      registerCustomer({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        allowLocationAccess: values.allowLocationAccess,
        ...(values.allowLocationAccess && locationCoords ? locationCoords : {}),
      }),
    );

    if (!registerCustomer.fulfilled.match(action)) {
      setServerError((action.payload as string) ?? "Registration failed");
      return;
    }

    try {
      await apiClient.post("/api/otp/send", { email: values.email });
    } catch {
      // OTP send failed â€” still proceed to verify page, user can resend
    }
    router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
  }

  const inputClass =
    "w-full h-[48px] rounded-[8px] bg-[var(--color-auth-input-bg)] px-4 text-sm text-[var(--color-auth-ink)] placeholder:text-[var(--color-auth-ink-muted)] outline-none focus:ring-2 focus:ring-[var(--color-auth-primary)]/30 transition-shadow";
  const labelClass =
    "text-[10px] leading-[15px] tracking-[1px] uppercase font-bold text-[var(--color-auth-ink)]";
  const errorClass = "mt-1 text-[11px] text-red-500";

  if (!ready) return null;

  return (
    <div className="flex flex-1 bg-[var(--color-bg-page)]">
      <AuthLeftPanel />

      <div className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-[480px]">
          {/* Role toggle */}
          <div className="flex rounded-[10px] bg-[var(--color-auth-input-bg)] p-1 mb-6">
            <div className="flex-1 text-center text-[13px] font-semibold py-2 rounded-[8px] bg-[var(--color-bg-surface)] text-[var(--color-auth-primary)] shadow-sm">
              Customer
            </div>
            <a
              href="/shopkeeper/signup"
              className="flex-1 text-center text-[13px] font-medium py-2 rounded-[8px] text-[var(--color-auth-ink-muted)] hover:text-[var(--color-auth-ink)] transition"
            >
              Shopkeeper
            </a>
          </div>

          <div className="rounded-[12px] bg-[var(--color-bg-surface)] px-10 py-10 shadow-[0_12px_40px_rgba(25,25,47,0.04)] border border-[var(--color-border-default)]">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 text-[var(--color-auth-ink)]">
                <Image
                  src="/ShopRoomIcon.svg"
                  alt="ShopRoom"
                  width={26}
                  height={23}
                  className="align-middle"
                />
                <div className="text-[24px] leading-[32px] tracking-[-1.2px] font-bold">
                  ShopRoom
                </div>
              </div>
              <h1 className="mt-6 text-[26px] font-extrabold tracking-[-0.65px] text-[var(--color-auth-ink)] text-center">
                Create your account
              </h1>
              <p className="mt-2 text-[14px] text-[var(--color-auth-ink-muted)] text-center">
                Find rooms near your favourite shops.
              </p>
            </div>

            <div className="mt-8 flex flex-col items-center">
              <div className="w-[400px]">
                <ContinueWithGoogle />
              </div>

              <div className="my-6 flex items-center gap-4 w-[400px]">
                <div className="h-px flex-1 bg-[var(--color-border-default)]" />
                <span className="text-[10px] tracking-[1px] text-[var(--color-auth-ink-muted)] uppercase opacity-50">
                  OR
                </span>
                <div className="h-px flex-1 bg-[var(--color-border-default)]" />
              </div>

              <form
                className="w-[400px] flex flex-col gap-4"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
                {/* Full Name */}
                <div className="flex flex-col gap-1">
                  <label className={labelClass}>Full Name</label>
                  <input
                    {...register("fullName")}
                    placeholder="Cameron Williamson"
                    autoComplete="name"
                    className={`${inputClass} ${errors.fullName ? "ring-2 ring-red-400" : ""}`}
                  />
                  {errors.fullName && (
                    <p className={errorClass}>{errors.fullName.message}</p>
                  )}
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1">
                  <label className={labelClass}>Email Address</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-auth-ink-muted)]">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M4 7.5C4 6.67157 4.67157 6 5.5 6H18.5C19.3284 6 20 6.67157 20 7.5V16.5C20 17.3284 19.3284 18 18.5 18H5.5C4.67157 18 4 17.3284 4 16.5V7.5Z"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        />
                        <path
                          d="M6.5 8.5L12 12.5L17.5 8.5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="cameron@example.com"
                      autoComplete="email"
                      className={`${inputClass} pl-12 ${errors.email ? "ring-2 ring-red-400" : ""}`}
                    />
                  </div>
                  {errors.email && (
                    <p className={errorClass}>{errors.email.message}</p>
                  )}
                </div>

                {/* Password + Confirm */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className={labelClass}>Password</label>
                    <div className="relative">
                      <input
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className={`${inputClass} pr-12 ${errors.password ? "ring-2 ring-red-400" : ""}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center text-[var(--color-auth-ink-muted)]"
                      >
                        <EyeIcon open={showPassword} />
                      </button>
                    </div>
                    {errors.password && (
                      <p className={errorClass}>{errors.password.message}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className={labelClass}>Confirm</label>
                    <input
                      {...register("confirmPassword")}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className={`${inputClass} ${errors.confirmPassword ? "ring-2 ring-red-400" : ""}`}
                    />
                    {errors.confirmPassword && (
                      <p className={errorClass}>
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Location toggle */}
                <div className="w-full rounded-[8px] border border-[var(--color-auth-border)] bg-[var(--color-auth-panel-bg)]/50 p-4 flex items-center justify-between">
                  <div>
                    <div className="text-[14px] font-bold text-[var(--color-auth-ink)]">
                      Allow location access
                    </div>
                    <div className="text-[11px] text-[var(--color-auth-ink-muted)]">
                      Show rooms near your current position.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleLocationToggle}
                    disabled={locationLoading}
                    className={`relative w-[44px] h-[24px] rounded-full transition-colors disabled:opacity-60 ${allowLocation ? "bg-[var(--color-auth-primary)]" : "bg-[var(--color-auth-border)]/60"}`}
                    aria-pressed={allowLocation}
                  >
                    {locationLoading ? (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      </span>
                    ) : (
                      <span
                        className={`absolute top-[3px] left-[3px] h-[18px] w-[18px] rounded-full bg-white transition-transform ${allowLocation ? "translate-x-[20px]" : "translate-x-0"}`}
                      />
                    )}
                  </button>
                </div>

                {locationError && (
                  <div className="rounded-[8px] border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700 text-center">
                    {locationError}
                  </div>
                )}

                {serverError && (
                  <div className="rounded-[8px] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 text-center">
                    {serverError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!isValid || isLoading}
                  className="w-full h-[56px] rounded-[8px] bg-[var(--color-auth-primary)] text-white text-[16px] font-bold disabled:opacity-50 transition-opacity"
                >
                  {isLoading ? "Creating Account" : "Create Account"}
                </button>

                <div className="text-center text-[14px] text-[var(--color-auth-ink-muted)]">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-bold text-[var(--color-auth-primary)]"
                  >
                    Log in
                  </Link>
                </div>
              </form>
            </div>

            <div className="mt-12 flex items-center justify-center gap-12 text-[10px] tracking-[2px] uppercase text-[var(--color-auth-ink-muted)] opacity-50">
              <span>© 2026 SHOPROOM</span>
              <span>PRIVACY POLICY</span>
              <span>HELP CENTER</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
