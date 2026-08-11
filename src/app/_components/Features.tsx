"use client";

import { motion } from "framer-motion";
import type { ComponentType } from "react";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import AddBusinessOutlinedIcon from "@mui/icons-material/AddBusinessOutlined";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import PermMediaOutlinedIcon from "@mui/icons-material/PermMediaOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import { fadeUp, staggerContainer, VIEWPORT } from "./motion";
import SectionHeader from "./ui/SectionHeader";

type Feature = {
  Icon: ComponentType<SvgIconProps>;
  title: string;
  description: string;
};

const FEATURES: Feature[] = [
  {
    Icon: AddBusinessOutlinedIcon,
    title: "Create Your Room",
    description:
      "Set up your shop room in seconds and get your own space to connect with customers.",
  },
  {
    Icon: GroupAddOutlinedIcon,
    title: "Invite Customers",
    description:
      "Share invite links on any platform. Let customers join your room with one click.",
  },
  {
    Icon: ChatOutlinedIcon,
    title: "Real-time Chat",
    description:
      "Chat with your customers in real time and build strong relationships.",
  },
  {
    Icon: CampaignOutlinedIcon,
    title: "Send Updates",
    description:
      "Send product updates, offers and announcements directly in the room.",
  },
  {
    Icon: NotificationsActiveOutlinedIcon,
    title: "Smart Notifications",
    description:
      "Customers get notified instantly about important updates and new arrivals.",
  },
  {
    Icon: PermMediaOutlinedIcon,
    title: "Media Sharing",
    description:
      "Share images, videos and files beautifully to showcase your products.",
  },
  {
    Icon: InsightsOutlinedIcon,
    title: "Customer Insights",
    description:
      "Understand your customers better with room activity and engagement insights.",
  },
  {
    Icon: ShieldOutlinedIcon,
    title: "Secure & Reliable",
    description: "Your data and customers are safe with enterprise-grade security.",
  },
];

export default function Features() {
  return (
    <section id="features" className="w-full bg-(--color-bg-page) py-24 px-6">
      <div className="max-w-[1200px] mx-auto">
        <SectionHeader
          eyebrow="Why ShopRoom?"
          title="Everything you need to grow together"
          subtitle="Powerful tools to help you connect, engage and grow your business."
          className="mb-14"
        />

        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {FEATURES.map(({ Icon, title, description }) => (
            <motion.article
              key={title}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              className="group flex flex-col gap-4 p-6 rounded-2xl bg-(--color-bg-surface) border border-(--color-border-default) shadow-(--shadow-xs) hover:shadow-(--shadow-md) hover:border-(--color-brand-primary-muted) transition-[box-shadow,border-color] duration-200"
            >
              <span className="w-12 h-12 rounded-xl bg-(--color-brand-primary-light) flex items-center justify-center shrink-0 transition-[background-color,transform] duration-200 group-hover:bg-(--color-brand-primary) group-hover:rotate-6">
                <Icon
                  sx={{ fontSize: 24, color: "var(--color-brand-primary)" }}
                  className="transition-colors duration-200 group-hover:!text-white"
                />
              </span>
              <div>
                <h3 className="text-[16px] font-bold text-(--color-text-primary) mb-2">
                  {title}
                </h3>
                <p className="text-[13px] text-(--color-text-secondary) leading-relaxed">
                  {description}
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
