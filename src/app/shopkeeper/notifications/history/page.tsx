"use client";

import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import NotificationsShell from "../_components/NotificationsShell";

export default function NotificationHistoryPage() {
  return (
    <NotificationsShell
      title="Notification History"
      description="Track the performance and delivery status of all your notifications."
      icon={HistoryOutlinedIcon}
    />
  );
}
