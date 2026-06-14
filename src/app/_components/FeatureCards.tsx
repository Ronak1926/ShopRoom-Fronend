import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import type { ComponentType } from "react";

type Feature = {
  Icon: ComponentType<SvgIconProps>;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    Icon: NotificationsActiveOutlinedIcon,
    title: "Real-time stock alerts",
    description: "Know the moment new stock hits the shelf.",
  },
  {
    Icon: ExploreOutlinedIcon,
    title: "Proximity-based discovery",
    description: "Find shops within 5 km of you automatically.",
  },
  {
    Icon: AutoAwesomeOutlinedIcon,
    title: "Custom notification styles",
    description: "Shopkeepers design alerts that grab attention.",
  },
];

export default function FeatureCards() {
  return (
    <section
      id="features"
      className="w-full bg-(--color-bg-surface) py-20 px-6"
    >
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map(({ Icon, title, description }) => (
          <div
            key={title}
            className="bg-(--color-bg-surface) border border-(--color-border-default) rounded-2xl p-8 flex flex-col gap-4"
          >
            <Icon sx={{ fontSize: 40, color: "var(--color-brand-primary)" }} />
            <h3 className="text-[18px] font-bold text-(--color-text-primary)">
              {title}
            </h3>
            <p className="text-[14px] text-(--color-text-secondary) leading-relaxed">
              {description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
