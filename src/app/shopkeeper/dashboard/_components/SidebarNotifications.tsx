"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import {
  NOTIFICATION_SUBNAV,
  NOTIFICATION_DEFAULT_ROUTE,
} from "../_data/constants";

interface Props {
  collapsed: boolean;
}

export default function SidebarNotifications({ collapsed }: Props) {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const onNotifRoute = pathname.startsWith("/shopkeeper/notifications");
  const [open, setOpen] = useState(onNotifRoute);

  // Collapsed rail: single icon that jumps to the default notifications page.
  if (collapsed) {
    return (
      <button
        type="button"
        title="Notifications"
        onClick={() => router.push(NOTIFICATION_DEFAULT_ROUTE)}
        className={`relative flex items-center justify-center w-full py-2.5 rounded-xl cursor-pointer transition-all duration-150 ${
          onNotifRoute
            ? "bg-(--color-brand-primary-light) text-(--color-brand-primary)"
            : "text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover) hover:text-(--color-text-primary)"
        }`}
      >
        {onNotifRoute && (
          <span className="absolute left-0 top-2.5 bottom-2.5 w-0.75 rounded-full bg-(--color-brand-primary)" />
        )}
        <NotificationsOutlinedIcon sx={{ fontSize: 18 }} />
      </button>
    );
  }

  return (
    <div>
      {/* Parent row — toggles the sub-menu */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`relative flex items-center w-full gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-[14px] transition-all duration-150 text-left ${
          onNotifRoute
            ? "bg-(--color-brand-primary-light) text-(--color-brand-primary) font-semibold"
            : "text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover) hover:text-(--color-text-primary)"
        }`}
      >
        {onNotifRoute && (
          <span className="absolute left-0 top-2.5 bottom-2.5 w-0.75 rounded-full bg-(--color-brand-primary)" />
        )}
        <NotificationsOutlinedIcon sx={{ fontSize: 18 }} />
        <span>Notifications</span>
        <ExpandMoreOutlinedIcon
          sx={{ fontSize: 18 }}
          className={`ml-auto transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Sub-items */}
      {open && (
        <div className="mt-0.5 ml-4 pl-3 border-l border-(--color-border-default) flex flex-col gap-0.5">
          {NOTIFICATION_SUBNAV.map(({ id, label, route }) => {
            const active = pathname === route || pathname.startsWith(route + "/");
            return (
              <button
                key={id}
                type="button"
                onClick={() => router.push(route)}
                className={`flex items-center gap-2 w-full pl-2 pr-2 py-2 rounded-lg cursor-pointer text-[13px] text-left transition-colors ${
                  active
                    ? "text-(--color-brand-primary) font-semibold"
                    : "text-(--color-text-secondary) hover:text-(--color-text-primary)"
                }`}
              >
                <CircleOutlinedIcon
                  sx={{ fontSize: 7 }}
                  className={active ? "opacity-100" : "opacity-40"}
                />
                <span className="truncate">{label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
