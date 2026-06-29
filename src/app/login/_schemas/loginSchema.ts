import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const inputCls = (hasErr: boolean) =>
  `w-full h-[48px] rounded-lg bg-(--color-auth-input-bg) text-sm text-(--color-auth-ink) placeholder:text-(--color-auth-ink-muted) outline-none focus:ring-2 focus:ring-(--color-auth-primary)/30 transition-shadow border border-transparent ${
    hasErr ? "ring-2 ring-red-400" : ""
  }`;
