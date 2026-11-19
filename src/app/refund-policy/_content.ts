import type { LegalContent } from "@/components/public/LegalDocument";

export const REFUND_POLICY: LegalContent = {
  title: "Cancellation and Refund Policy",
  updated: "19 November 2026",
  intro:
    "This page explains how paying for a ShopRoom plan works, what happens if you stop, and when your money is returned. It is part of our Terms of Service. Customers use ShopRoom free of charge, so this policy is about the plans shopkeepers buy.",
  sections: [
    {
      heading: "What you are paying for",
      bullets: [
        "A plan is a one-time, prepaid payment for 1, 2 or 3 months of ShopRoom for your shop. The price is shown before you pay, in Indian rupees.",
        "Plans do not renew automatically. We never charge you again unless you choose to buy another plan yourself.",
        "ShopRoom is a digital service. Your plan starts as soon as your payment is confirmed, and nothing is shipped.",
      ],
    },
    {
      heading: "Cancelling",
      paragraphs: [
        "There is no subscription to cancel, because nothing renews. You can stop using ShopRoom whenever you like and your plan simply runs out on its end date. You can also delete your account from your profile page at any time.",
        "Cancelling or deleting your account does not return the money for the part of a plan you have not used.",
      ],
    },
    {
      heading: "When your payment is refunded automatically",
      paragraphs: ["Sometimes a payment goes through but we cannot turn it into a plan. In these cases we return the full amount to the original payment method without you needing to ask:"],
      bullets: [
        "someone registered the same email address while you were paying, so your account could not be created;",
        "your sign-up session expired or was removed before the payment was confirmed;",
        "the same plan was paid for twice, so the second payment has nothing to buy.",
      ],
    },
    {
      heading: "Other refunds",
      bullets: [
        "If you were charged more than once, or an amount different from the price you were shown, contact us and we will correct it.",
        "If the law requires a refund, we give one.",
        "Apart from the cases above, a payment is not refunded once your plan has started. If something went wrong with the service itself, tell us: we look at each case and may return all or part of the payment at our discretion.",
      ],
    },
    {
      heading: "If a refund is given for a plan that has started",
      paragraphs: [
        "The days that payment added to your plan are taken off it, and the payment is marked as refunded in your billing history. Your account, room and data stay, so you can buy a plan again whenever you like.",
      ],
    },
    {
      heading: "How long a refund takes",
      paragraphs: [
        "We send the refund to the same card, UPI account or bank you paid from. Once we have sent it, your bank or card issuer usually shows it within 5 to 7 working days, and sometimes longer. We cannot speed up a bank's own processing.",
      ],
    },
    {
      heading: "If money left your account but nothing happened",
      paragraphs: [
        "Do not pay a second time. If you closed the page or lost your connection after paying, your plan is applied automatically a short while later and you will see it in your billing history. If it does not appear within a day, contact us with the payment reference shown on the payment screen or in your bank message, and we will either apply the plan or refund you.",
      ],
    },
    {
      heading: "Asking for a refund",
      paragraphs: [
        "Use our contact page and include the email address on your account, the payment reference (it starts with pay_) and a line about what happened. We reply by email. Please do not ask your bank to reverse a payment before writing to us, because a reversal can lock the account while it is looked at.",
      ],
    },
  ],
};
