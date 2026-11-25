import type { Metadata } from "next";
import CustomerSettings from "./_components/CustomerSettings";

export const metadata: Metadata = { title: "Settings" };

export default function CustomerSettingsPage() {
  return <CustomerSettings />;
}
