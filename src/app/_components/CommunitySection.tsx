"use client";

import { motion } from "framer-motion";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ThumbUpRoundedIcon from "@mui/icons-material/ThumbUpRounded";
import CelebrationRoundedIcon from "@mui/icons-material/CelebrationRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import {
  fadeUp,
  floatAnimate,
  floatTransition,
  scaleIn,
  staggerContainer,
  VIEWPORT,
} from "./motion";
import SectionHeader from "./ui/SectionHeader";
import Avatar from "@/components/ui/Avatar";

type Bubble = { from: "customer" | "shop"; text: string; name?: string };

const BUBBLES: Bubble[] = [
  { from: "customer", name: "Aarav", text: "Are the Alphonso mangoes fresh today?" },
  { from: "shop", text: "Just arrived this morning — grade A!" },
  { from: "customer", name: "Meera", text: "Perfect, please hold 2 crates for me." },
];

const MEMBERS = ["Aarav", "Meera", "Kabir", "Diya", "Rohan"];

const REACTIONS = [
  { Icon: FavoriteRoundedIcon, color: "var(--color-danger)" },
  { Icon: ThumbUpRoundedIcon, color: "var(--color-brand-primary)" },
  { Icon: CelebrationRoundedIcon, color: "var(--color-brand-alert)" },
];

export default function CommunitySection() {
  return (
    <section className="w-full bg-(--color-bg-surface) py-24 px-6 overflow-hidden">
      <div className="max-w-[1100px] mx-auto flex flex-col items-center">
        <SectionHeader
          eyebrow="Live Community"
          title="Your shop, buzzing with real conversations"
          highlight="real conversations"
          subtitle="Members join, react and chat in real time — ShopRoom turns your customers into a community."
          className="mb-14"
        />

        <motion.div
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="relative w-full max-w-[560px]"
        >
          {/* Floating: member joined */}
          <motion.div
            animate={floatAnimate(12)}
            transition={floatTransition(4.5)}
            className="absolute -left-3 sm:-left-10 top-10 z-20 flex items-center gap-2.5 bg-(--color-bg-surface) rounded-2xl shadow-(--shadow-md) border border-(--color-border-default) px-3.5 py-2.5"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-(--color-badge-success-bg)">
              <PersonAddAlt1RoundedIcon
                sx={{ fontSize: 17, color: "var(--color-badge-success-text)" }}
              />
            </span>
            <p className="text-[12px] font-semibold text-(--color-text-primary)">
              Rohan joined the room
            </p>
          </motion.div>

          {/* Floating: reactions */}
          <motion.div
            animate={floatAnimate(14)}
            transition={floatTransition(5.5)}
            className="absolute -right-2 sm:-right-8 bottom-24 z-20 flex items-center gap-1.5 bg-(--color-bg-surface) rounded-full shadow-(--shadow-md) border border-(--color-border-default) px-3 py-2"
          >
            {REACTIONS.map(({ Icon, color }, i) => (
              <Icon key={i} sx={{ fontSize: 16, color }} />
            ))}
          </motion.div>

          {/* Chat card */}
          <div className="rounded-3xl bg-(--color-bg-page) border border-(--color-border-default) shadow-(--shadow-lg) overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-(--color-bg-surface) border-b border-(--color-border-default)">
              <div>
                <p className="text-[14px] font-bold text-(--color-text-primary) leading-tight">
                  Sharma General Store
                </p>
                <p className="text-[12px] text-(--color-text-hint) flex items-center gap-1.5">
                  <span className="relative flex w-2 h-2">
                    <motion.span
                      animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-(--color-status-online)"
                    />
                    <span className="relative w-2 h-2 rounded-full bg-(--color-status-online)" />
                  </span>
                  12 online now
                </p>
              </div>
              <div className="flex -space-x-2">
                {MEMBERS.slice(0, 4).map((name) => (
                  <Avatar
                    key={name}
                    name={name}
                    size="sm"
                    className="ring-2 ring-(--color-bg-surface)"
                  />
                ))}
              </div>
            </div>

            {/* Messages */}
            <motion.div
              variants={staggerContainer(0.25, 0.3)}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
              className="flex flex-col gap-3 p-5"
            >
              {BUBBLES.map((bubble, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className={`flex items-end gap-2 max-w-[80%] ${
                    bubble.from === "shop" ? "self-end flex-row-reverse" : "self-start"
                  }`}
                >
                  {bubble.from === "customer" && bubble.name && (
                    <Avatar name={bubble.name} size="xs" />
                  )}
                  <div
                    className={`px-4 py-2.5 text-[13px] leading-relaxed rounded-2xl ${
                      bubble.from === "shop"
                        ? "bg-(--color-brand-primary) text-(--color-text-on-brand) rounded-br-md"
                        : "bg-(--color-bg-surface) text-(--color-text-primary) border border-(--color-border-default) rounded-bl-md"
                    }`}
                  >
                    {bubble.text}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              <motion.div
                variants={fadeUp}
                className="self-start flex items-center gap-2"
              >
                <Avatar name="Rahul" size="xs" />
                <div className="flex items-center gap-1 px-4 py-3 rounded-2xl rounded-bl-md bg-(--color-bg-surface) border border-(--color-border-default)">
                  {[0, 1, 2].map((d) => (
                    <motion.span
                      key={d}
                      animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: d * 0.15,
                      }}
                      className="w-1.5 h-1.5 rounded-full bg-(--color-text-hint)"
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
