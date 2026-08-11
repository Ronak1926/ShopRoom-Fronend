"use client";

import { motion } from "framer-motion";
import type { ComponentType } from "react";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { fadeUp, staggerContainer, VIEWPORT } from "./motion";
import SectionHeader from "./ui/SectionHeader";

type Step = {
  number: string;
  Icon: ComponentType<SvgIconProps>;
  title: string;
  description: string;
};

const STEPS: Step[] = [
  {
    number: "1",
    Icon: StorefrontRoundedIcon,
    title: "Create Your Shop",
    description: "Sign up and set up your shop room in just a few minutes.",
  },
  {
    number: "2",
    Icon: GroupsRoundedIcon,
    title: "Invite Customers",
    description: "Share your room link and invite customers to join.",
  },
  {
    number: "3",
    Icon: ChatRoundedIcon,
    title: "Connect & Grow",
    description: "Chat, share updates and grow your business together.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full bg-(--color-bg-surface) py-24 px-6">
      <div className="max-w-[1100px] mx-auto">
        <SectionHeader
          eyebrow="How it Works"
          title="Start in 3 simple steps"
          subtitle="Get your shop online and start connecting with customers in minutes."
          className="mb-16"
        />

        <div className="relative">
          {/* Dashed connector line (desktop), aligned to the circle centres */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={VIEWPORT}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="hidden md:block absolute top-16 left-[16.66%] right-[16.66%] h-0 origin-left border-t-2 border-dashed border-(--color-brand-primary-muted)"
          />

          <motion.ol
            variants={staggerContainer(0.18, 0.2)}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            className="relative grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8"
          >
            {STEPS.map(({ number, Icon, title, description }) => (
              <motion.li
                key={number}
                variants={fadeUp}
                className="flex flex-col items-center text-center"
              >
                {/* Soft concentric circle + number badge */}
                <div className="relative flex items-center justify-center w-32 h-32">
                  <span className="absolute inset-0 rounded-full bg-(--color-brand-primary-light) opacity-55" />
                  <span className="relative flex items-center justify-center w-24 h-24 rounded-full bg-(--color-brand-primary-light) ring-1 ring-(--color-brand-primary-muted)/50 shadow-(--shadow-sm)">
                    <Icon sx={{ fontSize: 40, color: "var(--color-brand-primary)" }} />
                  </span>
                  <span className="absolute top-1 left-1 flex items-center justify-center w-7 h-7 rounded-full bg-(--color-brand-primary) text-[12px] font-bold text-(--color-text-on-brand) border-2 border-(--color-bg-surface) shadow-(--shadow-xs)">
                    {number}
                  </span>
                </div>

                <h3 className="mt-5 text-[18px] font-bold text-(--color-text-primary)">
                  {title}
                </h3>
                <p className="mt-2 max-w-[220px] flex items-start gap-1.5 text-[14px] text-(--color-text-secondary) leading-relaxed text-left">
                  <CheckRoundedIcon
                    sx={{ fontSize: 16, color: "var(--color-brand-primary-muted)" }}
                    className="mt-0.5 shrink-0"
                  />
                  <span>{description}</span>
                </p>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}
