"use client";

import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import type { SvgIconComponent } from "@mui/icons-material";

const ICON_MAP: Record<string, SvgIconComponent> = {
  people: PeopleOutlinedIcon,
  chat: ChatOutlinedIcon,
  bell: NotificationsOutlinedIcon,
  flag: FlagOutlinedIcon,
};

interface KPICardsProps {
  membersCount: number;
  loading?: boolean;
}

export default function KPICards({ membersCount, loading }: KPICardsProps) {
  const cards = [
    {
      id: "members",
      iconKey: "people",
      iconBgClass: "bg-[var(--color-brand-primary-light)]",
      iconColor: "var(--color-brand-primary)",
      label: "ROOM MEMBERS",
      value: loading ? "—" : String(membersCount),
      dot: false,
      comingSoon: false,
    },
    {
      id: "messages",
      iconKey: "chat",
      iconBgClass: "bg-[var(--color-brand-primary-light)]",
      iconColor: "var(--color-brand-primary)",
      label: "MESSAGES TODAY",
      value: "—",
      dot: false,
      comingSoon: true,
    },
    {
      id: "alerts",
      iconKey: "bell",
      iconBgClass: "bg-[var(--color-brand-alert-light)]",
      iconColor: "var(--color-brand-alert)",
      label: "ALERTS SENT",
      value: "—",
      dot: false,
      comingSoon: true,
    },
    {
      id: "replies",
      iconKey: "flag",
      iconBgClass: "bg-[var(--color-danger-bg)]",
      iconColor: "var(--color-danger-dot)",
      label: "UNREAD REPLIES",
      value: "—",
      dot: false,
      comingSoon: true,
    },
  ];

  return (
    <div className="flex gap-4">
      {cards.map((card) => {
        const Icon = ICON_MAP[card.iconKey];
        return (
          <div
            key={card.id}
            className="flex-1 bg-(--color-bg-surface) border border-(--color-border-default) rounded-xl p-5 flex flex-col relative transition-shadow duration-150 hover:shadow-(--shadow-brand-card) cursor-default"
          >
            {card.dot && (
              <div className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full bg-(--color-danger-dot)" />
            )}
            <div className="flex items-start justify-between mb-3">
              <div
                className={`w-10 h-10 rounded-[10px] flex items-center justify-center ${card.iconBgClass}`}
              >
                <Icon sx={{ fontSize: 20, color: card.iconColor }} />
              </div>
              {card.comingSoon && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-(--color-badge-neutral-bg) text-(--color-badge-neutral-text) border border-(--color-border-default)">
                  Soon
                </span>
              )}
            </div>
            <div className="text-[10px] font-semibold tracking-widest uppercase text-(--color-text-secondary) mb-1">
              {card.label}
            </div>
            <div
              className={`text-[28px] font-bold ${card.comingSoon ? "text-(--color-text-hint)" : "text-(--color-text-primary)"}`}
            >
              {card.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}
