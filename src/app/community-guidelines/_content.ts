import type { LegalContent } from "@/components/public/LegalDocument";

export const COMMUNITY_GUIDELINES: LegalContent = {
  title: "Community Guidelines",
  updated: "19 November 2026",
  intro:
    "ShopRoom works because people trust the rooms they join. These guidelines say what is and is not acceptable for customers and shopkeepers. They explain our Terms of Service in plain words; if the two ever differ, the Terms apply.",
  sections: [
    {
      heading: "For everyone",
      bullets: [
        "Be honest about who you are. Do not pretend to be another person, shop or business.",
        "Be respectful. No harassment, threats, hate, or abuse, in chat or in notifications.",
        "Do not post anything illegal, or anything you do not have the right to share.",
        "Do not try to break, overload or get around ShopRoom's security, or to reach another person's data.",
      ],
    },
    {
      heading: "For shopkeepers",
      bullets: [
        "Send notifications that are relevant to your shop: new arrivals, restocks, offers, opening hours. Do not use your room for unrelated messages.",
        "Do not send spam, repeated near-identical messages, or misleading offers. Say what the offer really is.",
        "Only message people who joined your room, or who are nearby as you chose. Customers can turn your notifications off at any time, and you should respect that.",
        "Do not collect your customers' personal details for another purpose, or share them with anyone else.",
        "You are responsible for the images, designs and messages you send, and for having the right to use them.",
      ],
    },
    {
      heading: "For customers",
      bullets: [
        "Use rooms for talking to the shop. Do not use a room to advertise something else.",
        "Do not share another member's name or details outside the room.",
        "Leave a room, or turn its notifications off, whenever you want.",
      ],
    },
    {
      heading: "Reporting a problem",
      paragraphs: [
        "If a room, message or notification breaks these guidelines, or you think an account has been taken over, tell us through the contact page with a short description and, if you can, what you saw. We read every report.",
      ],
    },
    {
      heading: "What we may do",
      paragraphs: [
        "We may remove content, pause notification sending, suspend a room or end an account that breaks these guidelines or puts others at risk. For serious or repeated breaches this can happen without warning, and ending an account for a breach does not entitle you to a refund. If you think we got it wrong, write to us and we will look again.",
      ],
    },
  ],
};
