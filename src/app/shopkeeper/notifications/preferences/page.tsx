"use client";

import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import NotificationsShell from "../_components/NotificationsShell";

export default function NotificationPreferencesPage() {
  return (
    <NotificationsShell
      title="Preferences"
      description="Set your default preferences for notifications."
      icon={TuneOutlinedIcon}
    />
  );
}
