"use client";

import { m } from "framer-motion";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { SPRING, VIEWPORT } from "./motion";
import SectionHeader from "./ui/SectionHeader";
import AnimatedButton from "./ui/AnimatedButton";
import { COMMON_PERKS, PLAN_OFFERS } from "@/features/billing/plans";

type Plan = {
  name: string;
  price: string;
  period: string;
  tagline: string;
  features: string[];
  cta: string;
  href: string;
  popular?: boolean;
};

const CUSTOMER_PLAN: Plan = {
  name: "Customers",
  price: "₹0",
  period: "/forever",
  tagline: "Free for everyone who shops",
  features: ["Discover local shops", "Join as many rooms as you like", "Chat with shopkeepers", "Get notifications from the shops you join"],
  cta: "Get Started",
  href: "/customer/signup",
};

// Built from the same catalog checkout uses, so the page can never advertise a price that is not charged.
const PLANS: Plan[] = [
  CUSTOMER_PLAN,
  ...PLAN_OFFERS.map((offer) => ({
    name: offer.label,
    price: `₹${offer.price}`,
    period: "one-time",
    tagline: offer.description,
    features: [...offer.perks, ...(offer.id === "1m" ? COMMON_PERKS : ["Everything in the shorter plans"])],
    cta: `Choose ${offer.label}`,
    href: "/shopkeeper/signup",
    popular: offer.recommended,
  })),
];

export default function Pricing() {
  return (
    <section id="pricing" className="w-full bg-(--color-bg-surface) py-24 px-6">
      <div className="max-w-[1240px] mx-auto">
        <SectionHeader
          title="Simple, transparent pricing"
          subtitle="Free for customers. Shopkeepers pay once for the length of plan they need."
          className="mb-14"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {PLANS.map((plan, i) => (
            <m.article
              key={plan.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ ...SPRING, delay: i * 0.08 }}
              whileHover={{ y: -8 }}
              className={`relative flex flex-col p-7 rounded-3xl bg-(--color-bg-surface) transition-shadow duration-200 ${
                plan.popular
                  ? "border-2 border-(--color-brand-primary) shadow-(--shadow-lg) lg:-translate-y-4"
                  : "border border-(--color-border-default) shadow-(--shadow-xs) hover:shadow-(--shadow-md)"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 h-6 px-3 flex items-center rounded-full bg-(--color-brand-primary) text-[11px] font-bold uppercase tracking-wide text-(--color-text-on-brand)">
                  Most Popular
                </span>
              )}

              <p className="text-[18px] font-bold text-(--color-text-primary)">
                {plan.name}
              </p>
              <p className="text-[13px] text-(--color-text-hint) mt-1">
                {plan.tagline}
              </p>

              <div className="flex items-end gap-1 mt-5 mb-7">
                <span className="text-[36px] font-extrabold text-(--color-brand-primary) leading-none">
                  {plan.price}
                </span>
                <span className="text-[13px] text-(--color-text-hint) mb-1">
                  {plan.period}
                </span>
              </div>

              <ul className="flex flex-col gap-3.5 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-(--color-brand-primary-light) shrink-0">
                      <CheckRoundedIcon
                        sx={{ fontSize: 13, color: "var(--color-brand-primary)" }}
                      />
                    </span>
                    <span className="text-[14px] text-(--color-text-secondary)">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <AnimatedButton
                href={plan.href}
                variant={plan.popular ? "primary" : "outline"}
                className="mt-auto w-full"
              >
                {plan.cta}
              </AnimatedButton>
            </m.article>
          ))}
        </div>

        <p className="text-center text-[13px] text-(--color-text-hint) mt-10">
          One-time payment through Razorpay · No automatic renewal · Renew whenever you like
        </p>
      </div>
    </section>
  );
}
