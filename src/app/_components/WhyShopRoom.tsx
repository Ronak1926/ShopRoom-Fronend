"use client";

import { motion } from "framer-motion";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { fadeUp, scaleIn, staggerContainer, VIEWPORT } from "./motion";
import AnalyticsCard from "./AnalyticsCard";

const CHECKLIST = [
  "Stronger relationships",
  "Repeat customers",
  "Better engagement",
  "Smart notifications",
] as const;

export default function WhyShopRoom() {
  return (
    <section className="w-full bg-(--color-bg-page) py-24 px-6">
      <div className="max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left — copy + checklist */}
        <motion.div
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="flex flex-col gap-6"
        >
          <motion.h2
            variants={fadeUp}
            className="text-[clamp(28px,3.8vw,42px)] font-extrabold text-(--color-text-primary) leading-[1.12] tracking-tight text-balance"
          >
            Built for Shopkeepers.
            <br />
            Loved by Customers.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-[16px] text-(--color-text-secondary) leading-relaxed max-w-[460px]"
          >
            ShopRoom is more than a chat platform — it&apos;s a complete growth
            engine that keeps your customers coming back.
          </motion.p>
          <motion.ul
            variants={staggerContainer(0.1)}
            className="grid sm:grid-cols-2 gap-x-6 gap-y-4"
          >
            {CHECKLIST.map((item) => (
              <motion.li
                key={item}
                variants={fadeUp}
                className="flex items-center gap-3"
              >
                <CheckCircleRoundedIcon
                  sx={{ fontSize: 20, color: "var(--color-brand-primary)" }}
                />
                <span className="text-[15px] font-medium text-(--color-text-primary)">
                  {item}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Right — analytics dashboard */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          <AnalyticsCard />
        </motion.div>
      </div>
    </section>
  );
}
