import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import type { ComponentType } from "react";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import Reveal from "./Reveal";

type Step = {
  number: string;
  Icon: ComponentType<SvgIconProps>;
  title: string;
  description: string;
};

const steps: Step[] = [
  {
    number: "01",
    Icon: StorefrontOutlinedIcon,
    title: "Shopkeeper opens a Room",
    description:
      "Sign up, fill in your shop details, and your Room goes live in minutes. Your invite link is ready to share instantly.",
  },
  {
    number: "02",
    Icon: PeopleOutlinedIcon,
    title: "Customers join via link",
    description:
      "Share your Room link on WhatsApp, Instagram, or anywhere. Customers join in one tap — no app download required.",
  },
  {
    number: "03",
    Icon: NotificationsActiveOutlinedIcon,
    title: "Send alerts, drive footfall",
    description:
      "Post stock alerts that hit every member instantly. Flash, Spotlight, or Standard — your style, your brand.",
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="w-full bg-(--color-bg-surface) py-24 px-6"
    >
      <div className="max-w-[1100px] mx-auto">
        {/* Header */}
        <Reveal className="text-center mb-20">
          <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-(--color-brand-primary) mb-3">
            How it works
          </p>
          <h2 className="font-display text-[clamp(30px,4vw,44px)] font-semibold text-(--color-text-primary) tracking-tight">
            Live in three steps.
          </h2>
        </Reveal>

        {/* Steps — connected line on desktop */}
        <Reveal delay={0.15} className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Connector line */}
          <div className="hidden md:block absolute top-7 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-(--color-brand-primary-muted) via-(--color-brand-primary) to-(--color-brand-primary-muted) opacity-30" />

          {steps.map(({ number, Icon, title, description }) => (
            <div
              key={number}
              className="flex flex-col gap-6 items-center md:items-start text-center md:text-left"
            >
              {/* Step number + icon circle */}
              <div className="relative flex flex-col items-center">
                <div className="w-14 h-14 rounded-full border-2 border-(--color-brand-primary-muted) bg-(--color-brand-primary-light) flex items-center justify-center shrink-0 z-10">
                  <Icon
                    sx={{ fontSize: 24, color: "var(--color-brand-primary)" }}
                  />
                </div>
                <span className="mt-3 text-[11px] font-bold tracking-[0.12em] text-(--color-brand-primary-muted) uppercase">
                  Step {number}
                </span>
              </div>

              <div>
                <h3 className="text-[18px] font-bold text-(--color-text-primary) mb-2.5 leading-snug">
                  {title}
                </h3>
                <p className="text-[14px] text-(--color-text-secondary) leading-[1.7]">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
