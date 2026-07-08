"use client";

import { useMemo, useState } from "react";
import ChatHeader from "@/components/chat/ChatHeader";
import RoomInfoPanel from "@/components/chat/RoomInfoPanel";
import MembersPanel from "@/components/chat/MembersPanel";
import MessageFeed from "@/components/chat/MessageFeed";
import Composer from "@/components/chat/Composer";
import { useRoomChat, type ChatMessage } from "@/hooks/useRoomChat";
import { getCookie } from "@/utils/cookieUtils";
import type { ChatTab, RoomDetails } from "@/components/chat/types";

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
  const [activeTab, setActiveTab] = useState<ChatTab>("chat");
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const myCustomerId = useMemo(() => decodeCustomerId(), []);
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
  } = useRoomChat(room.roomId, "customer");

  return (
    <div className="flex-1 flex flex-col bg-(--color-bg-page) min-w-0">
      <ChatHeader room={room} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "chat" && (
        <>
          <MessageFeed
            messages={messages}
            typingUsers={typingUsers}
            loading={loading}
            isOwnMessage={(m) => m.senderType === "CUSTOMER" && m.sender.id === myCustomerId}
            currentViewerId={myCustomerId}
            seenIneligibleIds={seenIneligibleIds}
            onReply={setReplyingTo}
            onEdit={editMessage}
            onDelete={deleteMessage}
            onReact={reactToMessage}
            emptyHint={`Say hello to ${room.shopName}!`}
          />
          <Composer
            onSend={sendMessage}
            onTyping={notifyTyping}
            replyingTo={replyingTo}
            onCancelReply={() => setReplyingTo(null)}
            placeholder="Ask the shop anything..."
          />
        </>
      )}

      {activeTab === "info" && <RoomInfoPanel room={room} onClearChat={clearChat} />}

      {activeTab === "members" && (
        <MembersPanel roomId={room.roomId} role="customer" onlineCustomerIds={onlineCustomerIds} />
      )}
    </div>
  );
}
