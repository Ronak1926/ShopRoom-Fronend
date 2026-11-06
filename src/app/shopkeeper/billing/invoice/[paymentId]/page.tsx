"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import { fetchInvoice, type Invoice } from "@/features/billing/invoice";
import { deleteCookie } from "@/utils/cookieUtils";
import InvoiceDocument from "./_components/InvoiceDocument";

function InvoiceSkeleton() {
  return (
    <div className="mx-auto max-w-3xl animate-pulse rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-8" aria-busy="true" aria-label="Loading invoice">
      <div className="h-7 w-40 rounded bg-(--color-bg-surface-hover)" />
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="h-20 rounded bg-(--color-bg-surface-hover)" />
        <div className="h-20 rounded bg-(--color-bg-surface-hover)" />
      </div>
      <div className="mt-6 h-24 rounded bg-(--color-bg-surface-hover)" />
    </div>
  );
}

export default function InvoicePage() {
  const router = useRouter();
  const { paymentId } = useParams<{ paymentId: string }>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [problem, setProblem] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchInvoice(paymentId)
      .then((result) => !cancelled && setInvoice(result))
      .catch((err: { response?: { status?: number; data?: { message?: string } } }) => {
        if (cancelled) return;
        if (err?.response?.status === 401) {
          deleteCookie("shopkeeper_token");
          router.replace("/customer/login?tab=shopkeeper");
        } else {
          setProblem(err?.response?.status === 404 ? "This invoice isn't available." : "Couldn't load the invoice. Please try again.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [paymentId, router]);

  return (
    <main className="min-h-screen bg-(--color-bg-page) px-4 py-6 print:bg-white print:p-0">
      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        <div className="flex items-center justify-between print:hidden">
          <Link href="/shopkeeper/billing" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-(--color-text-secondary) hover:text-(--color-text-primary)">
            <ArrowBackOutlinedIcon sx={{ fontSize: 16 }} />
            Billing
          </Link>
          {invoice && (
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-(--color-brand-primary) px-4 text-[13px] font-semibold text-white hover:bg-(--color-brand-primary-active)"
            >
              <PrintOutlinedIcon sx={{ fontSize: 16 }} />
              Print or save as PDF
            </button>
          )}
        </div>
        {problem ? (
          <p role="alert" className="rounded-xl bg-(--color-danger-bg) px-4 py-3 text-[13px] text-(--color-danger)">
            {problem}
          </p>
        ) : invoice ? (
          <InvoiceDocument invoice={invoice} />
        ) : (
          <InvoiceSkeleton />
        )}
      </div>
    </main>
  );
}
