import type { LegalContent } from "@/components/public/LegalDocument";

export const TERMS: LegalContent = {
  title: "Terms of Service",
  updated: "6 November 2026",
  intro:
    "These terms are the agreement between you and ShopRoom when you use our website and apps, as a customer or as a shopkeeper. By creating an account or using ShopRoom you agree to them. If you do not agree, please do not use ShopRoom.",
  sections: [
    {
      heading: "What ShopRoom is",
      paragraphs: [
        "ShopRoom lets shopkeepers open a room for their shop, and lets customers join those rooms to chat with the shop and receive its notifications. ShopRoom is a platform: we are not a party to any sale between a shop and a customer.",
      ],
    },
    {
      heading: "Your account",
      bullets: [
        "Give accurate information and keep it up to date.",
        "You are responsible for what happens under your account, so keep your password to yourself and use Settings to sign out of other devices if you lose one.",
        "One person per account. You must be able to enter into a binding agreement to use ShopRoom.",
        "Tell us promptly if you think someone else has used your account.",
      ],
    },
    {
      heading: "Using ShopRoom fairly",
      paragraphs: ["Whether you are a customer or a shopkeeper, you agree not to:"],
      bullets: [
        "break the law, or post anything unlawful, threatening, abusive, hateful or deceptive;",
        "send spam, or messages and notifications that are unrelated to the shop they come from;",
        "impersonate another person or shop, or mislead people about who you are;",
        "upload content you do not have the right to use;",
        "try to break, overload, scrape or get around the security of ShopRoom, or access another person's data.",
      ],
    },
    {
      heading: "Shopkeepers: plans and payment",
      bullets: [
        "A shop needs an active plan to send or schedule notifications. Plans are sold for 1, 2 or 3 months at the prices shown when you pay.",
        "Each plan is a one-time payment made through Razorpay. Plans do not renew automatically.",
        "When a plan ends, sending and scheduling notifications is paused. Your room, members, chat and designs are kept, and everything resumes when you renew.",
        "When you renew early, the new time is added to the end of your current plan.",
        "Payments are not refunded, except where the law requires it. The exception we apply ourselves: if a payment cannot be turned into what you paid for (for example, someone registered your email address while you were paying, or the same plan was paid for twice), we refund it in full to the original payment method automatically. Your bank may take 5 to 7 working days to show it. If you think you were charged by mistake, contact us with your payment details.",
        "We email a receipt for each payment to the address on your account. It is a payment receipt, not a tax invoice.",
        "Daily sending limits and plan features are described in the product and may change; we will not reduce what you have already paid for during your plan.",
      ],
    },
    {
      heading: "Shopkeepers: your notifications and content",
      bullets: [
        "You are responsible for the notifications, designs, images and messages you create and send, and for having the rights to use them.",
        "Send notifications only to people who joined your room or who are nearby as you chose, and keep them relevant. Customers can turn your notifications off at any time.",
        "You must not use ShopRoom to collect customers' personal data for another purpose, or to share their details with others.",
      ],
    },
    {
      heading: "Your content",
      paragraphs: [
        "You keep ownership of what you create and post. You give ShopRoom permission to store, display and deliver it so that the service works, for example showing your shop's notification to your members. We may remove content that breaks these terms.",
      ],
    },
    {
      heading: "Privacy",
      paragraphs: ["How we handle personal data is explained in our Privacy Policy, which forms part of these terms."],
    },
    {
      heading: "Availability and changes",
      paragraphs: [
        "We work to keep ShopRoom available but cannot promise it will be uninterrupted or error free. Push notifications also depend on third parties (browsers, operating systems and push services), so we cannot guarantee a notification is delivered or shown. We may change or retire features, and will give notice of changes that significantly affect a paid plan.",
      ],
    },
    {
      heading: "Ending your use",
      paragraphs: [
        "You can stop using ShopRoom at any time, and delete your account from your profile page. We may suspend or end an account that breaks these terms or puts others or the service at risk. Ending an account does not entitle you to a refund of a plan.",
      ],
    },
    {
      heading: "Our responsibility",
      paragraphs: [
        "ShopRoom is provided as it is. To the extent the law allows, we are not liable for indirect or consequential losses, for lost profits or sales, or for anything that happens between a shop and a customer. Nothing in these terms limits liability that cannot be limited by law.",
      ],
    },
    {
      heading: "Changes to these terms",
      paragraphs: ["We may update these terms. We will change the date above, and tell account holders by email when a change is significant. Using ShopRoom after a change means you accept it."],
    },
  ],
};
