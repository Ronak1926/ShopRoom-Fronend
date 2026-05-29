"use client";

import { useState } from "react";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";

interface MyRoomProps {
  shopName: string;
  logoUrl: string | null;
  membersCount: number;
  inviteLink?: string;
  onShareClick?: () => void;
}

const onlineMembers = [
  { name: "Ananya Sharma", status: "Active now", online: true },
  { name: "Rahul Verma", status: "Typing...", online: true },
  { name: "Priya K.", status: "Active now", online: true },
];

const offlineMembers = [
  { name: "Meera K.", status: "Last seen 2h ago", online: false },
  { name: "Rohit S.", status: "Last seen 1d ago", online: false },
];

const messages = [
  {
    type: "shopkeeper",
    sender: "ShopOwner",
    time: "11:32 AM",
    text: "Good morning everyone! We just received the new seasonal collection. I've attached the stock alert below for those interested in the first pick.",
  },
  {
    type: "customer",
    sender: "Ananya Sharma",
    time: "10:42 AM",
    text: "The designs look amazing! Do you have these in size M available? I'd love to drop by today.",
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function MyRoom({ shopName, logoUrl, membersCount, inviteLink: _inviteLink, onShareClick: _onShareClick }: MyRoomProps) {
  const [activeTab, setActiveTab] = useState("Members");
  const [message, setMessage] = useState("");

  const tabs = ["Room Info", "Members", "Pinned"];

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* ── Panel 1: Member List ── */}
      <aside className="w-70 min-w-70 bg-(--color-bg-surface) border-r border-(--color-border-default) flex flex-col">
        {/* Room Info Header */}
        <div className="h-16 flex items-center gap-3 px-4 border-b border-(--color-border-default) shrink-0">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt={shopName}
              className="w-9 h-9 rounded-lg object-cover shrink-0"
            />
          ) : (
            <div className="bg-(--color-brand-primary-light) rounded-lg p-1.5 shrink-0">
              <StorefrontOutlinedIcon
                sx={{ fontSize: 22, color: "var(--color-brand-primary)" }}
              />
            </div>
          )}
          <div className="min-w-0">
            <div className="text-sm font-bold text-(--color-text-primary) truncate leading-tight">
              {shopName || "Shop Room"}
            </div>
            <div className="text-xs text-(--color-text-secondary) mt-0.5">
              {membersCount} members
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-3 py-2.5 shrink-0">
          <div className="relative">
            <SearchOutlinedIcon
              sx={{ fontSize: 16, color: "var(--color-text-secondary)" }}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search members..."
              className="w-full h-9 bg-(--color-bg-page) border border-(--color-border-default) rounded-lg pl-8 pr-3 text-sm text-(--color-text-primary) placeholder:text-(--color-text-hint) outline-none focus:border-(--color-brand-primary) transition-colors"
            />
          </div>
        </div>

        {/* Member List */}
        <div className="overflow-y-auto flex-1">
          {/* Online Section */}
          <div className="px-4 py-2 mt-2">
            <span className="text-[11px] uppercase tracking-widest text-(--color-text-hint) font-medium">
              Online — 14
            </span>
          </div>
          {onlineMembers.map((member) => (
            <div
              key={member.name}
              className="flex items-center gap-3 px-4 h-12 hover:bg-(--color-bg-page) cursor-pointer transition-colors"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-(--color-text-secondary)"
                style={{ backgroundColor: "#e8e8f0" }}
              >
                {getInitials(member.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-(--color-text-primary) truncate leading-tight">
                  {member.name}
                </div>
                <div className="text-[11px] text-(--color-text-hint) truncate">
                  {member.status}
                </div>
              </div>
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: "#22c55e" }}
              />
            </div>
          ))}

          {/* Offline Section */}
          <div className="px-4 py-2 mt-2">
            <span className="text-[11px] uppercase tracking-widest text-(--color-text-hint) font-medium">
              Offline — 298
            </span>
          </div>
          {offlineMembers.map((member) => (
            <div
              key={member.name}
              className="flex items-center gap-3 px-4 h-12 hover:bg-(--color-bg-page) cursor-pointer transition-colors"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-(--color-text-secondary)"
                style={{ backgroundColor: "#e8e8f0" }}
              >
                {getInitials(member.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-(--color-text-primary) truncate leading-tight">
                  {member.name}
                </div>
                <div className="text-[11px] text-(--color-text-hint) truncate">
                  {member.status}
                </div>
              </div>
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: "#d1d5db" }}
              />
            </div>
          ))}
        </div>
      </aside>

      {/* ── Panel 2: Chat Area ── */}
      <div className="flex-1 flex flex-col bg-(--color-bg-page) min-w-0">
        {/* Chat Top Bar */}
        <div className="h-14 bg-(--color-bg-surface) border-b border-(--color-border-default) px-5 flex items-center gap-4 shrink-0">
          {/* Left: title + subtitle */}
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-bold text-(--color-text-primary) leading-tight">
              Shop Room Chat
            </div>
            <div className="text-xs text-(--color-text-secondary) mt-0.5">
              {shopName} · {membersCount} members
            </div>
          </div>

          {/* Right: tabs + icons */}
          <div className="flex items-center gap-1 shrink-0">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 text-[13px] rounded-md border-0 bg-transparent cursor-pointer transition-colors ${
                  activeTab === tab
                    ? "text-(--color-brand-primary) font-semibold border-b-2 border-(--color-brand-primary)"
                    : "text-(--color-text-secondary) hover:text-(--color-text-primary)"
                }`}
              >
                {tab}
              </button>
            ))}
            <NotificationsNoneOutlinedIcon
              sx={{ fontSize: 20, color: "var(--color-text-secondary)", cursor: "pointer", marginLeft: "8px" }}
              className="hover:text-(--color-text-primary) transition-colors"
            />
            <MoreVertOutlinedIcon
              sx={{ fontSize: 20, color: "var(--color-text-secondary)", cursor: "pointer", marginLeft: "4px" }}
              className="hover:text-(--color-text-primary) transition-colors"
            />
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
          {/* Date Separator */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-(--color-border-default)" />
            <span className="text-xs text-(--color-text-hint) whitespace-nowrap">
              Today, October 24th
            </span>
            <div className="flex-1 h-px bg-(--color-border-default)" />
          </div>

          {/* Messages */}
          {messages.map((msg, i) =>
            msg.type === "shopkeeper" ? (
              /* Shopkeeper message — left-aligned */
              <div key={i} className="flex items-start gap-3 max-w-xl">
                <div className="w-9 h-9 rounded-full bg-(--color-brand-primary) flex items-center justify-center text-white text-sm font-bold shrink-0">
                  S
                </div>
                <div
                  className="bg-(--color-bg-surface) rounded-xl rounded-tl-none px-4 py-3 border border-(--color-border-default) flex-1"
                  style={{ borderLeft: "3px solid var(--color-brand-primary)" }}
                >
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-[13px] font-bold text-(--color-brand-primary)">
                      {msg.sender}
                    </span>
                    <span className="text-[11px] text-(--color-text-hint)">
                      {msg.time}
                    </span>
                  </div>
                  <p className="text-sm text-(--color-text-primary) leading-relaxed m-0">
                    {msg.text}
                  </p>
                </div>
              </div>
            ) : (
              /* Customer message — right-aligned */
              <div key={i} className="flex items-end gap-2 justify-end">
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[11px] text-(--color-text-hint) pr-1">
                    {msg.sender}
                  </span>
                  <div className="bg-(--color-bg-surface) border border-(--color-border-default) rounded-xl rounded-tr-none px-4 py-2.5 max-w-sm">
                    <p className="text-sm text-(--color-text-primary) leading-relaxed m-0">
                      {msg.text}
                    </p>
                    <div className="text-[11px] text-(--color-text-hint) text-right mt-1">
                      {msg.time}
                    </div>
                  </div>
                </div>
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-(--color-text-secondary) shrink-0 mb-6"
                  style={{ backgroundColor: "#e8e8f0" }}
                >
                  {getInitials(msg.sender)}
                </div>
              </div>
            )
          )}

          {/* Typing Indicator */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span
                className="w-1.5 h-1.5 rounded-full bg-(--color-text-hint) animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full bg-(--color-text-hint) animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full bg-(--color-text-hint) animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
            <span className="text-xs italic text-(--color-text-hint)">
              Rahul Verma is typing...
            </span>
          </div>
        </div>

        {/* Message Composer */}
        <div className="bg-(--color-bg-surface) border-t border-(--color-border-default) px-4 py-3 shrink-0">
          <div className="flex items-center gap-2">
            {/* Left icons */}
            <EmojiEmotionsOutlinedIcon
              sx={{ fontSize: 20, color: "var(--color-text-secondary)", cursor: "pointer", flexShrink: 0 }}
              className="hover:text-(--color-text-primary) transition-colors"
            />
            <AttachFileOutlinedIcon
              sx={{ fontSize: 20, color: "var(--color-text-secondary)", cursor: "pointer", flexShrink: 0, transform: "rotate(45deg)" }}
              className="hover:text-(--color-text-primary) transition-colors"
            />

            {/* Input + hint */}
            <div className="flex-1 flex flex-col gap-0.5">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="w-full h-10 bg-(--color-bg-page) border border-(--color-border-default) rounded-xl px-4 text-sm text-(--color-text-primary) placeholder:text-(--color-text-hint) outline-none focus:border-(--color-brand-primary) transition-colors"
              />
              <span className="text-[11px] text-(--color-text-hint) text-center">
                Messages: Unlimited
              </span>
            </div>

            {/* Right buttons */}
            <button
              className="h-9 px-4 rounded-xl text-[13px] font-bold text-white border-0 cursor-pointer transition-opacity hover:opacity-90 shrink-0"
              style={{ backgroundColor: "var(--color-brand-alert)" }}
            >
              ⚡ Send Alert
            </button>
            <button
              className="w-9 h-9 rounded-full bg-(--color-brand-primary) hover:bg-(--color-brand-primary-hover) text-white border-0 cursor-pointer flex items-center justify-center transition-colors shrink-0 ml-0.5"
            >
              <SendOutlinedIcon sx={{ fontSize: 18 }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
