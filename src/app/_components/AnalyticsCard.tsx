"use client";

import { motion } from "framer-motion";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import { VIEWPORT, floatAnimate, floatTransition } from "./motion";
import CountUp from "./ui/CountUp";

const STATS = [
  { value: 10000, suffix: "+", label: "Active Shops" },
  { value: 250, suffix: "K+", label: "Happy Customers" },
  { value: 1.5, decimals: 1, suffix: "M+", label: "Messages Sent" },
  { value: 300, suffix: "%+", label: "Average Growth" },
];

/** Chart data in a 320×140 viewBox (y grows downward). */
const POINTS: [number, number][] = [
  [0, 116],
  [53, 98],
  [107, 104],
  [160, 72],
  [213, 80],
  [267, 44],
  [320, 18],
];

function smoothPath(pts: [number, number][]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${p2[0]} ${p2[1]}`;
  }
  return d;
}

const LINE = smoothPath(POINTS);
const AREA = `${LINE} L 320 140 L 0 140 Z`;

export default function AnalyticsCard() {
  return (
    <div className="relative rounded-3xl bg-(--color-bg-surface) border border-(--color-border-default) shadow-(--shadow-lg) p-7 sm:p-9">
      {/* Stat row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
        {STATS.map(({ value, suffix, decimals, label }) => (
          <div key={label} className="flex flex-col">
            <CountUp
              value={value}
              decimals={decimals}
              suffix={suffix}
              className="text-[clamp(22px,2.4vw,30px)] font-extrabold text-(--color-brand-primary) leading-none"
            />
            <span className="text-[12px] text-(--color-text-secondary) mt-1.5">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="relative rounded-2xl bg-(--color-bg-page) border border-(--color-border-default) p-5">
        <p className="text-[12px] font-semibold text-(--color-text-secondary) mb-3">
          Business Growth
        </p>

        {/* Floating growth badge */}
        <motion.div
          animate={floatAnimate(8)}
          transition={floatTransition(4)}
          className="absolute top-4 right-4 flex items-center gap-1.5 h-7 px-3 rounded-full bg-(--color-brand-primary) shadow-(--shadow-sm)"
        >
          <TrendingUpRoundedIcon
            sx={{ fontSize: 15, color: "var(--color-text-on-brand)" }}
          />
          <span className="text-[12px] font-bold text-(--color-text-on-brand)">
            +300%
          </span>
        </motion.div>

        <svg
          viewBox="0 0 320 140"
          preserveAspectRatio="none"
          role="img"
          aria-label="Line chart showing steady business growth"
          className="w-full h-36 text-(--color-brand-primary) overflow-visible"
        >
          <defs>
            <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.28" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path
            d={AREA}
            fill="url(#areaFill)"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.8, delay: 0.9 }}
          />
          <motion.path
            d={LINE}
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={VIEWPORT}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.circle
            cx={320}
            cy={18}
            r={5}
            className="fill-(--color-brand-primary)"
            stroke="var(--color-bg-page)"
            strokeWidth={3}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={VIEWPORT}
            transition={{ delay: 1.4, type: "spring", stiffness: 260 }}
          />
        </svg>

        <div className="flex justify-between mt-2">
          {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m) => (
            <span key={m} className="text-[11px] font-medium text-(--color-text-hint)">
              {m}
            </span>
          ))}
        </div>
      </div>

      {/* Floating widget */}
      <motion.div
        animate={floatAnimate(10)}
        transition={floatTransition(5)}
        className="absolute -bottom-5 -left-4 hidden sm:flex items-center gap-3 bg-(--color-bg-surface) rounded-2xl shadow-(--shadow-md) border border-(--color-border-default) px-4 py-3"
      >
        <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-(--color-badge-success-bg)">
          <GroupRoundedIcon
            sx={{ fontSize: 20, color: "var(--color-badge-success-text)" }}
          />
        </span>
        <div>
          <CountUp
            value={248}
            prefix="+"
            className="text-[15px] font-bold text-(--color-text-primary) leading-tight block"
          />
          <span className="text-[11px] text-(--color-text-hint)">
            new members today
          </span>
        </div>
      </motion.div>
    </div>
  );
}
