"use client";

import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import NotificationsShell from "../_components/NotificationsShell";

export default function ScheduledNotificationsPage() {
  return (
    <NotificationsShell
      title="Scheduled Notifications"
      description="Manage your upcoming notifications and schedules."
      icon={ScheduleOutlinedIcon}
    />
  );
}
