"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import ShopkeeperShell from "@/components/shopkeeper/ShopkeeperShell";
import { fetchBilling, renewPlan, type Billing, type PlanId } from "@/features/billing/api";
import { PaymentUnconfirmedError } from "@/features/billing/checkout";
import { describePaymentFailure } from "@/features/billing/describePaymentFailure";
import { publishBilling } from "@/features/billing/usePlanStatus";
import { formatDate } from "@/features/billing/format";
import { deleteCookie } from "@/utils/cookieUtils";
import BillingSkeleton from "./_components/BillingSkeleton";
import CurrentPlanCard from "./_components/CurrentPlanCard";
import GstinCard from "./_components/GstinCard";
import PaymentHistory from "./_components/PaymentHistory";
import PlanPicker from "./_components/PlanPicker";

/** After a payment we could not confirm, how often (and how far apart) to look for the webhook having applied it. */
const WEBHOOK_CHECKS = 6;
const WEBHOOK_CHECK_INTERVAL_MS = 5000;
const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export default function ShopkeeperBillingPage() {
  const router = useRouter();
  const [billing, setBilling] = useState<Billing | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [selected, setSelected] = useState<PlanId | null>(null);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [renewedUntil, setRenewedUntil] = useState<string | null>(null);
  const [pendingPaymentId, setPendingPaymentId] = useState<string | null>(null);

  useEffect(() => {
    fetchBilling()
      .then(setBilling)
      .catch((err: { response?: { status?: number } }) => {
        if (err?.response?.status === 401) {
          deleteCookie("shopkeeper_token");
          router.replace("/customer/login?tab=shopkeeper");
        } else {
          setLoadError(true);
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  /** The money arrived but the server could not be reached to confirm; Razorpay's webhook applies it, so look for that. */
  async function waitForWebhook(paymentsBefore: number) {
    for (let check = 0; check < WEBHOOK_CHECKS; check += 1) {
      await sleep(WEBHOOK_CHECK_INTERVAL_MS);
      try {
        const latest = await fetchBilling();
        if (latest.payments.length > paymentsBefore) {
          setBilling(latest);
          publishBilling(latest);
          setPendingPaymentId(null);
          setRenewedUntil(latest.planExpiresAt);
          return;
        }
      } catch {
        // Still unreachable: keep waiting, the message on screen already says what to do.
      }
    }
  }

  async function pay() {
    const plan = billing?.plans.find((p) => p.id === selected);
    if (!plan) return;
    setPaying(true);
    setError(null);
    setRenewedUntil(null);
    setPendingPaymentId(null);
    try {
      const updated = await renewPlan(plan.id, `ShopRoom ${plan.label} plan`);
      if (updated) {
        setBilling(updated);
        publishBilling(updated);
        setRenewedUntil(updated.planExpiresAt);
        setSelected(null);
      }
    } catch (err) {
      if (err instanceof PaymentUnconfirmedError) {
        setPendingPaymentId(err.paymentId);
        setSelected(null);
        void waitForWebhook(billing?.payments.length ?? 0);
        return;
      }
      setError(describePaymentFailure(err, "Payment failed. Please try again."));
    } finally {
      setPaying(false);
    }
  }

  return (
    <ShopkeeperShell>
      {loading ? (
        <BillingSkeleton />
      ) : billing ? (
        <div className="mx-auto flex max-w-3xl flex-col gap-5">
          <h1 className="text-[28px] font-bold text-(--color-text-primary)">Billing</h1>

          {renewedUntil && (
            <p role="status" className="flex items-center gap-2 rounded-xl bg-(--color-success-light) px-4 py-3 text-[13px] font-semibold text-(--color-success-text)">
              <CheckCircleOutlinedIcon sx={{ fontSize: 18 }} />
              Payment received. Your plan now runs until {formatDate(renewedUntil)}.
            </p>
          )}
          {pendingPaymentId && (
            <p role="status" className="rounded-xl bg-(--color-brand-alert-light) px-4 py-3 text-[13px] text-(--color-brand-alert-text)">
              Your payment was received (reference <span className="font-mono select-all">{pendingPaymentId}</span>) but we couldn&apos;t reach our server to confirm it. Your plan
              will update on its own within a minute, so please don&apos;t pay again. This page checks automatically.
            </p>
          )}
          {error && (
            <p role="alert" className="rounded-xl bg-(--color-danger-bg) px-4 py-3 text-[13px] text-(--color-danger)">
              {error}
            </p>
          )}

          <CurrentPlanCard billing={billing} />
          <PlanPicker plans={billing.plans} selected={selected} onSelect={setSelected} onPay={() => void pay()} paying={paying} active={billing.active} />
          <PaymentHistory payments={billing.payments} invoicesEnabled={billing.invoicesEnabled} />
          {billing.invoicesEnabled && <GstinCard initial={billing.gstin} />}
        </div>
      ) : (
        <div className="flex items-center justify-center py-20">
          <p className="text-(--color-text-secondary)">{loadError ? "Could not load billing. Please try again." : "Billing unavailable."}</p>
        </div>
      )}
    </ShopkeeperShell>
  );
}
