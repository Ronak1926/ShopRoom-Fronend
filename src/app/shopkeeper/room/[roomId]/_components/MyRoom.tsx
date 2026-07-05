"use client";

import { useEffect, useState } from "react";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import Avatar from "@/components/ui/Avatar";
import MessageFeed from "@/components/chat/MessageFeed";
import Composer from "@/components/chat/Composer";
import { useRoomChat } from "@/hooks/useRoomChat";
import { apiClient } from "@/utils/apiClient";
import { getCookie } from "@/utils/cookieUtils";

interface MyRoomProps {
  roomId: string;
  shopName: string;
  logoUrl: string | null;
  membersCount: number;
}

interface MemberRow {
  id: string;
  customerId: string;
  customerName: string;
}

export default function MyRoom({ roomId, shopName, logoUrl, membersCount }: MyRoomProps) {
  const [activeTab, setActiveTab] = useState("Members");
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [memberSearch, setMemberSearch] = useState("");
  const {
    messages,
    typingUsers,
    onlineCustomerIds,
    loading,
    sendMessage,
    notifyTyping,
  } = useRoomChat(roomId, "shopkeeper");

  const tabs = ["Room Info", "Members", "Pinned"];

  useEffect(() => {
    const token = getCookie("shopkeeper_token");
    if (!token) return;
    apiClient
      .get<{ members: MemberRow[] }>("/api/shop/members", {
        params: { page: 0, limit: 100 },
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMembers(res.data.members))
      .catch(() => {});
  }, []);

  const filteredMembers = members.filter((m) =>
    m.customerName.toLowerCase().includes(memberSearch.toLowerCase()),
  );
  const onlineIds = new Set(onlineCustomerIds);
  const onlineMembers = filteredMembers.filter((m) => onlineIds.has(m.customerId));
  const offlineMembers = filteredMembers.filter((m) => !onlineIds.has(m.customerId));

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
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              placeholder="Search members..."
              className="w-full h-9 bg-(--color-bg-page) border border-(--color-border-default) rounded-lg pl-8 pr-3 text-sm text-(--color-text-primary) placeholder:text-(--color-text-hint) outline-none focus:border-(--color-brand-primary) transition-colors"
            />
          </div>
        </div>

        {/* Member List */}
        <div className="overflow-y-auto flex-1">
          <div className="px-4 py-2 mt-2">
            <span className="text-[11px] uppercase tracking-widest text-(--color-text-hint) font-semibold">
              Online — {onlineMembers.length}
            </span>
          </div>
          {onlineMembers.map((m) => (
            <div
              key={m.id}
              className="flex items-center gap-3 px-4 h-12 hover:bg-(--color-bg-page) cursor-pointer transition-colors"
            >
              <Avatar name={m.customerName} size="sm" status="online" />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-(--color-text-primary) truncate leading-tight">
                  {m.customerName}
                </div>
                <div className="text-[11px] text-(--color-text-hint) truncate">
                  Active now
                </div>
              </div>
            </div>
          ))}

          <div className="px-4 py-2 mt-2">
            <span className="text-[11px] uppercase tracking-widest text-(--color-text-hint) font-semibold">
              Offline — {offlineMembers.length}
            </span>
          </div>
          {offlineMembers.map((m) => (
            <div
              key={m.id}
              className="flex items-center gap-3 px-4 h-12 hover:bg-(--color-bg-page) cursor-pointer transition-colors"
            >
              <Avatar name={m.customerName} size="sm" status="offline" />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-(--color-text-primary) truncate leading-tight">
                  {m.customerName}
                </div>
              </div>
            </div>
          ))}

          {members.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-(--color-text-hint)">
              No members yet. Share your invite link to get started!
            </div>
          )}
        </div>
      </aside>

      {/* ── Panel 2: Chat Area ── */}
      <div className="flex-1 flex flex-col bg-(--color-bg-page) min-w-0">
        {/* Chat Top Bar */}
        <div className="h-14 bg-(--color-bg-surface) border-b border-(--color-border-default) px-5 flex items-center gap-4 shrink-0">
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-bold text-(--color-text-primary) leading-tight">
              Shop Room Chat
            </div>
            <div className="text-xs text-(--color-text-secondary) mt-0.5">
              {shopName} · {membersCount} members
            </div>
          </div>

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
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border-0 bg-transparent cursor-pointer text-(--color-text-secondary) hover:bg-(--color-bg-page) hover:text-(--color-text-primary) transition-colors ml-1">
              <NotificationsNoneOutlinedIcon sx={{ fontSize: 20 }} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border-0 bg-transparent cursor-pointer text-(--color-text-secondary) hover:bg-(--color-bg-page) hover:text-(--color-text-primary) transition-colors">
              <MoreVertOutlinedIcon sx={{ fontSize: 20 }} />
            </button>
          </div>
        </div>

        <MessageFeed
          messages={messages}
          typingUsers={typingUsers}
          loading={loading}
          isOwnMessage={(m) => m.senderType === "SHOPKEEPER"}
          emptyHint="No messages yet — say hello to your room!"
        />

        <Composer
          onSend={sendMessage}
          onTyping={notifyTyping}
          hint="Messages: Unlimited"
          extraAction={
            <button className="h-9 px-4 rounded-xl text-[13px] font-bold text-white border-0 cursor-pointer transition-opacity hover:opacity-90 shrink-0 flex items-center gap-1.5 bg-(--color-brand-alert)">
              <BoltOutlinedIcon sx={{ fontSize: 16 }} />
              Send Alert
            </button>
          }
        />
      </div>
    </div>
  );
}
