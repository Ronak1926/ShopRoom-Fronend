import type { Metadata } from "next";
import ShopkeeperSettings from "./_components/ShopkeeperSettings";

export const metadata: Metadata = { title: "Settings" };

export default function ShopkeeperSettingsPage() {
  return <ShopkeeperSettings />;
}
