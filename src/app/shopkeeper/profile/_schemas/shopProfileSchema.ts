import { z } from "zod";

export const shopProfileSchema = z.object({
  shopName: z.string().trim().min(2, "Too short").max(120),
  category: z.string().trim().min(2, "Too short").max(60),
  description: z.string().trim().max(1000).optional().or(z.literal("")),
  address: z.string().trim().min(2, "Too short").max(200),
  city: z.string().trim().min(2, "Too short").max(100),
  state: z.string().trim().min(2, "Too short").max(100),
  pincode: z.string().trim().min(3, "Too short").max(12),
  phoneNumber: z.string().trim().min(7, "Too short").max(20),
  ownerName: z.string().trim().min(2, "Too short").max(120).optional().or(z.literal("")),
});

export type ShopProfileFormValues = z.infer<typeof shopProfileSchema>;
