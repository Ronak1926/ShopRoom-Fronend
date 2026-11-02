import type { Metadata } from "next";
import Link from "next/link";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import PublicPage from "@/components/public/PublicPage";

export const metadata: Metadata = {
  title: "About ShopRoom",
  description: "ShopRoom brings local shops and the people who shop there closer together.",
  alternates: { canonical: "/about" },
};

const PILLARS = [
  {
    icon: StorefrontOutlinedIcon,
    title: "A room for every shop",
    text: "Each shop gets its own room with a link it can share anywhere. Customers join the rooms of the shops they actually use.",
  },
  {
    icon: ForumOutlinedIcon,
    title: "A direct line",
    text: "Members chat with the shop in real time: ask if something is in stock, say what you are looking for, get an answer from the person behind the counter.",
  },
  {
    icon: NotificationsActiveOutlinedIcon,
    title: "Notifications that stand out",
    text: "Shops design animated banners (a new arrival, a restock, a weekend offer) and send them to their members or to people nearby, with real delivery and open numbers afterwards.",
  },
];

export default function AboutPage() {
  return (
    <PublicPage>
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="text-[32px] font-extrabold tracking-[-0.8px] text-(--color-text-primary) sm:text-[44px]">Local shops, closer to their customers.</h1>
        <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-(--color-text-secondary)">
          Most neighbourhood shops have loyal customers and no good way to reach them: a message gets lost in a group chat, a flyer gets thrown away. ShopRoom gives
          every shop a place of its own, and gives customers a simple way to hear from the shops they care about, and only those.
        </p>

        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {PILLARS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-(--color-brand-primary-light) text-(--color-brand-primary)">
                <Icon />
              </span>
              <h2 className="mt-4 text-[17px] font-bold text-(--color-text-primary)">{title}</h2>
              <p className="mt-2 text-[14px] leading-relaxed text-(--color-text-secondary)">{text}</p>
            </li>
          ))}
        </ul>

        <section className="mt-14 rounded-2xl bg-(--color-brand-primary-light) p-8">
          <h2 className="text-[22px] font-bold text-(--color-text-primary)">How we think about it</h2>
          <ul className="mt-4 flex list-disc flex-col gap-2 pl-5 text-[15px] leading-relaxed text-(--color-text-secondary)">
            <li>Customers choose which shops to hear from, and can turn any of them off.</li>
            <li>Shops pay for a plan, and customers use ShopRoom free. There are no ads and we do not sell personal data.</li>
            <li>Location is optional, and used only to show nearby shops.</li>
          </ul>
        </section>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/shopkeeper/signup" className="flex h-12 items-center rounded-lg bg-(--color-brand-primary) px-6 text-[15px] font-semibold text-white transition-colors hover:bg-(--color-brand-primary-hover)">
            Open your shop&apos;s room
          </Link>
          <Link href="/customer/signup" className="flex h-12 items-center rounded-lg border border-(--color-border-default) px-6 text-[15px] font-semibold text-(--color-text-primary) transition-colors hover:bg-(--color-bg-surface-hover)">
            Join as a customer
          </Link>
        </div>
      </div>
    </PublicPage>
  );
}
