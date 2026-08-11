"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import { fadeUp, staggerContainer, VIEWPORT, SPRING } from "./motion";
import SectionHeader from "./ui/SectionHeader";

type QA = { question: string; answer: string };

const FAQS: QA[] = [
  {
    question: "What is ShopRoom?",
    answer:
      "ShopRoom is a platform that lets local shopkeepers create their own room, invite customers, and share real-time updates, offers and stock alerts — all in one place.",
  },
  {
    question: "How much does it cost to start?",
    answer:
      "You can start completely free. Our Free plan lets you create a room and reach up to 50 members. Paid plans unlock more rooms, members and advanced tools.",
  },
  {
    question: "Do my customers need to download an app?",
    answer:
      "No. Customers join your room instantly through a shared link — no app download or complicated sign-up required.",
  },
  {
    question: "How do customers receive updates?",
    answer:
      "Every update you post is delivered to your members as an instant notification, so they never miss new arrivals, discounts or restocks.",
  },
  {
    question: "Can I use ShopRoom for any type of business?",
    answer:
      "Yes. From fashion and groceries to electronics, books and beauty — ShopRoom works for any shop that wants to stay connected with its customers.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. We use enterprise-grade security to keep your data and your customers' information safe and private at all times.",
  },
  {
    question: "Can I upgrade or downgrade my plan later?",
    answer:
      "Yes, you can change your plan anytime from your dashboard. Upgrades apply instantly and downgrades take effect at the next billing cycle.",
  },
  {
    question: "Is there a free trial for paid plans?",
    answer:
      "Every paid plan includes a 7-day free trial. You can cancel anytime during the trial and you won't be charged.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="w-full bg-(--color-bg-page) py-24 px-6">
      <div className="max-w-[760px] mx-auto">
        <SectionHeader
          eyebrow="FAQ"
          title="Frequently asked questions"
          subtitle="Everything you need to know about ShopRoom."
          className="mb-12"
        />

        <motion.ul
          variants={staggerContainer(0.06)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="flex flex-col gap-3"
        >
          {FAQS.map(({ question, answer }, i) => {
            const isOpen = open === i;
            return (
              <motion.li
                key={question}
                variants={fadeUp}
                className="rounded-2xl bg-(--color-bg-surface) border border-(--color-border-default) overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer"
                >
                  <span className="text-[15px] font-semibold text-(--color-text-primary)">
                    {question}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={SPRING}
                    className="shrink-0 text-(--color-brand-primary)"
                  >
                    <ExpandMoreRoundedIcon />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-[14px] text-(--color-text-secondary) leading-relaxed">
                        {answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
