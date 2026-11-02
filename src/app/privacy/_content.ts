import type { LegalContent } from "@/components/public/LegalDocument";

export const PRIVACY: LegalContent = {
  title: "Privacy Policy",
  updated: "2 November 2026",
  intro:
    "ShopRoom connects customers with the local shops they like: customers join a shop's room, chat with the shop, and get its notifications. This policy explains what we collect when you use ShopRoom, why, who can see it, and how you stay in control of it.",
  sections: [
    {
      heading: "What we collect",
      paragraphs: ["What we hold depends on how you use ShopRoom."],
      bullets: [
        "Customers: your name, email address and a one-way hash of your password (we never store the password itself); the rooms you have joined and whether notifications are on for each; your messages in those rooms; and, only if you allow it, your location.",
        "Customers who turn on notifications: a push token for your browser or device, the type of browser, and what happened to each notification sent to you (delivered, opened, tapped).",
        "Shopkeepers: your email, name and a password hash; your shop's name, category, description, address, city, state, pincode, phone number, location and logo; your plan and payment records (plan, amount, and Razorpay order and payment identifiers); and the notification designs, images, schedules, preferences and send history you create.",
        "Visitors: the email address you give us to subscribe to the newsletter, and anything you write in the contact form.",
        "Everyone: technical logs (such as the time and path of a request and error details) that we use to keep the service running and secure.",
      ],
    },
    {
      heading: "What we never see",
      paragraphs: [
        "Card, UPI and bank details are entered into Razorpay's payment window and go straight to Razorpay. ShopRoom never receives or stores them. We keep only the identifiers Razorpay gives us so we can match a payment to an account.",
      ],
    },
    {
      heading: "How we use it",
      bullets: [
        "To create and secure your account, and to sign you in.",
        "To run rooms: showing shops near you, letting you join them, and delivering chat messages.",
        "To deliver the notifications a shop sends to its members, and to tell the shop in aggregate how they performed (how many were delivered, opened and tapped).",
        "To take payment for shop plans and keep a record of it.",
        "To send you emails you need: verification codes, password-reset links and replies to messages you send us.",
        "To detect abuse, fix problems and keep the service secure.",
      ],
      paragraphs: ["We do not sell your personal data and we do not show advertising."],
    },
    {
      heading: "Who can see what",
      bullets: [
        "A shopkeeper can see the name, email address, join date and notification setting of every customer in their room, and the aggregate results of the notifications they send.",
        "Other members of a room can see your name, when you joined and, if you have shared your location, roughly how far you are from the shop. They never see your exact position.",
        "Your messages in a room are visible to that room's members and its shopkeeper. They are stored encrypted.",
        "Nobody else sees your password hash, push token or location.",
      ],
    },
    {
      heading: "Location",
      paragraphs: [
        "Location is optional and off unless you turn it on. When it is on, we use it to show shops near you and so shops can reach people nearby. You can switch it off at any time in your profile: your stored position is erased immediately. We also erase a stored position automatically 30 days after it was last updated.",
      ],
    },
    {
      heading: "Services that help us run ShopRoom",
      paragraphs: ["We share only what each service needs to do its job."],
      bullets: [
        "Razorpay: processes plan payments.",
        "Twilio: verifies shopkeepers' phone numbers by sending a one-time code.",
        "Google and Firebase: sign-in with Google, and delivery of push notifications.",
        "Cloudinary: stores and serves shop images and notification images.",
        "An email provider: sends verification codes, password-reset links and replies to contact messages.",
        "Pexels and Unsplash: stock-image search for shopkeepers. They receive only the search words typed.",
      ],
    },
    {
      heading: "How long we keep it",
      bullets: [
        "Account details, rooms, messages and notification history: until you delete your account.",
        "Verification codes: removed a day after they expire. Password-reset links: valid for 30 minutes and removed a day after they expire.",
        "Per-device delivery records for notifications: 180 days. The shop keeps only the aggregate counts afterwards.",
        "Push tokens: until you turn notifications off or sign out, 270 days without use, or when the push service reports them invalid.",
        "Payment records (identifiers, plan and amount): while the account exists, and longer where the law requires us to keep financial records.",
        "Newsletter email addresses: until you ask us to remove you.",
      ],
    },
    {
      heading: "Your choices and rights",
      bullets: [
        "Delete your account: from your profile page. Your account and its data are erased together. For a shopkeeper this includes the shop, its room, chat history, designs and send history.",
        "Change your location setting or your notification setting at any time.",
        "Change your password, or sign out of every device, from Settings.",
        "Ask for a copy of your data, or for a correction or removal, through the contact page. We answer these by hand.",
      ],
    },
    {
      heading: "How we protect it",
      paragraphs: [
        "Passwords are stored as salted hashes. Chat messages are encrypted at rest. Connections use HTTPS. Sign-in and other sensitive actions are rate limited, and we can sign every device out of an account at once. No system is perfectly secure, so please use a password you do not use elsewhere. See our Security page for more.",
      ],
    },
    {
      heading: "Children",
      paragraphs: ["ShopRoom is not directed at children, and we do not knowingly collect their personal data. If you believe a child has given us theirs, contact us and we will remove it."],
    },
    {
      heading: "Changes to this policy",
      paragraphs: ["If we change how we handle personal data we will update this page and its date, and tell account holders by email when the change is significant."],
    },
  ],
};
