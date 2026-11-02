import type { Metadata } from "next";
import ResetPasswordForm from "./_components/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Choose a new password · ShopRoom",
  // The reset link carries a one-time token; keep the page out of search results.
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
