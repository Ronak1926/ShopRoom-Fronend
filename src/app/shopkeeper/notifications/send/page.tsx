"use client";

import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import NotificationsShell from "../_components/NotificationsShell";

export default function SendNotificationPage() {
  return (
    <NotificationsShell
      title="Send Notification"
      description="Compose and broadcast a notification to your room members."
      icon={SendOutlinedIcon}
    />
  );
}
