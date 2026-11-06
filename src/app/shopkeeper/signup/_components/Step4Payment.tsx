"use client";

import Link from "next/link";
import { useState } from "react";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";

import { PLANS, type PlanId } from "../_lib/schemas";
import { apiClient } from "@/utils/apiClient";
import { PaymentUnconfirmedError, runCheckout, type CheckoutOrder } from "@/features/billing/checkout";
import { describePaymentFailure } from "@/features/billing/describePaymentFailure";

interface Step4PaymentProps {
  draftId: string;
  userEmail: string;
  onSuccess: (shopkeeperId: string, inviteCode: string) => void;
  onError: (msg: string) => void;
  onBack: () => void;
}

/** Shown when the money was taken but the server could not be reached to finish: it finishes by itself. */
function PaymentReceived({ paymentId }: { paymentId: string }) {
  return (
    <div role="status" className="flex flex-col items-center gap-4 py-6 text-center">
      <TaskAltOutlinedIcon sx={{ fontSize: 48 }} className="text-(--color-success)" />
      <h1 className="text-[22px] font-extrabold tracking-[-0.5px] text-(--color-auth-ink)">Payment received</h1>
      <p className="text-[13px] leading-relaxed text-(--color-auth-ink-muted)">
        We couldn&apos;t reach our server to finish setting up your shop, but your payment went through and nothing is lost. Your account will be ready in a minute or two.
        Log in with the email and password you chose. <strong>Please don&apos;t pay again.</strong>
      </p>
      <p className="text-[12px] text-(--color-auth-ink-muted)">
        Payment reference: <span className="font-mono select-all">{paymentId}</span>
      </p>
      <Link
        href="/customer/login?tab=shopkeeper"
        className="flex h-12 w-full items-center justify-center rounded-lg bg-(--color-auth-primary) text-[15px] font-semibold text-white transition hover:bg-(--color-brand-primary-active)"
      >
        Go to log in
      </Link>
    </div>
  );
}

export function Step4Payment({ draftId, userEmail, onSuccess, onError, onBack }: Step4PaymentProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [unconfirmedPaymentId, setUnconfirmedPaymentId] = useState<string | null>(null);
  const plan = PLANS.find((p) => p.id === selectedPlan);

  async function handlePay() {
    if (!plan) return;
    setIsProcessing(true);
    try {
      const { data: order } = await apiClient.post<CheckoutOrder>("/api/shopkeeper/payment/create-order", { draftId, planType: plan.id });
      const account = await runCheckout({
        order,
        description: `ShopRoom ${plan.label} plan`,
        email: userEmail,
        confirm: async (payment) =>
          (
            await apiClient.post<{ shopkeeperId: string; inviteCode: string }>("/api/shopkeeper/payment/verify", {
              draftId,
              razorpayOrderId: payment.orderId,
              razorpayPaymentId: payment.paymentId,
              razorpaySignature: payment.signature,
            })
          ).data,
      });
      if (account) onSuccess(account.shopkeeperId, account.inviteCode);
    } catch (err) {
      if (err instanceof PaymentUnconfirmedError) setUnconfirmedPaymentId(err.paymentId);
      else onError(describePaymentFailure(err, "Payment failed. Please try again."));
    } finally {
      setIsProcessing(false);
    }
  }

  if (unconfirmedPaymentId) return <PaymentReceived paymentId={unconfirmedPaymentId} />;

  return (
    <div>
      <h1 className="text-[22px] font-extrabold text-(--color-auth-ink) tracking-[-0.5px] mb-1">Choose your plan</h1>
      <p className="text-[13px] text-(--color-auth-ink-muted) mb-5">Select a subscription and complete your registration.</p>

      <div className="flex flex-col gap-3 mb-5">
        {PLANS.map((p) => {
          const selected = selectedPlan === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedPlan(p.id)}
              disabled={isProcessing}
              aria-pressed={selected}
              className={`relative flex items-center justify-between px-4 py-3.5 rounded-[10px] border-2 text-left transition disabled:opacity-70 ${
                selected
                  ? "border-(--color-auth-primary) bg-(--color-auth-primary)/5"
                  : "border-(--color-auth-border) hover:border-(--color-auth-primary)/50"
              }`}
            >
              {p.recommended && (
                <span className="absolute -top-[11px] left-4 bg-(--color-auth-primary) text-white text-[9px] font-bold px-2 py-0.5 rounded-full tracking-[0.5px] uppercase">
                  Popular
                </span>
              )}
              <div>
                <div className={`font-semibold text-[14px] ${selected ? "text-(--color-auth-primary)" : "text-(--color-auth-ink)"}`}>{p.label}</div>
                <div className="text-[12px] text-(--color-auth-ink-muted)">{p.description}</div>
              </div>
              <div className="text-right shrink-0">
                <div className={`text-[20px] font-extrabold tracking-[-0.5px] ${selected ? "text-(--color-auth-primary)" : "text-(--color-auth-ink)"}`}>₹{p.price}</div>
                <div className="text-[11px] text-(--color-auth-ink-muted)">one-time</div>
              </div>
            </button>
          );
        })}
      </div>

      <p className="mb-4 flex items-center gap-1.5 text-[12px] text-(--color-auth-ink-muted)">
        <LockOutlinedIcon sx={{ fontSize: 14 }} />
        Secure payment by Razorpay. Cards, UPI and net banking. We never see your card details.
      </p>

      <button
        type="button"
        onClick={handlePay}
        disabled={isProcessing || !plan}
        className="w-full h-12 rounded-lg bg-(--color-auth-primary) text-white font-semibold text-[15px] hover:bg-(--color-brand-primary-active) disabled:opacity-60 transition"
      >
        {isProcessing ? (
          "Processing…"
        ) : plan ? (
          <span className="inline-flex items-center justify-center gap-1.5">
            {`Pay ₹${plan.price} & Complete Registration`}
            <ArrowForwardOutlinedIcon sx={{ fontSize: 16 }} />
          </span>
        ) : (
          "Select a plan to continue"
        )}
      </button>

      <button
        type="button"
        onClick={onBack}
        disabled={isProcessing}
        className="mt-4 w-full text-center text-[13px] text-(--color-auth-ink-muted) hover:underline disabled:opacity-60"
      >
        ← Back
      </button>
    </div>
  );
}
