// ── Main nav ──────────────────────────────────────────────────────────────────
// "myroom" has no fixed href: the room id is looked up when it is clicked.
export const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", href: "/shopkeeper/dashboard" },
  { id: "myroom", label: "My Room", href: "/shopkeeper/room" },
  { id: "members", label: "Members", href: "/shopkeeper/members" },
  { id: "notifications", label: "Notifications", href: "/shopkeeper/notifications" },
  { id: "billing", label: "Billing", href: "/shopkeeper/billing" },
  { id: "profile", label: "Profile", href: "/shopkeeper/profile" },
  { id: "settings", label: "Settings", href: "/shopkeeper/settings" },
] as const;

// ── Notifications sub-nav ───────────────────────────────────────────────────────
// Collapsible children of the "Notifications" rail item; each routes to its page.
export const NOTIFICATION_SUBNAV = [
  { id: "send", label: "Send Notification", route: "/shopkeeper/notifications/send" },
  { id: "scheduled", label: "Scheduled", route: "/shopkeeper/notifications/scheduled" },
  { id: "history", label: "History", route: "/shopkeeper/notifications/history" },
  { id: "templates", label: "Templates", route: "/shopkeeper/notifications/templates" },
  { id: "studio", label: "Notification Studio", route: "/shopkeeper/notifications/studio" },
  { id: "preferences", label: "Preferences", route: "/shopkeeper/notifications/preferences" },
] as const;

// Default landing when the Notifications icon is clicked while the rail is collapsed.
export const NOTIFICATION_DEFAULT_ROUTE = "/shopkeeper/notifications/scheduled";
