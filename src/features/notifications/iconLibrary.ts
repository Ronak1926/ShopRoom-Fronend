/**
 * features/notifications/iconLibrary.ts — Categorised icon set for the Icons
 * tool. Every entry's `name` is a key in ICON_REGISTRY (icons.tsx), so what the
 * panel shows and what the canvas renders are the same component — the design
 * JSON only ever stores the name.
 */

export interface IconGroup {
  id: string;
  label: string;
  /** [registryName, human label] — the label is what search matches on. */
  icons: { name: string; label: string }[];
}

const g = (name: string, label: string) => ({ name, label });

export const ICON_GROUPS: IconGroup[] = [
  {
    id: "general",
    label: "General",
    icons: [
      g("Home", "Home"), g("Person", "User"), g("Settings", "Settings"), g("Notifications", "Bell"),
      g("Star", "Star"), g("Favorite", "Heart"), g("Bookmark", "Bookmark"), g("AccessTime", "Clock"),
      g("CheckCircleOutlined", "Check"), g("Close", "Close"), g("Info", "Info"), g("Help", "Help"),
      g("Delete", "Trash"), g("Lock", "Lock"), g("LockOpen", "Unlock"), g("Visibility", "Eye"),
      g("VisibilityOff", "Hide"), g("Mail", "Mail"), g("Phone", "Phone"), g("LocationOn", "Location"),
      g("CalendarMonth", "Calendar"), g("Language", "Globe"), g("Warning", "Warning"), g("Verified", "Verified"),
    ],
  },
  {
    id: "ui",
    label: "UI Essentials",
    icons: [
      g("Menu", "Menu"), g("Add", "Plus"), g("Remove", "Minus"), g("GridView", "Grid"),
      g("Search", "Search"), g("ArrowForward", "Arrow Right"), g("ArrowBack", "Arrow Left"),
      g("ArrowUpward", "Arrow Up"), g("ArrowDownward", "Arrow Down"), g("ChevronRight", "Chevron"),
      g("MoreHoriz", "More"), g("Refresh", "Refresh"), g("Share", "Share"), g("Edit", "Edit"),
      g("FilterList", "Filter"), g("Download", "Download"), g("PlayArrow", "Play"), g("Pause", "Pause"),
      g("VolumeUp", "Volume"), g("Analytics", "Analytics"), g("Tune", "Tune"), g("Autorenew", "Sync"),
    ],
  },
  {
    id: "social",
    label: "Social",
    icons: [
      g("Facebook", "Facebook"), g("Instagram", "Instagram"), g("Twitter", "Twitter"), g("YouTube", "YouTube"),
      g("LinkedIn", "LinkedIn"), g("WhatsApp", "WhatsApp"), g("Telegram", "Telegram"),
      g("Pinterest", "Pinterest"), g("Reddit", "Reddit"), g("Share", "Share"), g("ThumbUp", "Like"),
      g("Campaign", "Announce"),
    ],
  },
  {
    id: "ecommerce",
    label: "Ecommerce",
    icons: [
      g("ShoppingCart", "Cart"), g("ShoppingBag", "Shopping Bag"), g("LocalMall", "Mall Bag"),
      g("LocalOffer", "Tag"), g("Sell", "Price Tag"), g("Discount", "Discount"), g("Percent", "Percent"),
      g("CreditCard", "Card"), g("AccountBalanceWallet", "Wallet"), g("CardGiftcard", "Gift"),
      g("Redeem", "Redeem"), g("LocalShipping", "Truck"), g("Receipt", "Receipt"), g("QrCode", "QR Code"),
      g("Storefront", "Store"), g("Inventory2", "Inventory"), g("RemoveShoppingCart", "Remove Cart"),
      g("Checkroom", "Apparel"),
    ],
  },
  {
    id: "marketing",
    label: "Marketing",
    icons: [
      g("Bolt", "Bolt"), g("FlashOn", "Flash"), g("Whatshot", "Hot"), g("LocalFireDepartment", "Fire"),
      g("AutoAwesome", "Sparkle"), g("Celebration", "Celebrate"), g("EmojiEvents", "Trophy"),
      g("WorkspacePremium", "Premium"), g("Diamond", "Diamond"), g("NewReleases", "New"),
      g("FiberNew", "New Badge"), g("TrendingUp", "Trending"), g("RocketLaunch", "Launch"),
      g("Schedule", "Timer"), g("HourglassBottom", "Hourglass"), g("Shield", "Shield"),
    ],
  },
];

/** Chip order in the panel — "All" is prepended by the component. */
export const ICON_CATEGORIES = ICON_GROUPS.map((group) => ({ id: group.id, label: group.label }));

export const ALL_ICONS = ICON_GROUPS.flatMap((group) =>
  group.icons.map((icon) => ({ ...icon, groupId: group.id })),
);

/** Human label for a registry name, for the inspector's "Selected Icon" card. */
export function iconLabel(name?: string): string {
  if (!name) return "None";
  return ALL_ICONS.find((i) => i.name === name)?.label ?? name;
}
