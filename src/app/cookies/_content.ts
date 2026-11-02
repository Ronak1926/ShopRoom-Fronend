import type { LegalContent } from "@/components/public/LegalDocument";

export const COOKIES: LegalContent = {
  title: "Cookie Policy",
  updated: "2 November 2026",
  intro:
    "ShopRoom keeps a small amount of information in your browser so that you stay signed in and the app remembers how you like it. We do not use advertising cookies or third-party analytics or tracking scripts.",
  sections: [
    {
      heading: "Cookies we set",
      bullets: [
        "Your sign-in session (named token for customers, shopkeeper_token for shopkeepers). It proves who you are to our servers and lasts up to 7 days, or until you sign out. Without it you could not use your account.",
      ],
    },
    {
      heading: "Other information stored in your browser",
      paragraphs: ["Your browser's local storage and session storage hold things that make the app convenient. None of it is used to track you."],
      bullets: [
        "Layout choices, such as whether the sidebar is collapsed.",
        "Your notification preferences (as a fast-loading copy of the ones saved to your account), and the design you were last editing in the Studio.",
        "A sign-up in progress, so you can continue after a refresh.",
        "For customers who allow it, the time location was last shared.",
        "If you turn on notifications: a service worker and the push token your browser gives ShopRoom, so notifications can reach you.",
      ],
    },
    {
      heading: "Cookies from services you choose to use",
      bullets: [
        "Razorpay, when a shopkeeper pays for a plan: Razorpay's payment window may set its own cookies to process the payment and prevent fraud.",
        "Google, when you choose to continue with Google: Google may set cookies to complete the sign-in.",
      ],
      paragraphs: ["These are controlled by those companies under their own policies."],
    },
    {
      heading: "Your choices",
      bullets: [
        "You can clear cookies and site data in your browser at any time. You will be signed out and the preferences above will reset.",
        "You can block cookies, but ShopRoom needs the sign-in cookie to work.",
        "You can turn notifications off in Settings, and in your browser's site settings.",
      ],
    },
  ],
};
