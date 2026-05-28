import { z } from "zod";

// ─── Zod schemas ──────────────────────────────────────────────────────────────

export const step1Schema = z
  .object({
    email: z.string().trim().email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(200),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    isShopkeeper: z.boolean().refine((v) => v === true, {
      message: "Please confirm you are a shopkeeper",
    }),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const step2Schema = z.object({
  shopName: z.string().trim().min(2, "Shop name must be at least 2 characters"),
  shopCategory: z.string().trim().min(2, "Enter a category"),
  address: z.string().trim().min(5, "Enter your street address"),
  city: z.string().trim().min(2, "Enter your city"),
  state: z.string().min(2, "Select your state"),
  pincode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
  phoneNumber: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
});

export type Step1Values = z.infer<typeof step1Schema>;
export type Step2Values = z.infer<typeof step2Schema>;

// ─── Plans ────────────────────────────────────────────────────────────────────

export type PlanId = "1m" | "2m" | "3m";

export const PLANS: {
  id: PlanId;
  label: string;
  price: number;
  description: string;
  recommended?: true;
}[] = [
  {
    id: "1m",
    label: "1 Month",
    price: 399,
    description: "Try ShopRoom for a month",
  },
  {
    id: "2m",
    label: "2 Months",
    price: 599,
    description: "Most popular choice",
    recommended: true,
  },
  {
    id: "3m",
    label: "3 Months",
    price: 899,
    description: "Best value for money",
  },
];

// ─── Step labels ──────────────────────────────────────────────────────────────

export const STEP_LABELS = [
  "Account",
  "Shop Details",
  "Verify Phone",
  "Payment",
];

// ─── Indian states & UTs ──────────────────────────────────────────────────────

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];
