"use client";

import { useRef } from "react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import type { ComponentType } from "react";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import ShoppingBasketOutlinedIcon from "@mui/icons-material/ShoppingBasketOutlined";
import EnergySavingsLeafOutlinedIcon from "@mui/icons-material/EnergySavingsLeafOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import CheckroomOutlinedIcon from "@mui/icons-material/CheckroomOutlined";
import DevicesOutlinedIcon from "@mui/icons-material/DevicesOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import LocalFloristOutlinedIcon from "@mui/icons-material/LocalFloristOutlined";

type Brand = { name: string; Icon: ComponentType<SvgIconProps> };

const BRANDS: Brand[] = [
  { name: "Daily Basket", Icon: ShoppingBasketOutlinedIcon },
  { name: "Freshco", Icon: EnergySavingsLeafOutlinedIcon },
  { name: "Urban Haat", Icon: StorefrontOutlinedIcon },
  { name: "Fashion Flair", Icon: CheckroomOutlinedIcon },
  { name: "Tech World", Icon: DevicesOutlinedIcon },
  { name: "HomeStop", Icon: HomeOutlinedIcon },
  { name: "Book Nook", Icon: MenuBookOutlinedIcon },
  { name: "Green Cart", Icon: LocalFloristOutlinedIcon },
];

const SPEED = 45; // px per second

export default function TrustedCarousel() {
  const x = useMotionValue(0);
  const paused = useRef(false);
  const trackRef = useRef<HTMLDivElement>(null);

  useAnimationFrame((_, delta) => {
    if (paused.current) return;
    const half = (trackRef.current?.scrollWidth ?? 0) / 2;
    let next = x.get() - (SPEED * delta) / 1000;
    if (half && next <= -half) next += half;
    x.set(next);
  });

  return (
    <section
      aria-label="Trusted by local businesses"
      className="w-full bg-(--color-bg-surface) border-y border-(--color-border-default) py-8"
    >
      <div
        className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
        onMouseEnter={() => (paused.current = true)}
        onMouseLeave={() => (paused.current = false)}
      >
        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex w-max items-center gap-12 pr-12"
        >
          {[...BRANDS, ...BRANDS].map(({ name, Icon }, i) => (
            <div
              key={`${name}-${i}`}
              className="flex items-center gap-2 text-(--color-text-hint) hover:text-(--color-brand-primary) transition-colors duration-200 shrink-0"
            >
              <Icon sx={{ fontSize: 24 }} />
              <span className="text-[16px] font-semibold tracking-tight whitespace-nowrap">
                {name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
