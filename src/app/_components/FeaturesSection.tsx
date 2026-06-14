import type { ComponentType } from "react";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";

type Feature = {
  Icon: ComponentType<SvgIconProps>;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    Icon: NotificationsActiveOutlinedIcon,
    title: "Real-time stock alerts",
    description:
      "Know the moment new stock hits the shelf. Our high-fidelity notification system ensures you are first in line.",
  },
  {
    Icon: LocationOnOutlinedIcon,
    title: "Proximity-based discovery",
    description:
      "Find shops within 5 km of you automatically. Your physical vicinity becomes a curated digital storefront.",
  },
  {
    Icon: AutoAwesomeOutlinedIcon,
    title: "Custom notification styles",
    description:
      "Shopkeepers design alerts that grab attention. From visual bursts to minimal text, the shop identity shines through.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="w-full bg-(--color-bg-page) py-24 px-6">
      <div className="max-w-[1100px] mx-auto">
        {/* Header */}
        <div className="flex flex-col items-start mb-16 gap-3">
          <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-(--color-brand-primary)">
            The Experience
          </span>
          <h2 className="text-[clamp(30px,4vw,48px)] font-bold text-(--color-text-primary) leading-[1.1] tracking-tight">
            Curated Proximity.
          </h2>
          <p className="text-[15px] text-(--color-text-secondary) max-w-[500px] leading-relaxed mt-1">
            Every feature is designed around one principle: get the right
            information to the right person, at the right moment.
          </p>
        </div>

        {/* Feature columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-(--color-border-default)">
          {features.map(({ Icon, title, description }, i) => (
            <div
              key={title}
              className={`flex flex-col gap-5 py-10 md:py-0 group ${i === 0 ? "md:pr-10" : i === 1 ? "md:px-10" : "md:pl-10"}`}
            >
              <div className="w-11 h-11 rounded-xl bg-(--color-brand-primary-light) flex items-center justify-center shrink-0 group-hover:bg-(--color-brand-primary) transition-colors duration-200">
                <Icon
                  sx={{ fontSize: 22, color: "var(--color-brand-primary)" }}
                  className="group-hover:!text-white transition-colors duration-200"
                />
              </div>
              <div>
                <h3 className="text-[17px] font-semibold text-(--color-text-primary) mb-2.5">
                  {title}
                </h3>
                <p className="text-[14px] text-(--color-text-secondary) leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
