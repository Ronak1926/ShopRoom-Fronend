"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import ShopkeeperShell from "@/components/shopkeeper/ShopkeeperShell";
import { fetchBilling, renewPlan, type Billing, type PlanId } from "@/features/billing/api";
import { publishBilling } from "@/features/billing/usePlanStatus";
import { formatDate } from "@/features/billing/format";
import { deleteCookie } from "@/utils/cookieUtils";
import BillingSkeleton from "./_components/BillingSkeleton";
import CurrentPlanCard from "./_components/CurrentPlanCard";
import PaymentHistory from "./_components/PaymentHistory";
import PlanPicker from "./_components/PlanPicker";

function errorMessage(err: unknown): string {
  const e = err as { response?: { data?: { message?: string } }; message?: string };
  return e?.response?.data?.message ?? e?.message ?? "Payment failed. Please try again.";
}

export default function ShopkeeperBillingPage() {
  const router = useRouter();
  const [billing, setBilling] = useState<Billing | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [selected, setSelected] = useState<PlanId | null>(null);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [renewedUntil, setRenewedUntil] = useState<string | null>(null);

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

  async function pay() {
    const plan = billing?.plans.find((p) => p.id === selected);
    if (!plan) return;
    setPaying(true);
    setError(null);
    setRenewedUntil(null);
    try {
      const updated = await renewPlan(plan.id, `ShopRoom ${plan.label} plan`);
      if (updated) {
        setBilling(updated);
        publishBilling(updated);
        setRenewedUntil(updated.planExpiresAt);
        setSelected(null);
      }
    } catch (err) {
      setError(errorMessage(err));
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
          {error && (
            <p role="alert" className="rounded-xl bg-(--color-danger-bg) px-4 py-3 text-[13px] text-(--color-danger)">
              {error}
            </p>
          )}

          <CurrentPlanCard billing={billing} />
          <PlanPicker plans={billing.plans} selected={selected} onSelect={setSelected} onPay={() => void pay()} paying={paying} active={billing.active} />
          <PaymentHistory payments={billing.payments} />
        </div>
      ) : (
        <div className="flex items-center justify-center py-20">
          <p className="text-(--color-text-secondary)">{loadError ? "Could not load billing. Please try again." : "Billing unavailable."}</p>
        </div>
      )}
    </ShopkeeperShell>
  );
}
