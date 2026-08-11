"use client";

import { motion } from "framer-motion";
import type { ComponentType } from "react";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import {
  fadeUp,
  floatAnimate,
  floatTransition,
  scaleIn,
  staggerContainer,
  VIEWPORT,
} from "./motion";
import SectionHeader from "./ui/SectionHeader";

type Note = {
  Icon: ComponentType<SvgIconProps>;
  tag: string;
  tagClass: string;
  title: string;
  time: string;
};

const NOTES: Note[] = [
  {
    Icon: ShoppingBagOutlinedIcon,
    tag: "New Arrivals",
    tagClass: "bg-(--color-brand-primary-light) text-(--color-brand-primary-text)",
    title: "20 new sneakers just dropped",
    time: "now",
  },
  {
    Icon: LocalOfferOutlinedIcon,
    tag: "Discount",
    tagClass: "bg-(--color-badge-success-bg) text-(--color-badge-success-text)",
    title: "Flat 30% off this weekend only",
    time: "2m",
  },
  {
    Icon: Inventory2OutlinedIcon,
    tag: "Back in Stock",
    tagClass: "bg-(--color-brand-alert-light) text-(--color-brand-alert-text)",
    title: "Your size is available again",
    time: "12m",
  },
  {
    Icon: ChatBubbleOutlineRoundedIcon,
    tag: "Reply",
    tagClass: "bg-(--color-badge-blue-bg) text-(--color-badge-blue-text)",
    title: "Priya: Can you hold one for me?",
    time: "18m",
  },
];

export default function NotificationShowcase() {
  return (
    <section className="w-full bg-(--color-bg-page) py-24 px-6 overflow-hidden">
      <div className="max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-14 items-center">
        {/* Left — copy */}
        <div className="order-2 lg:order-1">
          <SectionHeader
            eyebrow="Notifications"
            title="Reach every customer the moment it matters"
            highlight="the moment it matters"
            subtitle="New arrivals, flash discounts, restock alerts and replies — delivered instantly, so no customer ever misses out."
            align="left"
          />
        </div>

        {/* Right — phone mockup */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="order-1 lg:order-2 relative flex justify-center"
        >
          {/* Floating bubbles */}
          <motion.div
            animate={floatAnimate(12)}
            transition={floatTransition(4.5)}
            className="absolute -left-2 top-16 z-20 flex items-center gap-2 bg-(--color-bg-surface) rounded-full shadow-(--shadow-md) border border-(--color-border-default) px-3 py-1.5"
          >
            <FavoriteRoundedIcon sx={{ fontSize: 16, color: "var(--color-danger)" }} />
            <span className="text-[12px] font-bold text-(--color-text-primary)">128</span>
          </motion.div>
          <motion.div
            animate={floatAnimate(14)}
            transition={floatTransition(5.5)}
            className="absolute -right-1 bottom-24 z-20 flex items-center gap-2 bg-(--color-bg-surface) rounded-full shadow-(--shadow-md) border border-(--color-border-default) px-3 py-1.5"
          >
            <NotificationsActiveRoundedIcon
              sx={{ fontSize: 16, color: "var(--color-brand-primary)" }}
            />
            <span className="text-[12px] font-bold text-(--color-text-primary)">
              Live
            </span>
          </motion.div>

          {/* Phone */}
          <div className="relative w-[300px] max-w-full rounded-[44px] bg-(--color-gray-900) p-3 shadow-(--shadow-lg)">
            <div className="relative rounded-[34px] bg-(--color-bg-page) overflow-hidden">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-(--color-gray-900) rounded-b-2xl z-10" />
              {/* Screen header */}
              <div className="px-5 pt-9 pb-4 bg-(--color-bg-surface) border-b border-(--color-border-default)">
                <p className="text-[11px] font-semibold text-(--color-text-hint)">
                  ShopRoom
                </p>
                <p className="text-[16px] font-bold text-(--color-text-primary)">
                  Notifications
                </p>
              </div>
              {/* Notifications */}
              <motion.div
                variants={staggerContainer(0.15, 0.3)}
                initial="hidden"
                whileInView="visible"
                viewport={VIEWPORT}
                className="flex flex-col gap-3 p-4"
              >
                {NOTES.map(({ Icon, tag, tagClass, title, time }) => (
                  <motion.div
                    key={title}
                    variants={fadeUp}
                    className="flex gap-3 p-3 rounded-2xl bg-(--color-bg-surface) border border-(--color-border-default) shadow-(--shadow-xs)"
                  >
                    <span className="flex items-center justify-center w-9 h-9 shrink-0 rounded-xl bg-(--color-bg-surface-hover)">
                      <Icon sx={{ fontSize: 18, color: "var(--color-brand-primary)" }} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className={`inline-flex items-center h-4 px-1.5 rounded-full text-[9px] font-bold uppercase tracking-wide ${tagClass}`}
                        >
                          {tag}
                        </span>
                        <span className="text-[10px] text-(--color-text-hint)">
                          {time}
                        </span>
                      </div>
                      <p className="text-[12px] font-semibold text-(--color-text-primary) leading-snug truncate">
                        {title}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
