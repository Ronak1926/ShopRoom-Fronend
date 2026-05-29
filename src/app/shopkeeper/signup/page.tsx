"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { ShopkeeperLeftPanel } from "../../../components/ui/ShopkeeperLeftPanel";
import { apiClient } from "../../../utils/apiClient";
import { type Step1Values, type Step2Values } from "./_lib/schemas";
import { StepIndicator } from "./_components/StepIndicator";
import { Step1Account } from "./_components/Step1Account";
import { Step2ShopDetails } from "./_components/Step2ShopDetails";
import { Step3PhoneOtp } from "./_components/Step3PhoneOtp";
import { Step4Payment } from "./_components/Step4Payment";

export default function ShopkeeperSignupPage() {
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [draftId, setDraftId] = useState<string | null>(null);
  const [step1Email, setStep1Email] = useState("");
  const [step2Data, setStep2Data] = useState<Step2Values | null>(null);

  // On mount: redirect if already authenticated; otherwise restore draft
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

  // Step 1
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
        const d = draft.data;
        if (d?.shopName) {
          setStep2Data({
            shopName: (d.shopName as string) ?? "",
            shopCategory: (d.shopCategory as string) ?? "",
            address: (d.address as string) ?? "",
            city: (d.city as string) ?? "",
            state: (d.state as string) ?? "",
            pincode: (d.pincode as string) ?? "",
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

  // Step 2
  async function onStep2Submit(
    v: Step2Values,
    logoFile: File | null,
    coords: { lat: number; lng: number } | null,
  ) {
    if (!draftId) return;
    setIsLoading(true);
    setServerError(null);
    try {
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

      await apiClient.put(`/api/shopkeeper/draft/${draftId}`, {
        step: 2,
        data: {
          ...v,
          shopAddress: `${v.address}, ${v.city}, ${v.state} - ${v.pincode}`,
          ...(coords && { latitude: coords.lat, longitude: coords.lng }),
        },
      });
      setStep2Data(v);

      await apiClient.post("/api/shopkeeper/phone/send-otp", {
        draftId,
        phoneNumber: v.phoneNumber,
      });
      setCurrentStep(3);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setServerError(e?.response?.data?.message ?? "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  // Step 3
  async function handleVerifyPhone(code: string) {
    if (!draftId) return;
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
    if (!draftId || !step2Data) return;
    setServerError(null);
    try {
      await apiClient.post("/api/shopkeeper/phone/send-otp", {
        draftId,
        phoneNumber: step2Data.phoneNumber,
      });
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setServerError(e?.response?.data?.message ?? "Failed to resend");
    }
  }

  if (!ready) return null;

  return (
    <div className="flex flex-1 bg-[var(--color-bg-page)]">
      <ShopkeeperLeftPanel />

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

            {serverError && (
              <div className="mb-5 rounded-[8px] bg-red-50 border border-red-200 px-4 py-3 text-[13px] text-red-600">
                {serverError}
              </div>
            )}

            {currentStep === 1 && (
              <Step1Account
                isLoading={isLoading}
                onSubmit={(v) => {
                  setServerError(null);
                  onStep1Submit(v);
                }}
              />
            )}

            {currentStep === 2 && (
              <Step2ShopDetails
                isLoading={isLoading}
                initialValues={step2Data}
                onSubmit={onStep2Submit}
                onBack={() => {
                  setCurrentStep(1);
                  setServerError(null);
                }}
              />
            )}

            {currentStep === 3 && (
              <Step3PhoneOtp
                isLoading={isLoading}
                phoneNumber={step2Data?.phoneNumber ?? ""}
                onVerify={handleVerifyPhone}
                onResend={handleResendOtp}
                onBack={() => {
                  setCurrentStep(2);
                  setServerError(null);
                }}
              />
            )}

            {currentStep === 4 && draftId && (
              <Step4Payment
                draftId={draftId}
                userEmail={step1Email}
                onSuccess={(token, inviteCode) => {
                  localStorage.removeItem("shopkeeper_draft_id");
                  localStorage.setItem("shopkeeper_token", token);
                  localStorage.setItem("shopkeeper_invite_code", inviteCode);
                  router.push("/shopkeeper/dashboard");
                }}
                onError={(msg) => setServerError(msg)}
                onBack={() => {
                  setCurrentStep(3);
                  setServerError(null);
                }}
              />
            )}
          </div>

          <p className="mt-4 text-center text-[12px] text-[var(--color-auth-ink-muted)]">
            Looking to shop?{" "}
            <Link
              href="/signup"
              className="text-[var(--color-auth-primary)] hover:underline"
            >
              Create a customer account
            </Link>
          </p>

          {draftId && currentStep > 1 && (
            <p className="mt-2 text-center text-[11px] text-[var(--color-auth-ink-muted)]/70">
              Your progress is auto-saved for 7 days.
            </p>
          )}

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
