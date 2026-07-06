"use client";

import { useState } from "react";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import ChatHeader from "@/components/chat/ChatHeader";
import RoomInfoPanel from "@/components/chat/RoomInfoPanel";
import MembersPanel from "@/components/chat/MembersPanel";
import MessageFeed from "@/components/chat/MessageFeed";
import Composer from "@/components/chat/Composer";
import { useRoomChat } from "@/hooks/useRoomChat";
import type { ChatTab, RoomDetails } from "@/components/chat/types";

interface MyRoomProps {
  room: RoomDetails;
}

export default function MyRoom({ room }: MyRoomProps) {
  const [activeTab, setActiveTab] = useState<ChatTab>("chat");
  const {
    messages,
    typingUsers,
    onlineCustomerIds,
    loading,
    sendMessage,
    notifyTyping,
  } = useRoomChat(room.roomId, "shopkeeper");

  return (
    <div className="flex-1 flex flex-col bg-(--color-bg-page) min-w-0">
      <ChatHeader room={room} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "chat" && (
        <>
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
            extraAction={
              <button className="h-9 px-4 rounded-xl text-[13px] font-bold text-white border-0 cursor-pointer transition-opacity hover:opacity-90 shrink-0 flex items-center gap-1.5 bg-(--color-brand-alert)">
                <BoltOutlinedIcon sx={{ fontSize: 16 }} />
                Send Alert
              </button>
            }
          />
        </>
      )}

      {activeTab === "info" && <RoomInfoPanel room={room} />}

      {activeTab === "members" && (
        <MembersPanel roomId={room.roomId} role="shopkeeper" onlineCustomerIds={onlineCustomerIds} />
      )}
    </div>
  );
}
