"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { ShopkeeperLeftPanel } from "../../../components/ui/ShopkeeperLeftPanel";
import { apiClient } from "../../../utils/apiClient";
// Stripe imports commented out — replaced by Razorpay
// import { loadStripe } from "@stripe/stripe-js";
// import { Elements, CardNumberElement, ... } from "@stripe/react-stripe-js";

// ─── Razorpay global type declaration ─────────────────────────────────────────
// The Razorpay checkout.js script loaded via <Script> attaches window.Razorpay
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  handler: (response: RazorpaySuccessResponse) => void;
  modal?: { ondismiss?: () => void };
}
interface RazorpaySuccessResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}
interface RazorpayInstance {
  open(): void;
}

// ─── Schemas ──────────────────────────────────────────────────────────────────

const step1Schema = z
  .object({
    email: z.string().trim().email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(200),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    isShopkeeper: z.boolean().refine((v) => v === true, {
      message: "Please confirm you are a shopkeeper",
    }),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const step2Schema = z.object({
  shopName: z.string().trim().min(2, "Shop name must be at least 2 characters"),
  shopCategory: z.string().trim().min(2, "Enter a category"),
  shopAddress: z.string().trim().min(5, "Enter a valid shop address"),
  phoneNumber: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
});

type Step1Values = z.infer<typeof step1Schema>;
type Step2Values = z.infer<typeof step2Schema>;

// ─── Plans ────────────────────────────────────────────────────────────────────

const PLANS = [
  {
    id: "1m" as const,
    label: "1 Month",
    price: 399,
    description: "Try ShopRoom for a month",
  },
  {
    id: "2m" as const,
    label: "2 Months",
    price: 599,
    description: "Most popular choice",
    recommended: true,
  },
  {
    id: "3m" as const,
    label: "3 Months",
    price: 899,
    description: "Best value for money",
  },
];
type PlanId = "1m" | "2m" | "3m";

const STEP_LABELS = ["Account", "Shop Details", "Verify Phone", "Payment"];

// ─── Small helpers ────────────────────────────────────────────────────────────

function EyeIcon({ open }: { open: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      {open ? (
        <>
          <path
            d="M2.5 12C4.5 7.5 8 5 12 5C16 5 19.5 7.5 21.5 12C19.5 16.5 16 19 12 19C8 19 4.5 16.5 2.5 12Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <circle
            cx="12"
            cy="12"
            r="3"
            stroke="currentColor"
            strokeWidth="1.8"
          />
        </>
      ) : (
        <path
          d="M3 3l18 18M10.5 10.68A3 3 0 0013.32 13.5M6.5 6.74C4.37 8.12 2.9 10 2.5 12c1.5 4.5 5 7 9.5 7a9.6 9.6 0 005.26-1.55M9 5.28A9.4 9.4 0 0112 5c4.5 0 8 2.5 9.5 7-.4 1.2-1.05 2.3-1.9 3.23"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <span className="text-[12px] text-red-500 mt-0.5">{msg}</span>;
}

function inputCls(hasError: boolean) {
  return `h-[46px] w-full rounded-[8px] bg-[var(--color-auth-input-bg)] px-4 text-[14px] text-[var(--color-auth-ink)] placeholder:text-[var(--color-auth-ink-muted)]/50 outline-none border transition ${
    hasError
      ? "border-red-400 ring-1 ring-red-300"
      : "border-transparent focus:border-[var(--color-auth-primary)] focus:ring-1 focus:ring-[var(--color-auth-primary)]"
  }`;
}

function labelCls() {
  return "text-[10px] uppercase font-bold text-[var(--color-auth-ink)] tracking-[1px]";
}

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-1 mb-8">
      {STEP_LABELS.map((label, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;
        return (
          <div key={step} className="flex items-center gap-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                  done
                    ? "bg-emerald-500 text-white"
                    : active
                      ? "bg-[var(--color-auth-primary)] text-white"
                      : "bg-[var(--color-auth-input-bg)] text-[var(--color-auth-ink-muted)]"
                }`}
              >
                {done ? (
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  step
                )}
              </div>
              <span
                className={`text-[9px] mt-1 font-medium whitespace-nowrap ${
                  active
                    ? "text-[var(--color-auth-primary)]"
                    : "text-[var(--color-auth-ink-muted)]"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div
                className={`w-6 h-px mb-4 transition-all ${
                  done ? "bg-emerald-400" : "bg-[var(--color-border-default)]"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Stripe setup commented out — replaced by Razorpay ──────────────────────
// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "");

// ─── Razorpay checkout.js loader ─────────────────────────────────────────────

/** Loads the Razorpay checkout.js script and resolves when window.Razorpay is ready. */
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// ─── Payment step (Razorpay) ──────────────────────────────────────────────────

interface Step4Props {
  draftId: string;
  userEmail: string;
  onSuccess: () => void;
  onError: (msg: string) => void;
  onBack: () => void;
}

function Step4Payment({
  draftId,
  userEmail: _userEmail,
  onSuccess,
  onError,
  onBack,
}: Step4Props) {
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // ── DEV MODE: skip real Razorpay, send mock values to backend ────────────────
  // The backend's verifyPaymentSignature() falls back to returning true when
  // RAZORPAY_KEY_SECRET is not set, so the full registration flow works end-to-end.
  // TODO: replace this with the real Razorpay checkout once credentials are ready.
  async function handlePay() {
    if (!selectedPlan) return;
    setIsProcessing(true);
    try {
      // Create a mock order on the backend (returns a mock orderId in dev)
      const orderRes = await apiClient.post(
        "/api/shopkeeper/payment/create-order",
        {
          draftId,
          planType: selectedPlan,
        },
      );
      const { orderId } = orderRes.data as { orderId: string };

      // Send mock payment details — backend accepts these when credentials are absent
      await apiClient.post("/api/shopkeeper/payment/verify", {
        draftId,
        planType: selectedPlan,
        razorpayOrderId: orderId,
        razorpayPaymentId: `pay_dev_${Date.now()}`,
        razorpaySignature: "dev_signature",
      });

      onSuccess();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      onError(
        e?.response?.data?.message ?? "Payment failed. Please try again.",
      );
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div>
      <h1 className="text-[22px] font-extrabold text-[var(--color-auth-ink)] tracking-[-0.5px] mb-1">
        Choose your plan
      </h1>
      <p className="text-[13px] text-[var(--color-auth-ink-muted)] mb-5">
        Select a subscription and complete your registration.
      </p>

      {/* Plan cards */}
      <div className="flex flex-col gap-3 mb-5">
        {PLANS.map((plan) => (
          <button
            key={plan.id}
            type="button"
            onClick={() => setSelectedPlan(plan.id)}
            className={`relative flex items-center justify-between px-4 py-3.5 rounded-[10px] border-2 text-left transition ${
              selectedPlan === plan.id
                ? "border-[var(--color-auth-primary)] bg-[var(--color-auth-primary)]/5"
                : "border-[var(--color-auth-border)] hover:border-[var(--color-auth-primary)]/50"
            }`}
          >
            {plan.recommended && (
              <span className="absolute -top-[11px] left-4 bg-[var(--color-auth-primary)] text-white text-[9px] font-bold px-2 py-0.5 rounded-full tracking-[0.5px] uppercase">
                Popular
              </span>
            )}
            <div>
              <div
                className={`font-semibold text-[14px] ${
                  selectedPlan === plan.id
                    ? "text-[var(--color-auth-primary)]"
                    : "text-[var(--color-auth-ink)]"
                }`}
              >
                {plan.label}
              </div>
              <div className="text-[12px] text-[var(--color-auth-ink-muted)]">
                {plan.description}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div
                className={`text-[20px] font-extrabold tracking-[-0.5px] ${
                  selectedPlan === plan.id
                    ? "text-[var(--color-auth-primary)]"
                    : "text-[var(--color-auth-ink)]"
                }`}
              >
                ₹{plan.price}
              </div>
              <div className="text-[11px] text-[var(--color-auth-ink-muted)]">
                one-time
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Dev card form — any values accepted */}
      <div className="rounded-[10px] border border-amber-200 bg-amber-50 px-4 py-2.5 text-[11px] text-amber-700 mb-4 flex items-center gap-2">
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
        Dev mode — enter any card details to complete registration
      </div>

      <div className="flex flex-col gap-3 mb-5">
        <div className="flex flex-col gap-1">
          <label className={labelCls()}>Name on Card</label>
          <input
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            placeholder="e.g. Ronak Patel"
            className={inputCls(false)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className={labelCls()}>Card Number</label>
          <input
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            placeholder="4111 1111 1111 1111"
            maxLength={19}
            className={inputCls(false)}
          />
        </div>
        <div className="flex gap-3">
          <div className="flex flex-col gap-1 flex-1">
            <label className={labelCls()}>Expiry</label>
            <input
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              placeholder="MM/YY"
              maxLength={5}
              className={inputCls(false)}
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label className={labelCls()}>CVV</label>
            <input
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              placeholder="123"
              maxLength={4}
              className={inputCls(false)}
            />
          </div>
        </div>
      </div>

      <button
        onClick={handlePay}
        disabled={isProcessing || !selectedPlan}
        className="w-full h-[48px] rounded-[8px] bg-[var(--color-auth-primary)] text-white font-semibold text-[15px] hover:bg-[var(--color-brand-primary-active)] disabled:opacity-60 transition"
      >
        {isProcessing
          ? "Processing…"
          : selectedPlan
            ? `Pay ₹${PLANS.find((p) => p.id === selectedPlan)?.price} & Complete Registration`
            : "Select a plan to continue"}
      </button>

      <button
        type="button"
        onClick={onBack}
        className="mt-4 w-full text-center text-[13px] text-[var(--color-auth-ink-muted)] hover:underline"
      >
        ← Back
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ShopkeeperSignupPage() {
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Draft
  const [draftId, setDraftId] = useState<string | null>(null);

  // Step 1 persisted data
  const [step1Email, setStep1Email] = useState("");

  // Step 2 logo
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Step 2 data (for restore / resend phone)
  const [step2Data, setStep2Data] = useState<Step2Values | null>(null);

  // Step 3: OTP
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [otpCooldown, setOtpCooldown] = useState(0);

  // ── On mount: if already logged in redirect away; otherwise restore draft
  useEffect(() => {
    const shopkeeperToken = localStorage.getItem("shopkeeper_token");
    const customerToken = localStorage.getItem("token");
    if (shopkeeperToken) {
      router.replace("/shopkeeper/dashboard");
      return;
    }
    if (customerToken) {
      router.replace("/");
      return;
    }
    const saved = localStorage.getItem("shopkeeper_draft_id");
    if (saved) setDraftId(saved);
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── OTP cooldown ticker
  useEffect(() => {
    if (otpCooldown <= 0) return;
    const t = setTimeout(() => setOtpCooldown((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [otpCooldown]);

  // ── Clean up logo blob URL
  useEffect(() => {
    return () => {
      if (logoPreview?.startsWith("blob:")) URL.revokeObjectURL(logoPreview);
    };
  }, [logoPreview]);

  // ─── Step 1 Form ────────────────────────────────────────────────────────────

  const {
    register: reg1,
    handleSubmit: hs1,
    formState: { errors: e1 },
  } = useForm<Step1Values>({
    resolver: zodResolver(step1Schema),
    mode: "onTouched",
    defaultValues: { isShopkeeper: false as unknown as true },
  });

  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);

  async function onStep1Submit(v: Step1Values) {
    setIsLoading(true);
    setServerError(null);
    try {
      const res = await apiClient.post("/api/shopkeeper/draft/init", {
        email: v.email,
        password: v.password,
      });
      const {
        draftId: id,
        restored,
        draft,
      } = res.data as {
        draftId: string;
        restored: boolean;
        draft: { currentStep: number; data: Record<string, unknown> };
      };
      setDraftId(id);
      localStorage.setItem("shopkeeper_draft_id", id);
      setStep1Email(v.email);

      if (restored && draft.currentStep > 1) {
        // Restore step 2 data if available
        const d = draft.data;
        if (d?.shopName) {
          setStep2Data({
            shopName: (d.shopName as string) ?? "",
            shopCategory: (d.shopCategory as string) ?? "",
            shopAddress: (d.shopAddress as string) ?? "",
            phoneNumber: (d.phoneNumber as string) ?? "",
          });
        }
        setCurrentStep(Math.min(draft.currentStep, 4));
      } else {
        setCurrentStep(2);
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setServerError(e?.response?.data?.message ?? "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  // ─── Step 2 Form ────────────────────────────────────────────────────────────

  const {
    register: reg2,
    handleSubmit: hs2,
    formState: { errors: e2 },
    reset: reset2,
  } = useForm<Step2Values>({
    resolver: zodResolver(step2Schema),
    mode: "onTouched",
  });

  // Pre-fill from restored draft
  useEffect(() => {
    if (step2Data) reset2(step2Data);
  }, [step2Data, reset2]);

  function handleLogoChange(ev: React.ChangeEvent<HTMLInputElement>) {
    const file = ev.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setServerError("Logo must be under 2 MB");
      return;
    }
    setLogoFile(file);
    if (logoPreview?.startsWith("blob:")) URL.revokeObjectURL(logoPreview);
    setLogoPreview(URL.createObjectURL(file));
  }

  async function onStep2Submit(v: Step2Values) {
    if (!draftId) return;
    setIsLoading(true);
    setServerError(null);
    try {
      // Upload logo to Cloudinary via backend (if one was chosen)
      // The /upload-logo endpoint saves logoUrl directly into draft data.
      if (logoFile) {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(logoFile);
        });
        await apiClient.post("/api/shopkeeper/upload-logo", {
          draftId,
          image: base64,
        });
      }

      // Persist the rest of step 2 data (logoUrl is already merged by upload-logo)
      await apiClient.put(`/api/shopkeeper/draft/${draftId}`, {
        step: 2,
        data: { ...v },
      });
      setStep2Data(v);

      // Send phone OTP
      await apiClient.post("/api/shopkeeper/phone/send-otp", {
        draftId,
        phoneNumber: v.phoneNumber,
      });
      setOtpCooldown(60);
      setCurrentStep(3);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setServerError(e?.response?.data?.message ?? "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  // ─── Step 3: Phone OTP ───────────────────────────────────────────────────────

  function handleOtpChange(idx: number, value: string) {
    if (value.length > 1) {
      // Paste
      const digits = value.replace(/\D/g, "").slice(0, 6);
      const next = [...otpDigits];
      for (let i = 0; i < digits.length && idx + i < 6; i++) {
        next[idx + i] = digits[i];
      }
      setOtpDigits(next);
      const focus = Math.min(idx + digits.length, 5);
      otpInputsRef.current[focus]?.focus();
      return;
    }
    if (!/^\d*$/.test(value)) return;
    const next = [...otpDigits];
    next[idx] = value;
    setOtpDigits(next);
    if (value && idx < 5) otpInputsRef.current[idx + 1]?.focus();
  }

  function handleOtpKeyDown(
    idx: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (e.key === "Backspace" && !otpDigits[idx] && idx > 0) {
      otpInputsRef.current[idx - 1]?.focus();
    }
  }

  async function handleVerifyPhone() {
    const code = otpDigits.join("");
    if (code.length !== 6 || !draftId) return;
    setIsLoading(true);
    setServerError(null);
    try {
      await apiClient.post("/api/shopkeeper/phone/verify-otp", {
        draftId,
        code,
      });
      setCurrentStep(4);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setServerError(e?.response?.data?.message ?? "Invalid code");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResendOtp() {
    if (!draftId || !step2Data || otpCooldown > 0) return;
    setServerError(null);
    try {
      await apiClient.post("/api/shopkeeper/phone/send-otp", {
        draftId,
        phoneNumber: step2Data.phoneNumber,
      });
      setOtpCooldown(60);
      setOtpDigits(["", "", "", "", "", ""]);
      otpInputsRef.current[0]?.focus();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setServerError(e?.response?.data?.message ?? "Failed to resend");
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────────

  if (!ready) return null;

  return (
    <div className="flex flex-1 bg-[var(--color-bg-page)]">
      <ShopkeeperLeftPanel />

      {/* Right panel */}
      <div className="flex flex-1 items-start justify-center px-6 py-10 overflow-y-auto min-h-screen">
        <div className="w-full max-w-[500px]">
          {/* Logo */}
          <div className="flex items-center gap-2 text-[var(--color-auth-ink)] mb-8 justify-center">
            <Image
              src="/ShopRoomIcon.svg"
              alt="ShopRoom"
              width={24}
              height={21}
            />
            <span className="text-[24px] leading-[32px] tracking-[-1.2px] font-bold">
              ShopRoom
            </span>
          </div>

          {/* Card */}
          <div className="rounded-[14px] bg-[var(--color-bg-surface)] px-8 py-8 shadow-[0_12px_40px_rgba(25,25,47,0.06)] border border-[var(--color-border-default)]">
            <StepIndicator current={currentStep} />

            {/* Server error banner (shared) */}
            {serverError && (
              <div className="mb-5 rounded-[8px] bg-red-50 border border-red-200 px-4 py-3 text-[13px] text-red-600">
                {serverError}
              </div>
            )}

            {/* ══════════ STEP 1 ══════════ */}
            {currentStep === 1 && (
              <div>
                <h1 className="text-[22px] font-extrabold text-[var(--color-auth-ink)] tracking-[-0.5px] mb-1">
                  Create your account
                </h1>
                <p className="text-[13px] text-[var(--color-auth-ink-muted)] mb-6">
                  Start by setting up your login credentials.
                </p>

                <form
                  onSubmit={hs1(onStep1Submit)}
                  noValidate
                  className="flex flex-col gap-4"
                >
                  {/* Work Email */}
                  <div className="flex flex-col gap-1">
                    <label className={labelCls()}>Work Email</label>
                    <input
                      {...reg1("email")}
                      type="email"
                      placeholder="you@yourshop.com"
                      className={inputCls(!!e1.email)}
                    />
                    <FieldError msg={e1.email?.message} />
                  </div>

                  {/* Password */}
                  <div className="flex flex-col gap-1">
                    <label className={labelCls()}>Password</label>
                    <div className="relative">
                      <input
                        {...reg1("password")}
                        type={showPw ? "text" : "password"}
                        placeholder="Min. 8 characters"
                        className={`${inputCls(!!e1.password)} pr-10`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-auth-ink-muted)] hover:text-[var(--color-auth-ink)]"
                      >
                        <EyeIcon open={showPw} />
                      </button>
                    </div>
                    <FieldError msg={e1.password?.message} />
                  </div>

                  {/* Confirm Password */}
                  <div className="flex flex-col gap-1">
                    <label className={labelCls()}>Confirm Password</label>
                    <div className="relative">
                      <input
                        {...reg1("confirmPassword")}
                        type={showCpw ? "text" : "password"}
                        placeholder="Repeat your password"
                        className={`${inputCls(!!e1.confirmPassword)} pr-10`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCpw((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-auth-ink-muted)] hover:text-[var(--color-auth-ink)]"
                      >
                        <EyeIcon open={showCpw} />
                      </button>
                    </div>
                    <FieldError msg={e1.confirmPassword?.message} />
                  </div>

                  {/* Shopkeeper confirmation */}
                  <label className="flex items-start gap-3 cursor-pointer mt-1">
                    <input
                      {...reg1("isShopkeeper")}
                      type="checkbox"
                      className="mt-0.5 accent-[var(--color-auth-primary)] w-4 h-4 shrink-0"
                    />
                    <span className="text-[13px] text-[var(--color-auth-ink-muted)] leading-snug">
                      I confirm that I am a shopkeeper registering on behalf of
                      my business
                    </span>
                  </label>
                  <FieldError msg={e1.isShopkeeper?.message} />

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-1 h-[46px] w-full rounded-[8px] bg-[var(--color-auth-primary)] text-white font-semibold text-[14px] hover:bg-[var(--color-brand-primary-active)] disabled:opacity-60 transition"
                  >
                    {isLoading ? "Please wait…" : "Continue →"}
                  </button>
                </form>

                <p className="mt-5 text-center text-[13px] text-[var(--color-auth-ink-muted)]">
                  Already have an account?{" "}
                  <Link
                    href="/shopkeeper/login"
                    className="text-[var(--color-auth-primary)] font-semibold hover:underline"
                  >
                    Log in
                  </Link>
                </p>
              </div>
            )}

            {/* ══════════ STEP 2 ══════════ */}
            {currentStep === 2 && (
              <div>
                <h1 className="text-[22px] font-extrabold text-[var(--color-auth-ink)] tracking-[-0.5px] mb-1">
                  Tell us about your shop
                </h1>
                <p className="text-[13px] text-[var(--color-auth-ink-muted)] mb-6">
                  Add your shop details so customers can find you.
                </p>

                <form
                  onSubmit={hs2(onStep2Submit)}
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
                      {...reg2("shopName")}
                      placeholder="e.g. Patel Fashion House"
                      className={inputCls(!!e2.shopName)}
                    />
                    <FieldError msg={e2.shopName?.message} />
                  </div>

                  {/* Category */}
                  <div className="flex flex-col gap-1">
                    <label className={labelCls()}>Category</label>
                    <input
                      {...reg2("shopCategory")}
                      placeholder="e.g. Apparel & Fashion, Electronics, Footwear…"
                      className={inputCls(!!e2.shopCategory)}
                    />
                    <p className="text-[11px] text-[var(--color-auth-ink-muted)]">
                      Type freely — Clothing, Footwear & Accessories → Apparel &
                      Fashion
                    </p>
                    <FieldError msg={e2.shopCategory?.message} />
                  </div>

                  {/* Address */}
                  <div className="flex flex-col gap-1">
                    <label className={labelCls()}>Shop Address</label>
                    <textarea
                      {...reg2("shopAddress")}
                      rows={2}
                      placeholder="Street, City, State, PIN"
                      className={`rounded-[8px] bg-[var(--color-auth-input-bg)] px-4 py-3 text-[14px] text-[var(--color-auth-ink)] placeholder:text-[var(--color-auth-ink-muted)]/50 outline-none border resize-none transition ${
                        e2.shopAddress
                          ? "border-red-400 ring-1 ring-red-300"
                          : "border-transparent focus:border-[var(--color-auth-primary)] focus:ring-1 focus:ring-[var(--color-auth-primary)]"
                      }`}
                    />
                    <FieldError msg={e2.shopAddress?.message} />
                  </div>

                  {/* Phone Number */}
                  <div className="flex flex-col gap-1">
                    <label className={labelCls()}>Phone Number</label>
                    <div className="flex">
                      <div className="h-[46px] flex items-center px-3 rounded-l-[8px] bg-[var(--color-auth-input-bg)] border-r border-[var(--color-auth-border)] text-[14px] text-[var(--color-auth-ink-muted)] font-semibold select-none shrink-0">
                        +91
                      </div>
                      <input
                        {...reg2("phoneNumber")}
                        type="tel"
                        maxLength={10}
                        placeholder="9876543210"
                        className={`flex-1 h-[46px] rounded-r-[8px] bg-[var(--color-auth-input-bg)] px-4 text-[14px] text-[var(--color-auth-ink)] placeholder:text-[var(--color-auth-ink-muted)]/50 outline-none border transition ${
                          e2.phoneNumber
                            ? "border-red-400 ring-1 ring-red-300"
                            : "border-transparent focus:border-[var(--color-auth-primary)] focus:ring-1 focus:ring-[var(--color-auth-primary)]"
                        }`}
                      />
                    </div>
                    <p className="text-[11px] text-[var(--color-auth-ink-muted)]">
                      A 6-digit OTP will be sent to verify this number
                    </p>
                    <FieldError msg={e2.phoneNumber?.message} />
                  </div>

                  <div className="flex gap-3 mt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentStep(1);
                        setServerError(null);
                      }}
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
            )}

            {/* ══════════ STEP 3: Phone OTP ══════════ */}
            {currentStep === 3 && (
              <div className="flex flex-col items-center">
                {/* Phone icon */}
                <div className="w-14 h-14 rounded-2xl bg-[var(--color-auth-input-bg)] flex items-center justify-center mb-4">
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--color-auth-primary)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  >
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11 19.79 19.79 0 01.25 2.41 2 2 0 012.24.25h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                  </svg>
                </div>

                <h1 className="text-[22px] font-extrabold text-[var(--color-auth-ink)] tracking-[-0.5px] mb-1 text-center">
                  Verify your phone
                </h1>
                <p className="text-[13px] text-[var(--color-auth-ink-muted)] text-center mb-1">
                  Enter the 6-digit code sent to
                </p>
                <p className="text-[14px] font-semibold text-[var(--color-auth-ink)] text-center mb-6">
                  +91 {step2Data?.phoneNumber}
                </p>

                {/* OTP inputs */}
                <div className="flex gap-2 mb-6">
                  {otpDigits.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        otpInputsRef.current[i] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className={`w-11 h-12 rounded-[8px] text-center text-[20px] font-bold outline-none border transition
                        ${
                          digit
                            ? "border-[var(--color-auth-primary)] bg-[var(--color-auth-input-bg)]"
                            : "border-[var(--color-auth-border)] bg-[var(--color-auth-input-bg)]"
                        }
                        focus:border-[var(--color-auth-primary)] focus:ring-2 focus:ring-[var(--color-auth-primary)]/20
                        text-[var(--color-auth-ink)]`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleVerifyPhone}
                  disabled={isLoading || otpDigits.join("").length !== 6}
                  className="w-full h-[46px] rounded-[8px] bg-[var(--color-auth-primary)] text-white font-semibold text-[14px] hover:bg-[var(--color-brand-primary-active)] disabled:opacity-60 transition mb-4"
                >
                  {isLoading ? "Verifying…" : "Verify Phone →"}
                </button>

                <p className="text-[13px] text-[var(--color-auth-ink-muted)] text-center">
                  {otpCooldown > 0 ? (
                    <>
                      Resend code in{" "}
                      <span className="font-semibold text-[var(--color-auth-ink)]">
                        {otpCooldown}s
                      </span>
                    </>
                  ) : (
                    <button
                      onClick={handleResendOtp}
                      className="text-[var(--color-auth-primary)] font-semibold hover:underline"
                    >
                      Resend code
                    </button>
                  )}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep(2);
                    setServerError(null);
                  }}
                  className="mt-4 text-[13px] text-[var(--color-auth-ink-muted)] hover:underline"
                >
                  ← Back to shop details
                </button>
              </div>
            )}

            {/* ══════════ STEP 4: Payment ══════════ */}
            {currentStep === 4 && draftId && (
              <Step4Payment
                draftId={draftId}
                userEmail={step1Email}
                onSuccess={() => {
                  localStorage.removeItem("shopkeeper_draft_id");
                  router.push("/shopkeeper/success");
                }}
                onError={(msg) => setServerError(msg)}
                onBack={() => {
                  setCurrentStep(3);
                  setServerError(null);
                }}
              />
            )}
          </div>

          {/* Footer link */}
          <p className="mt-4 text-center text-[12px] text-[var(--color-auth-ink-muted)]">
            Looking to shop?{" "}
            <Link
              href="/signup"
              className="text-[var(--color-auth-primary)] hover:underline"
            >
              Create a customer account
            </Link>
          </p>

          {/* Draft auto-save notice */}
          {draftId && currentStep > 1 && (
            <p className="mt-2 text-center text-[11px] text-[var(--color-auth-ink-muted)]/70">
              Your progress is auto-saved for 7 days.
            </p>
          )}

          {/* Registered shopkeeper link */}
          <p className="mt-2 text-center text-[12px] text-[var(--color-auth-ink-muted)]">
            Registering for{" "}
            <span className="font-medium text-[var(--color-auth-ink)]">
              {step1Email || "your shop"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
