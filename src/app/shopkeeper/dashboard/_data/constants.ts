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

// ── KPI cards ─────────────────────────────────────────────────────────────────
// iconBgClass / badge.className are Tailwind utility strings (scanned at build time)
export const KPI_CARDS = [
  {
    id: "members",
    iconKey: "people",
    iconBgClass: "bg-[var(--color-brand-primary-light)]",
    iconColor: "var(--color-brand-primary)",
    badge: {
      text: "↑ 12%",
      className:
        "bg-[var(--color-badge-success-bg)] text-[var(--color-badge-success-text)]",
    },
    label: "ROOM MEMBERS",
    value: "312",
    dot: false,
  },
  {
    id: "messages",
    iconKey: "chat",
    iconBgClass: "bg-[var(--color-brand-primary-light)]",
    iconColor: "var(--color-brand-primary)",
    badge: {
      text: "↑ 8%",
      className:
        "bg-[var(--color-badge-success-bg)] text-[var(--color-badge-success-text)]",
    },
    label: "MESSAGES TODAY",
    value: "47",
    dot: false,
  },
  {
    id: "alerts",
    iconKey: "bell",
    iconBgClass: "bg-[var(--color-brand-alert-light)]",
    iconColor: "var(--color-brand-alert)",
    badge: {
      text: "Active",
      className:
        "bg-[var(--color-brand-alert-light)] text-[var(--color-brand-alert)]",
    },
    label: "ALERTS SENT",
    value: "6",
    dot: false,
  },
  {
    id: "replies",
    iconKey: "flag",
    iconBgClass: "bg-[var(--color-danger-bg)]",
    iconColor: "var(--color-danger-dot)",
    badge: null,
    label: "UNREAD REPLIES",
    value: "14",
    dot: true,
  },
] as const;

// ── Activity feed ─────────────────────────────────────────────────────────────
// avatarBgClass / badge.className are Tailwind utility strings
export const ACTIVITY_ITEMS = [
  {
    id: 1,
    avatarBgClass: "bg-[var(--color-brand-primary-light)]",
    avatarIconKey: "person",
    avatarIconColor: "var(--color-brand-primary)",
    name: "Priya Verma",
    action: " joined the room",
    time: "2 minutes ago",
    badge: {
      text: "MEMBER",
      className:
        "bg-[var(--color-brand-primary-light)] text-[var(--color-brand-primary)]",
    },
  },
  {
    id: 2,
    avatarBgClass: "bg-[var(--color-brand-alert-light)]",
    avatarIconKey: "campaign",
    avatarIconColor: "var(--color-brand-alert)",
    name: "Stock Alert sent",
    action: ' for "Embroidered Silk Saree"',
    time: "45 minutes ago",
    badge: {
      text: "ALERT",
      className:
        "bg-[var(--color-brand-alert-light)] text-[var(--color-brand-alert)]",
    },
  },
  {
    id: 3,
    avatarBgClass: "bg-[var(--color-avatar-indigo-bg)]",
    avatarIconKey: "person",
    avatarIconColor: "var(--color-avatar-indigo)",
    name: "Rahul Mehta",
    action: " replied to your broadcast",
    time: "1 hour ago",
    badge: {
      text: "MESSAGE",
      className:
        "bg-[var(--color-badge-neutral-bg)] text-[var(--color-badge-neutral-text)]",
    },
  },
  {
    id: 4,
    avatarBgClass: "bg-[var(--color-avatar-pink-bg)]",
    avatarIconKey: "person",
    avatarIconColor: "var(--color-avatar-pink-dark)",
    name: "Anjali K.",
    action: " shared the room link",
    time: "2 hours ago",
    badge: {
      text: "SOCIAL",
      className:
        "bg-[var(--color-badge-blue-bg)] text-[var(--color-badge-blue-text)]",
    },
  },
] as const;

// ── Members table ─────────────────────────────────────────────────────────────
export const MEMBERS = [
  {
    id: 1,
    name: "Ishita Patel",
    email: "ishita.p@email.com",
    avatarBgClass: "bg-[var(--color-brand-primary-light)]",
    joined: "Oct 12, 2023",
    lastSeen: "Online Now",
    online: true,
    notifOn: true,
  },
  {
    id: 2,
    name: "Vikram Singh",
    email: "vikram_s@mail.in",
    avatarBgClass: "bg-[var(--color-brand-alert-light)]",
    joined: "Oct 14, 2023",
    lastSeen: "2 hours ago",
    online: false,
    notifOn: true,
  },
  {
    id: 3,
    name: "Zoya Khan",
    email: "zoyakhan@web.com",
    avatarBgClass: "bg-[var(--color-avatar-pink-bg)]",
    joined: "Oct 15, 2023",
    lastSeen: "Yesterday",
    online: false,
    notifOn: false,
  },
] as const;
