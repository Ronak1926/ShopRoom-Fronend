/** The public address of the web app, without a trailing slash. */
export const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL?.trim() || "https://countercircle.com").replace(/\/+$/, "");

export const SITE_NAME = "CounterCircle";

export const SITE_TAGLINE = "Bring your shop closer to your customers";

export const SITE_DESCRIPTION =
  "Open a room for your shop, invite customers with a link, chat with them, and send animated notifications about new arrivals, offers and restocks.";

/** Pages worth showing in search results, with how often they change. */
export const PUBLIC_PAGES: { path: string; changeFrequency: "weekly" | "monthly" | "yearly"; priority: number }[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/help", changeFrequency: "monthly", priority: 0.7 },
  { path: "/about", changeFrequency: "yearly", priority: 0.6 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.5 },
  { path: "/security", changeFrequency: "yearly", priority: 0.5 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/pricing", changeFrequency: "monthly", priority: 0.7 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/refund-policy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/community-guidelines", changeFrequency: "yearly", priority: 0.2 },
  { path: "/cookies", changeFrequency: "yearly", priority: 0.2 },
];
