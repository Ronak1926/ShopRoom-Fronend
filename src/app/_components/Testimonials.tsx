"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { fadeUp, staggerContainer, VIEWPORT } from "./motion";
import SectionHeader from "./ui/SectionHeader";
import Avatar from "@/components/ui/Avatar";

type Testimonial = {
  quote: string;
  name: string;
  business: string;
  avatar: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "ShopRoom has completely changed the way I connect with my customers. It's simple, fast and super effective!",
    name: "Rahul Sharma",
    business: "Fashion Store",
    avatar: "/profile-pic/rahul-sharma.jpg",
  },
  {
    quote:
      "I can easily share updates and my customers love getting notified about new products and offers.",
    name: "Priya Patel",
    business: "Home Decor",
    avatar: "/profile-pic/priya-patel.jpg",
  },
  {
    quote:
      "Best platform for local shopkeepers. My sales have increased so much after using ShopRoom.",
    name: "Amit Verma",
    business: "Electronics Store",
    avatar: "/profile-pic/amit-verma.jpg",
  },
];

const AUTO_MS = 5000;

function TestimonialCard({
  data,
  featured,
}: {
  data: Testimonial;
  featured?: boolean;
}) {
  return (
    <motion.article
      whileHover={{ y: -8 }}
      className={`flex flex-col gap-5 p-7 rounded-3xl bg-(--color-bg-surface) h-full transition-shadow duration-200 ${
        featured
          ? "border-2 border-(--color-brand-primary) shadow-(--shadow-lg) md:scale-105"
          : "border border-(--color-border-default) shadow-(--shadow-xs) hover:shadow-(--shadow-md)"
      }`}
    >
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarRoundedIcon
            key={i}
            sx={{ fontSize: 20, color: "var(--color-status-away)" }}
          />
        ))}
      </div>
      <p className="text-[15px] text-(--color-text-secondary) leading-relaxed flex-1">
        &ldquo;{data.quote}&rdquo;
      </p>
      <div className="flex items-center gap-3 pt-2">
        <Avatar name={data.name} src={data.avatar} size="md" />
        <div>
          <p className="text-[14px] font-bold text-(--color-text-primary) leading-tight">
            {data.name}
          </p>
          <p className="text-[12px] text-(--color-text-hint)">{data.business}</p>
        </div>
      </div>
    </motion.article>
  );
}

export default function Testimonials() {
  const [active, setActive] = useState(1);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(
      () => setActive((a) => (a + 1) % TESTIMONIALS.length),
      AUTO_MS,
    );
    return () => clearInterval(id);
  }, [paused]);

  return (
    <section id="testimonials" className="w-full bg-(--color-bg-page) py-24 px-6">
      <div className="max-w-[1200px] mx-auto">
        <SectionHeader
          title="Loved by shopkeepers like you"
          subtitle="See how ShopRoom is helping local businesses grow every day."
          className="mb-14"
        />

        {/* Desktop grid */}
        <motion.div
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="hidden md:grid grid-cols-3 gap-6 items-center"
        >
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={t.name} variants={fadeUp} className="h-full">
              <TestimonialCard data={t} featured={i === active} />
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile slider */}
        <div className="md:hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
            >
              <TestimonialCard data={TESTIMONIALS[active]} featured />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-10">
          {TESTIMONIALS.map((t, i) => (
            <button
              key={t.name}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show testimonial ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                i === active
                  ? "w-6 bg-(--color-brand-primary)"
                  : "w-2 bg-(--color-border-strong) hover:bg-(--color-brand-primary-muted)"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
