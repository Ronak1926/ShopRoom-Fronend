import { z } from "zod";

export const customerProfileSchema = z.object({
  fullName: z.string().trim().min(2, "Too short").max(120),
  allowLocationAccess: z.boolean(),
});

export type CustomerProfileFormValues = z.infer<typeof customerProfileSchema>;
