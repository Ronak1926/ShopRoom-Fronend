"use client";

import { useState } from "react";

import { PLANS, type PlanId } from "../_lib/schemas";
import { apiClient } from "../../../../utils/apiClient";
import { inputCls, labelCls } from "./FormHelpers";

interface Step4PaymentProps {
  draftId: string;
  userEmail: string;
  onSuccess: (token: string, inviteCode: string) => void;
  onError: (msg: string) => void;
  onBack: () => void;
}

export function Step4Payment({
  draftId,
  userEmail: _userEmail,
  onSuccess,
  onError,
  onBack,
}: Step4PaymentProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // ── DEV MODE: skip real Razorpay, send mock values to backend ────────────────
  async function handlePay() {
    if (!selectedPlan) return;
    setIsProcessing(true);
    try {
      const orderRes = await apiClient.post(
        "/api/shopkeeper/payment/create-order",
        {
          draftId,
          planType: selectedPlan,
        },
      );
      const { orderId } = orderRes.data as { orderId: string };

      const res = await apiClient.post("/api/shopkeeper/payment/verify", {
        draftId,
        planType: selectedPlan,
        razorpayOrderId: orderId,
        razorpayPaymentId: `pay_dev_${Date.now()}`,
        razorpaySignature: "dev_signature",
      });

      const { token, inviteCode } = res.data as {
        token: string;
        inviteCode: string;
      };
      onSuccess(token, inviteCode);
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

      {/* Dev notice */}
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

      {/* Dev card form */}
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
