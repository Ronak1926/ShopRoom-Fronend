import { PLAN_OFFERS } from "@/features/billing/plans";

export type QA = { question: string; answer: string };

const PRICES = PLAN_OFFERS.map((p) => `${p.label} ₹${p.price}`).join(", ");

/** Shown in the landing FAQ and published as FAQPage structured data, so they must stay true. */
export const FAQS: QA[] = [
  {
    question: "What is ShopRoom?",
    answer:
      "ShopRoom lets a local shopkeeper open a room for their shop, invite customers with a link, chat with them, and send animated notifications about new arrivals, offers and restocks.",
  },
  {
    question: "How much does it cost?",
    answer: `It is free for customers. Shopkeepers pay once for a plan: ${PRICES}. There is no automatic renewal.`,
  },
  {
    question: "Do my customers need to download an app?",
    answer:
      "No. Customers join your room from a link in their browser. If they allow notifications, they receive your updates there too.",
  },
  {
    question: "How do customers receive updates?",
    answer:
      "As push notifications on their phone or computer, and in the notification bell inside ShopRoom, where they can watch a banner again whenever they like.",
  },
  {
    question: "Can I use ShopRoom for any type of business?",
    answer:
      "Yes. Fashion, groceries, electronics, books, beauty and more: it works for any shop that wants to stay in touch with the people who shop there.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Passwords are stored as salted hashes, chat messages are encrypted at rest, and card details never reach us because payments run through Razorpay. You can delete your account at any time. The Security and Privacy pages explain the details.",
  },
  {
    question: "What happens when my plan ends?",
    answer:
      "Sending and scheduling notifications pause, and everything else is kept: your room, members, chat and designs. Renew from Billing at any time and the new time is added to the end of your plan.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "No. The 1 Month plan is the cheapest way to try ShopRoom, and customers can join and use ShopRoom for free.",
  },
];
