"use client";

import { useState } from "react";
import Image from "next/image";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import NearMeOutlinedIcon from "@mui/icons-material/NearMeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import OpenInFullOutlinedIcon from "@mui/icons-material/OpenInFullOutlined";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";

const navItems = [
  { id: "discover", label: "Discover", Icon: ExploreOutlinedIcon },
  { id: "orders", label: "Orders", Icon: ShoppingBagOutlinedIcon },
  { id: "myrooms", label: "My Rooms", Icon: FavoriteBorderOutlinedIcon },
  { id: "settings", label: "Settings", Icon: SettingsOutlinedIcon },
];

const filterChips = [
  "All",
  "Clothing",
  "Electronics",
  "Food & Grocery",
  "Beauty",
  "🔥 Trending",
];

const rooms = [
  {
    name: "Urban Edge Studio",
    category: "CLOTHING",
    distance: "0.4 km away",
    status: "Active now",
    members: "1.2k",
    hearts: 245,
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
    logoColor: "#5b47d4",
    logoInitials: "UE",
    active: true,
  },
  {
    name: "The Tech Annex",
    category: "ELECTRONICS",
    distance: "0.8 km away",
    status: "Last active 2h ago",
    members: "840",
    hearts: 128,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400",
    logoColor: "#1a1a2e",
    logoInitials: "TA",
    active: false,
  },
  {
    name: "Fresh Pantry",
    category: "FOOD & GROCERY",
    distance: "1.2 km away",
    status: "Active now",
    members: "3.1k",
    hearts: 1500,
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400",
    logoColor: "#0f6e56",
    logoInitials: "FP",
    active: true,
  },
];

const trending = [
  {
    name: "Espresso Theory",
    members: "4.8k members",
    color: "#5b47d4",
    initials: "ET",
  },
  {
    name: "Glow Rituals",
    members: "3.2k members",
    color: "#9d174d",
    initials: "GR",
  },
  {
    name: "The Local Hub",
    members: "2.9k members",
    color: "#1a1a2e",
    initials: "LH",
  },
  {
    name: "Pixel & Print",
    members: "1.5k members",
    color: "#7a5922",
    initials: "PP",
  },
  {
    name: "Iron Sanctuary",
    members: "940 members",
    color: "#374151",
    initials: "IS",
  },
];

function formatHearts(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return String(n);
}

export default function CustomerHome() {
  const [activeNav, setActiveNav] = useState("discover");
  const [activeChip, setActiveChip] = useState("All");

  return (
    <div className="flex h-screen overflow-hidden bg-(--color-bg-page) text-(--color-text-primary)">
      {/* ── Zone 1: Sidebar ── */}
      <aside className="w-56 min-w-56 bg-(--color-bg-surface) border-r border-(--color-border-default) flex flex-col">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-(--color-border-default) flex items-center gap-2.5">
          <Image
            src="/ShopRoomIcon.svg"
            alt="ShopRoom"
            width={22}
            height={20}
          />
          <span className="text-lg font-bold text-(--color-text-primary)">
            ShopRoom
          </span>
        </div>

        {/* Nav */}
        <ul className="list-none flex-1 m-0 p-0 mt-3">
          {navItems.map(({ id, label, Icon }) => {
            const active = activeNav === id;
            return (
              <li
                key={id}
                onClick={() => setActiveNav(id)}
                className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg cursor-pointer text-sm select-none transition-colors duration-150 ${
                  active
                    ? "font-semibold bg-(--color-brand-primary-light) text-(--color-brand-primary)"
                    : "font-normal text-(--color-text-secondary) hover:bg-(--color-bg-page)"
                }`}
              >
                <Icon sx={{ fontSize: 18 }} />
                {label}
              </li>
            );
          })}
        </ul>

        {/* Bottom */}
        <div className="px-4 pb-5 border-t border-(--color-border-default) pt-4 mt-auto">
          <button className="flex items-center justify-center gap-1.5 w-full h-10 bg-(--color-brand-primary) hover:bg-(--color-brand-primary-hover) text-white rounded-lg text-sm font-semibold cursor-pointer border-0 transition-colors">
            <span className="text-lg leading-none">+</span> Create Room
          </button>
        </div>
      </aside>

      {/* ── Zone 2: Main Content ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Bar */}
        <div className="h-16 bg-(--color-bg-surface) border-b border-(--color-border-default) px-5 flex items-center gap-3 shrink-0">
          {/* Search pill */}
          <div className="flex items-center h-10 rounded-xl bg-(--color-bg-page) border border-(--color-border-default) px-3 gap-2 flex-1 max-w-lg">
            <SearchOutlinedIcon
              sx={{
                fontSize: 18,
                color: "var(--color-text-hint)",
                flexShrink: 0,
              }}
            />
            <input
              type="text"
              placeholder="Search rooms, shops or categories..."
              className="flex-1 bg-transparent outline-none text-sm text-(--color-text-primary) placeholder:text-(--color-text-hint) min-w-0"
            />
            <div className="w-px h-5 bg-(--color-border-default) shrink-0" />
            <LocationOnOutlinedIcon
              sx={{
                fontSize: 14,
                color: "var(--color-brand-primary)",
                flexShrink: 0,
              }}
            />
            <span className="text-xs font-medium text-(--color-brand-primary) whitespace-nowrap shrink-0">
              Near Ahmedabad
            </span>
          </div>

          {/* Right icons */}
          <div className="ml-auto flex items-center gap-2">
            <div className="relative w-9 h-9 flex items-center justify-center cursor-pointer">
              <NotificationsNoneOutlinedIcon
                sx={{ fontSize: 22, color: "var(--color-text-secondary)" }}
              />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            </div>
            <div className="w-9 h-9 rounded-full bg-(--color-brand-primary) text-white text-sm font-bold flex items-center justify-center cursor-pointer select-none">
              A
            </div>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="px-5 py-3 flex items-center gap-2 border-b border-(--color-border-default) bg-(--color-bg-surface) shrink-0 overflow-x-auto">
          {filterChips.map((chip) => (
            <button
              key={chip}
              onClick={() => setActiveChip(chip)}
              className={`h-8 px-4 rounded-full text-[13px] font-medium cursor-pointer whitespace-nowrap shrink-0 border transition-colors ${
                activeChip === chip
                  ? "bg-(--color-brand-primary) text-white font-semibold border-transparent"
                  : "bg-transparent border-(--color-border-default) text-(--color-text-secondary) hover:border-(--color-brand-primary) hover:text-(--color-brand-primary)"
              }`}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Room Grid Area */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* Row header */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-(--color-text-secondary)">
              Showing{" "}
              <span className="font-bold text-(--color-text-primary)">
                24 rooms
              </span>{" "}
              near you
            </span>
            <button className="flex items-center gap-1 text-[13px] text-(--color-brand-primary) font-medium cursor-pointer border border-(--color-border-default) rounded-full px-3 h-8 bg-transparent hover:bg-(--color-brand-primary-light) transition-colors">
              Sort by: Nearest
              <KeyboardArrowDownOutlinedIcon sx={{ fontSize: 16 }} />
            </button>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <div
                key={room.name}
                className="bg-(--color-bg-surface) rounded-2xl border border-(--color-border-default) overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
              >
                {/* Image zone */}
                <div className="relative h-44">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  />

                  {/* Shop logo overlay */}
                  <div
                    className="absolute bottom-0 left-3 translate-y-1/2 w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-md shrink-0"
                    style={{ backgroundColor: room.logoColor }}
                  >
                    {room.logoInitials}
                  </div>

                  {/* Distance badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm text-[11px] font-semibold text-(--color-text-primary) px-2 py-1 rounded-full">
                    <NearMeOutlinedIcon
                      sx={{ fontSize: 12, color: "var(--color-brand-primary)" }}
                    />
                    {room.distance}
                  </div>
                </div>

                {/* Card body */}
                <div className="px-4 pt-6 pb-4">
                  <div className="text-[15px] font-bold text-(--color-text-primary) mt-1">
                    {room.name}
                  </div>
                  <div className="text-[11px] uppercase tracking-widest text-(--color-text-hint) font-medium mt-0.5">
                    {room.category}
                  </div>

                  {/* Status row */}
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{
                          backgroundColor: room.active
                            ? "var(--color-online)"
                            : "#d1d5db",
                        }}
                      />
                      <span className="text-xs text-(--color-text-secondary)">
                        {room.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <PeopleOutlinedIcon
                        sx={{
                          fontSize: 13,
                          color: "var(--color-text-secondary)",
                        }}
                      />
                      <span className="text-xs text-(--color-text-secondary)">
                        {room.members} members
                      </span>
                    </div>
                  </div>

                  {/* Bottom row */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1">
                      <FavoriteBorderIcon
                        sx={{ fontSize: 15, color: "var(--color-danger)" }}
                      />
                      <span className="text-[13px] text-(--color-text-secondary)">
                        {formatHearts(room.hearts)}
                      </span>
                    </div>
                    <button className="h-9 px-5 bg-(--color-brand-primary) hover:bg-(--color-brand-primary-hover) text-white text-[13px] font-semibold rounded-xl border-0 cursor-pointer transition-colors">
                      Join Room
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Zone 3: Right Panel ── */}
      <aside className="w-72 min-w-72 bg-(--color-bg-surface) border-l border-(--color-border-default) flex flex-col overflow-hidden">
        {/* Map placeholder */}
        <div
          className="h-48 shrink-0 relative border-b border-(--color-border-default) overflow-hidden"
          style={{ backgroundColor: "#e8eaf0" }}
        >
          {/* Fake map grid lines */}
          <svg
            className="absolute inset-0 w-full h-full opacity-20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="grid"
                width="24"
                height="24"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 24 0 L 0 0 0 24"
                  fill="none"
                  stroke="#5b47d4"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Map dots */}
          {[
            { top: "30%", left: "45%" },
            { top: "50%", left: "62%" },
            { top: "42%", left: "28%" },
          ].map((pos, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                top: pos.top,
                left: pos.left,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="absolute w-5 h-5 rounded-full border-2 border-(--color-brand-primary) opacity-40 -inset-1 -top-1 -left-1" />
              <div className="w-3 h-3 rounded-full bg-(--color-brand-primary) relative z-10" />
            </div>
          ))}

          {/* Expand button */}
          <button className="absolute top-2 right-2 w-7 h-7 bg-white rounded-lg flex items-center justify-center shadow-sm cursor-pointer border-0">
            <OpenInFullOutlinedIcon
              sx={{ fontSize: 14, color: "var(--color-text-secondary)" }}
            />
          </button>

          {/* Location label */}
          <div
            className="absolute bottom-0 left-0 right-0 px-3 py-2 border-t border-(--color-border-default)"
            style={{ backgroundColor: "rgba(255,255,255,0.95)" }}
          >
            <div className="text-[10px] uppercase tracking-widest text-(--color-text-hint) font-medium">
              Active Search Area
            </div>
            <div className="text-[13px] font-semibold text-(--color-text-primary)">
              Bodakdev, Ahmedabad
            </div>
          </div>
        </div>

        {/* Most Popular This Week */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-(--color-text-primary)">
              Most Popular This Week
            </span>
            <StarOutlinedIcon sx={{ fontSize: 18, color: "#f59e0b" }} />
          </div>

          <ul className="list-none m-0 p-0">
            {trending.map((item, index) => (
              <li
                key={item.name}
                className="flex items-center gap-3 py-2.5 cursor-pointer hover:bg-(--color-bg-page) rounded-lg px-2 -mx-2 transition-colors"
              >
                <span className="w-4 text-[13px] font-bold text-(--color-text-hint) shrink-0 text-center">
                  {index + 1}
                </span>
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ backgroundColor: item.color }}
                >
                  {item.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-(--color-text-primary) truncate">
                    {item.name}
                  </div>
                  <div className="text-[11px] text-(--color-text-secondary)">
                    {item.members}
                  </div>
                </div>
                <ChevronRightOutlinedIcon
                  sx={{
                    fontSize: 16,
                    color: "var(--color-text-hint)",
                    flexShrink: 0,
                  }}
                />
              </li>
            ))}
          </ul>

          <button className="mt-4 w-full h-9 border border-(--color-border-default) rounded-xl text-[13px] font-semibold text-(--color-brand-primary) hover:bg-(--color-brand-primary-light) transition-colors cursor-pointer bg-transparent">
            View All Trending
          </button>
        </div>
      </aside>
    </div>
  );
}
