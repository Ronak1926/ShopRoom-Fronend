"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import EqualizerOutlinedIcon from "@mui/icons-material/EqualizerOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { NAV_ITEMS } from "../_data/constants";

const NAV_ICONS: Record<string, React.ElementType> = {
  dashboard: DashboardOutlinedIcon,
  myroom: ChatOutlinedIcon,
  stockalerts: NotificationsOutlinedIcon,
  members: PeopleOutlinedIcon,
  notifications: NotificationsOutlinedIcon,
  analytics: EqualizerOutlinedIcon,
  billing: CreditCardOutlinedIcon,
};

interface SidebarProps {
  activeNav: string;
  onNavChange: (id: string) => void;
}

export default function Sidebar({ activeNav, onNavChange }: SidebarProps) {
  const router = useRouter();

  return (
    <aside className="w-55 min-w-55 bg-(--color-bg-surface) border-r border-(--color-border-default) flex flex-col py-6 h-screen sticky top-0">
      {/* Brand */}
      <div className="px-5 mb-8 flex items-center gap-2.5">
        <Image src="/ShopRoomIcon.svg" alt="ShopRoom" width={22} height={20} />
        <div>
          <div className="font-bold text-lg text-(--color-text-primary) leading-tight">
            ShopRoom
          </div>
          <div className="text-[10px] text-(--color-text-secondary) tracking-[0.12em] uppercase mt-0.5">
            Management Console
          </div>
        </div>
      </div>

      {/* Nav */}
      <ul className="list-none flex-1 m-0 p-0">
        {NAV_ITEMS.map(({ id, label }) => {
          const Icon = NAV_ICONS[id];
          const active = activeNav === id;
          return (
            <li
              key={id}
              className={`flex items-center gap-3 px-5 py-2.5 mx-2 rounded-lg cursor-pointer text-sm select-none transition-colors duration-150 ${
                active
                  ? "font-semibold bg-(--color-brand-primary-light) text-(--color-brand-primary)"
                  : "font-normal text-(--color-text-secondary) hover:bg-(--color-bg-page)"
              }`}
              onClick={() => onNavChange(id)}
            >
              <Icon sx={{ fontSize: 18 }} />
              {label}
            </li>
          );
        })}
      </ul>

      {/* Bottom */}
      <div className="px-4 border-t border-(--color-border-default) mt-auto pt-4">
        <button className="flex items-center justify-center gap-1.5 w-full h-10 bg-(--color-brand-primary) hover:bg-(--color-brand-primary-hover) text-white rounded-lg text-sm font-semibold cursor-pointer border-0 mb-3 transition-colors">
          <span className="text-lg leading-none">+</span> New Entry
        </button>
        <button className="flex items-center justify-center gap-1.5 text-[13px] text-(--color-text-secondary) cursor-pointer bg-transparent border-0 w-full hover:text-(--color-text-primary) transition-colors mb-2">
          <HelpOutlineOutlinedIcon sx={{ fontSize: 14 }} /> Help Center
        </button>
        <button
          onClick={() => router.push("/shopkeeper/logout")}
          className="flex items-center justify-center gap-1.5 text-[13px] text-(--color-danger) cursor-pointer bg-transparent border-0 w-full hover:bg-(--color-danger-light) rounded-lg h-8 transition-colors font-medium"
        >
          <LogoutOutlinedIcon sx={{ fontSize: 15 }} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
