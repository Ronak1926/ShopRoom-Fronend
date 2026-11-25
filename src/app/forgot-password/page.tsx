import type { Metadata } from "next";
import { isAccountRole } from "@/features/account/passwordApi";
import ForgotPasswordForm from "./_components/ForgotPasswordForm";

export const metadata: Metadata = { title: "Reset your password" };

interface PageProps {
  searchParams: Promise<{ role?: string }>;
}

export default async function ForgotPasswordPage({ searchParams }: PageProps) {
  const { role } = await searchParams;
  return <ForgotPasswordForm role={isAccountRole(role) ? role : "customer"} />;
}
