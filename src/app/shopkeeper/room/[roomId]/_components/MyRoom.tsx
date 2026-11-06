"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import ChatHeader from "@/components/chat/ChatHeader";
import RoomInfoPanel from "@/components/chat/RoomInfoPanel";
import MembersPanel from "@/components/chat/MembersPanel";
import MessageFeed from "@/components/chat/MessageFeed";
import Composer from "@/components/chat/Composer";
import { useRoomChat, type ChatMessage } from "@/hooks/useRoomChat";
import { signedInAccountId } from "@/utils/session";
import type { ChatTab, RoomDetails } from "@/components/chat/types";

interface MyRoomProps {
  room: RoomDetails;
}

export default function MyRoom({ room }: MyRoomProps) {
  const [activeTab, setActiveTab] = useState<ChatTab>("chat");
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const myShopkeeperId = useMemo(() => signedInAccountId("shopkeeper"), []);
  const {
    messages,
    typingUsers,
    onlineCustomerIds,
    seenIneligibleIds,
    loading,
    sendMessage,
    notifyTyping,
    editMessage,
    deleteMessage,
    reactToMessage,
    clearChat,
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
            currentViewerId={myShopkeeperId}
            seenIneligibleIds={seenIneligibleIds}
            onReply={setReplyingTo}
            onEdit={editMessage}
            onDelete={deleteMessage}
            onReact={reactToMessage}
            emptyHint="No messages yet — say hello to your room!"
          />
          <Composer
            onSend={sendMessage}
            onTyping={notifyTyping}
            replyingTo={replyingTo}
            onCancelReply={() => setReplyingTo(null)}
            extraAction={
              <Link
                href="/shopkeeper/notifications/send"
                className="h-9 px-4 rounded-xl text-[13px] font-bold text-white transition-opacity hover:opacity-90 shrink-0 flex items-center gap-1.5 bg-(--color-brand-alert)"
              >
                <BoltOutlinedIcon sx={{ fontSize: 16 }} />
                Send Alert
              </Link>
            }
          />
        </>
      )}

      {activeTab === "info" && <RoomInfoPanel room={room} onClearChat={clearChat} />}

      {activeTab === "members" && (
        <MembersPanel roomId={room.roomId} role="shopkeeper" onlineCustomerIds={onlineCustomerIds} />
      )}
    </div>
  );
}
