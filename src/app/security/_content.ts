import type { LegalContent } from "@/components/public/LegalDocument";

export const SECURITY: LegalContent = {
  title: "Security",
  updated: "2 November 2026",
  intro:
    "Shops and customers trust ShopRoom with accounts, conversations and payments. Here is how we protect them, and what you can do to help.",
  sections: [
    {
      heading: "How we protect your account",
      bullets: [
        "Passwords are stored only as salted, one-way hashes, never as the password itself.",
        "Sign-in, sign-up, verification codes, password resets and payments are rate limited to slow down guessing and abuse.",
        "We can sign an account out of every device at once. Changing your password does this automatically, and you can do it yourself from Settings.",
        "Password-reset links work once and expire after 30 minutes.",
      ],
    },
    {
      heading: "How we protect your data",
      bullets: [
        "Everything travels over HTTPS.",
        "Chat messages are encrypted at rest.",
        "Every request is checked against the signed-in account, so one shop or customer can never read another's data.",
        "We store the minimum we need, and erase it when you delete your account. See the Privacy Policy for how long each kind of data is kept.",
      ],
    },
    {
      heading: "Payments",
      paragraphs: [
        "Plan payments are handled by Razorpay. Your card, UPI or bank details never reach ShopRoom. Before a plan is activated we verify Razorpay's signature and check that the payment was for that shop and the right amount, and each payment can be used only once.",
      ],
    },
    {
      heading: "What you can do",
      bullets: [
        "Use a strong password that you do not use anywhere else.",
        "Sign out on shared computers, or use Sign out everywhere in Settings if you lose a device.",
        "Be careful with links in emails. ShopRoom will never ask for your password by email.",
        "Keep your browser up to date.",
      ],
    },
    {
      heading: "Reporting a problem",
      paragraphs: [
        "If you think you have found a security problem in ShopRoom, please tell us through the contact page with enough detail to reproduce it, and give us reasonable time to fix it before sharing it publicly. We take every report seriously.",
      ],
    },
  ],
};
