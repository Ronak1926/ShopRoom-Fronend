"use client";

import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsShell from "../_components/NotificationsShell";

export default function NotificationTemplatesPage() {
  return (
    <NotificationsShell
      title="Templates"
      description="Professionally designed notification templates to start from."
      icon={GridViewOutlinedIcon}
    />
  );
}
