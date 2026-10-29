import PushNotificationHost from "@/components/notifications/PushNotificationHost";

export default function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <PushNotificationHost />
      {children}
    </>
  );
}
