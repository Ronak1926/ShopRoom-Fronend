"use client";

import "@/lib/zodJitless";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { saveGstin } from "@/features/billing/invoice";

const schema = z.object({
  gstin: z
    .string()
    .trim()
    .toUpperCase()
    .refine((v) => v === "" || /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(v), "A GSTIN has 15 characters, like 27AAPFU0939F1ZV"),
});
type Values = z.infer<typeof schema>;

/** The GSTIN printed as the buyer's on invoices issued from now on (optional; for businesses that claim input credit). */
export default function GstinCard({ initial }: { initial: string | null }) {
  const [saved, setSaved] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { gstin: initial ?? "" } });

  async function onSubmit({ gstin }: Values) {
    setServerError(null);
    setSaved(null);
    try {
      setSaved(await saveGstin(gstin));
    } catch (err) {
      setServerError((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Couldn't save the GSTIN. Please try again.");
    }
  }

  return (
    <section className="rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-6">
      <h2 className="text-[16px] font-bold text-(--color-text-primary)">GSTIN for invoices</h2>
      <p className="mt-1 text-[13px] text-(--color-text-secondary)">Optional. If your business is GST-registered, add your GSTIN and it will be printed on the tax invoices we issue from now on. Invoices already issued don&apos;t change.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-start" noValidate>
        <div className="flex-1">
          <label htmlFor="gstin" className="sr-only">
            GSTIN
          </label>
          <input
            id="gstin"
            {...register("gstin")}
            maxLength={15}
            autoComplete="off"
            spellCheck={false}
            placeholder="27AAPFU0939F1ZV"
            className="h-10 w-full rounded-lg border border-(--color-border-default) bg-(--color-bg-surface) px-3 font-mono text-sm uppercase text-(--color-text-primary)"
          />
          {errors.gstin && <p className="mt-1 text-[12px] text-(--color-danger)">{errors.gstin.message}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-10 rounded-lg bg-(--color-brand-primary) px-5 text-[13px] font-semibold text-white hover:bg-(--color-brand-primary-active) disabled:opacity-50"
        >
          {isSubmitting ? "Saving…" : "Save"}
        </button>
      </form>
      {saved && (
        <p role="status" className="mt-2 text-[13px] text-(--color-success-text)">
          {saved}
        </p>
      )}
      {serverError && (
        <p role="alert" className="mt-2 text-[13px] text-(--color-danger)">
          {serverError}
        </p>
      )}
    </section>
  );
}
