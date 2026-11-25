import "@/lib/zodJitless";
import { z } from "zod";

/** Matches the server: bcrypt only reads the first 72 bytes, so longer passwords are refused. */
export const newPasswordSchema = z
  .string()
  .min(8, "Use at least 8 characters")
  .max(72, "Use 72 characters or fewer");

export const emailOnlySchema = z.object({ email: z.string().trim().email("Enter a valid email address") });
export type EmailOnlyValues = z.infer<typeof emailOnlySchema>;

export const resetPasswordSchema = z
  .object({ password: newPasswordSchema, confirm: z.string().min(1, "Confirm your new password") })
  .refine((v) => v.password === v.confirm, { message: "Passwords do not match", path: ["confirm"] });
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: newPasswordSchema,
    confirm: z.string().min(1, "Confirm your new password"),
  })
  .refine((v) => v.newPassword === v.confirm, { message: "Passwords do not match", path: ["confirm"] })
  .refine((v) => v.currentPassword !== v.newPassword, { message: "Choose a different password", path: ["newPassword"] });
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
