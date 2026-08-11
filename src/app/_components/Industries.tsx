"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer, VIEWPORT } from "./motion";
import SectionHeader from "./ui/SectionHeader";

type Industry = {
  image: string;
  title: string;
  description: string;
};

const INDUSTRIES: Industry[] = [
  {
    image: "/industries/fashion.png",
    title: "Fashion Stores",
    description: "Share new collections, offers and style updates.",
  },
  {
    image: "/industries/grocery.png",
    title: "Grocery Stores",
    description: "Update daily stock and fresh offers instantly.",
  },
  {
    image: "/industries/electronics.png",
    title: "Electronics Shops",
    description: "Showcase new arrivals and best deals.",
  },
  {
    image: "/industries/home-decor.png",
    title: "Home Decor",
    description: "Share beautiful products and decor ideas.",
  },
  {
    image: "/industries/book-store.png",
    title: "Book Stores",
    description: "Recommend books and exclusive discounts.",
  },
  {
    image: "/industries/more.png",
    title: "And Many More",
    description: "Any business. Any size. ShopRoom fits all.",
  },
];

export default function Industries() {
  return (
    <section className="w-full bg-(--color-bg-page) py-24 px-6">
      <div className="max-w-[1200px] mx-auto">
        <SectionHeader
          title="One Platform. Endless Possibilities."
          highlight="Endless Possibilities."
          subtitle="ShopRoom is perfect for every type of business."
          className="mb-14"
        />

        <motion.div
          variants={staggerContainer(0.07)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5"
        >
          {INDUSTRIES.map(({ image, title, description }) => (
            <motion.article
              key={title}
              variants={fadeUp}
              whileHover={{ y: -8 }}
              className="group flex flex-col p-3 rounded-2xl bg-(--color-bg-surface) border border-(--color-border-default) shadow-(--shadow-xs) hover:shadow-(--shadow-brand-glow) transition-shadow duration-300"
            >
              {/* Illustration panel */}
              <div className="relative aspect-[4/3] mb-4 rounded-xl overflow-hidden bg-(--color-brand-primary-light)">
                <Image
                  src={image}
                  alt={`${title} illustration`}
                  fill
                  sizes="(max-width: 768px) 45vw, (max-width: 1024px) 30vw, 180px"
                  unoptimized={image.endsWith(".svg")}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              {/* Text */}
              <div className="px-1 pb-2 text-center">
                <h3 className="text-[15px] font-bold text-(--color-text-primary) mb-1.5">
                  {title}
                </h3>
                <p className="text-[12px] text-(--color-text-secondary) leading-relaxed">
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
