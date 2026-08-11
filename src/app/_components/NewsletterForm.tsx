"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
});

type FormValues = z.infer<typeof schema>;

export default function NewsletterForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  function onSubmit() {
    // No newsletter backend yet — acknowledge locally and clear the field.
    reset({ email: "" });
  }

  if (isSubmitSuccessful) {
    return (
      <div className="flex items-center gap-2 h-11 px-4 rounded-full bg-(--color-badge-success-bg)">
        <CheckCircleRoundedIcon
          sx={{ fontSize: 18, color: "var(--color-badge-success-text)" }}
        />
        <span className="text-[13px] font-semibold text-(--color-badge-success-text)">
          Thanks! You&apos;re on the list.
        </span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <input
          type="email"
          placeholder="Enter your email"
          aria-label="Email address"
          {...register("email")}
          className="h-11 flex-1 min-w-0 px-4 rounded-full bg-(--color-bg-surface) border border-(--color-border-default) text-[14px] text-(--color-text-primary) placeholder:text-(--color-text-hint) focus:outline-none focus:border-(--color-border-focus)"
        />
        <button
          type="submit"
          aria-label="Subscribe"
          className="flex items-center justify-center w-11 h-11 shrink-0 rounded-full bg-(--color-brand-primary) text-(--color-text-on-brand) hover:bg-(--color-brand-primary-hover) transition-colors duration-150 cursor-pointer"
        >
          <ArrowForwardRoundedIcon sx={{ fontSize: 20 }} />
        </button>
      </div>
      {errors.email && (
        <span className="text-[12px] text-(--color-danger) px-4">
          {errors.email.message}
        </span>
      )}
    </form>
  );
}
