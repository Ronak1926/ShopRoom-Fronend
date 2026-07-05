"use client";

import { useMemo } from "react";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import MessageFeed from "@/components/chat/MessageFeed";
import Composer from "@/components/chat/Composer";
import Avatar from "@/components/ui/Avatar";
import { useRoomChat } from "@/hooks/useRoomChat";
import { getCookie } from "@/utils/cookieUtils";

export interface RoomDetails {
  roomId: string;
  shopName: string;
  logoUrl: string | null;
  category: string;
  membersCount: number;
}

function decodeCustomerId(): string | null {
  const token = getCookie("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1])) as { sub?: unknown };
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}

export default function CustomerRoom({ room }: { room: RoomDetails }) {
  const myCustomerId = useMemo(() => decodeCustomerId(), []);
  const {
    messages,
    typingUsers,
    loading,
    sendMessage,
    notifyTyping,
  } = useRoomChat(room.roomId, "customer");

  return (
    <div className="flex-1 flex flex-col bg-(--color-bg-page) min-w-0">
      {/* Top bar */}
      <div className="h-14 bg-(--color-bg-surface) border-b border-(--color-border-default) px-5 flex items-center gap-3 shrink-0">
        <Avatar name={room.shopName} src={room.logoUrl} size="sm" />
        <div className="flex-1 min-w-0">
          <div className="text-[15px] font-bold text-(--color-text-primary) leading-tight truncate">
            {room.shopName}
          </div>
          <div className="text-xs text-(--color-text-secondary) mt-0.5">
            {room.membersCount} members
          </div>
        </div>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg border-0 bg-transparent cursor-pointer text-(--color-text-secondary) hover:bg-(--color-bg-page) hover:text-(--color-text-primary) transition-colors">
          <MoreVertOutlinedIcon sx={{ fontSize: 20 }} />
        </button>
      </div>

      <MessageFeed
        messages={messages}
        typingUsers={typingUsers}
        loading={loading}
        isOwnMessage={(m) => m.senderType === "CUSTOMER" && m.sender.id === myCustomerId}
        emptyHint={`Say hello to ${room.shopName}!`}
      />

      <Composer
        onSend={sendMessage}
        onTyping={notifyTyping}
        placeholder="Ask the shop anything..."
        hint="Shopkeeper typically replies within a few hours"
      />
    </div>
  );
}
