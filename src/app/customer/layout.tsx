import PushNotificationHost from "@/components/notifications/PushNotificationHost";
import CustomerBackgroundSync from "@/components/customer/CustomerBackgroundSync";

export default function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <PushNotificationHost />
      <CustomerBackgroundSync />
      {children}
    </>
  );
}
