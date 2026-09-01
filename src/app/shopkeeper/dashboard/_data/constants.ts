// ── Nav items ─────────────────────────────────────────────────────────────────
export const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "myroom", label: "My Room" },
  { id: "stockalerts", label: "Stock Alerts" },
  { id: "members", label: "Members" },
  { id: "notifications", label: "Notifications" },
  { id: "analytics", label: "Analytics" },
  { id: "billing", label: "Billing" },
  { id: "profile", label: "Profile" },
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
