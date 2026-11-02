"use client";

import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import { fadeUp, staggerContainer, VIEWPORT, SPRING } from "./motion";
import SectionHeader from "./ui/SectionHeader";
import { FAQS } from "./faqData";

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

        <m.ul
          variants={staggerContainer(0.06)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="flex flex-col gap-3"
        >
          {FAQS.map(({ question, answer }, i) => {
            const isOpen = open === i;
            return (
              <m.li
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
                  <m.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={SPRING}
                    className="shrink-0 text-(--color-brand-primary)"
                  >
                    <ExpandMoreRoundedIcon />
                  </m.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <m.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-[14px] text-(--color-text-secondary) leading-relaxed">
                        {answer}
                      </p>
                    </m.div>
                  )}
                </AnimatePresence>
              </m.li>
            );
          })}
        </m.ul>
      </div>
    </section>
  );
}
