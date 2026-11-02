"use client";

import "@/lib/zodJitless";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import { authInputCls, authLabelCls } from "@/components/ui/authInput";
import { apiMessage } from "@/features/account/passwordApi";
import { apiClient } from "@/utils/apiClient";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Tell us your name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(254),
  subject: z.string().trim().min(1, "Add a subject").max(150),
  message: z.string().trim().min(10, "Write at least a sentence").max(4000, "Please keep it under 4000 characters"),
});
type ContactValues = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({ resolver: zodResolver(contactSchema), mode: "onTouched" });

  async function onSubmit(values: ContactValues) {
    setServerError(null);
    try {
      await apiClient.post("/api/public/contact", values);
      reset();
      setSent(true);
    } catch (err) {
      setServerError(apiMessage(err, "We couldn't send your message. Please try again."));
    }
  }

  if (sent) {
    return (
      <div role="status" className="flex flex-col items-center gap-3 py-6 text-center">
        <CheckCircleOutlinedIcon sx={{ fontSize: 44 }} className="text-(--color-success)" />
        <h2 className="text-[20px] font-bold text-(--color-text-primary)">Message sent</h2>
        <p className="text-[14px] text-(--color-text-secondary)">Thanks! We&apos;ll get back to you by email.</p>
        <button type="button" onClick={() => setSent(false)} className="mt-2 text-[13px] font-bold text-(--color-text-link) hover:underline">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      {(["name", "email", "subject"] as const).map((field) => (
        <div key={field} className="flex flex-col gap-1">
          <label htmlFor={`contact-${field}`} className={authLabelCls}>
            {field === "email" ? "Your email" : field === "name" ? "Your name" : "Subject"}
          </label>
          <input
            id={`contact-${field}`}
            type={field === "email" ? "email" : "text"}
            autoComplete={field === "email" ? "email" : field === "name" ? "name" : "off"}
            {...register(field)}
            className={`${authInputCls(!!errors[field])} px-4`}
          />
          {errors[field] && <p className="text-[11px] text-(--color-danger)">{errors[field]?.message}</p>}
        </div>
      ))}

      <div className="flex flex-col gap-1">
        <label htmlFor="contact-message" className={authLabelCls}>
          Message
        </label>
        <textarea
          id="contact-message"
          rows={6}
          {...register("message")}
          className={`w-full resize-y rounded-lg border border-transparent bg-(--color-auth-input-bg) px-4 py-3 text-sm text-(--color-auth-ink) outline-none focus:ring-2 focus:ring-(--color-auth-primary)/30 ${
            errors.message ? "ring-2 ring-(--color-danger)" : ""
          }`}
        />
        {errors.message && <p className="text-[11px] text-(--color-danger)">{errors.message.message}</p>}
      </div>

      {serverError && (
        <p role="alert" className="rounded-lg bg-(--color-danger-bg) px-3 py-2 text-[12px] text-(--color-danger)">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="h-12 w-full rounded-lg bg-(--color-auth-primary) text-[15px] font-bold text-white transition-colors hover:bg-(--color-brand-primary-active) disabled:opacity-60"
      >
        {isSubmitting ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
