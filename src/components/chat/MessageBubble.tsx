import Avatar from "@/components/ui/Avatar";
import type { ChatMessage } from "@/hooks/useRoomChat";

interface MessageBubbleProps {
  message: ChatMessage;
  isOwnMessage: boolean;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function MessageBubble({ message, isOwnMessage }: MessageBubbleProps) {
  if (message.senderType === "SHOPKEEPER") {
    // Admin message — always left-aligned, visually distinct regardless of
    // which side of the chat is viewing it, per spec: shows shop name +
    // owner name above the bubble so it reads as an "official" message.
    return (
      <div className="flex items-start gap-3 max-w-xl">
        <Avatar name={message.sender.shopName ?? message.sender.name} size="md" />
        <div
          className="bg-(--color-msg-shopkeeper-bg) rounded-xl rounded-tl-none px-4 py-3 flex-1"
          style={{ borderLeft: "3px solid var(--color-msg-shopkeeper-border)" }}
        >
          <div className="flex items-baseline gap-2 mb-1 flex-wrap">
            <span className="text-[13px] font-bold text-(--color-brand-primary)">
              {message.sender.shopName}
            </span>
            <span className="text-[11px] text-(--color-text-secondary)">
              {message.sender.name}
            </span>
            <span className="text-[11px] text-(--color-text-hint)">
              {formatTime(message.createdAt)}
            </span>
          </div>
          <p className="text-sm text-(--color-text-primary) leading-relaxed m-0 whitespace-pre-wrap break-words">
            {message.text}
          </p>
        </div>
      </div>
    );
  }

  if (isOwnMessage) {
    return (
      <div className="flex items-end gap-2 justify-end">
        <div className="flex flex-col items-end gap-1">
          <div className="bg-(--color-msg-customer-bg) rounded-xl rounded-tr-none px-4 py-2.5 max-w-sm">
            <p className="text-sm text-(--color-text-primary) leading-relaxed m-0 whitespace-pre-wrap break-words">
              {message.text}
            </p>
            <div className="text-[11px] text-(--color-text-hint) text-right mt-1">
              {formatTime(message.createdAt)}
            </div>
          </div>
        </div>
        <Avatar name={message.sender.name} size="sm" className="mb-1" />
      </div>
    );
  }

  // Another customer's message
  return (
    <div className="flex items-end gap-2">
      <Avatar name={message.sender.name} size="sm" className="mb-1" />
      <div className="flex flex-col items-start gap-1">
        <span className="text-[11px] text-(--color-text-hint) pl-1">
          {message.sender.name}
        </span>
        <div className="bg-(--color-msg-other-bg) border border-(--color-border-default) rounded-xl rounded-tl-none px-4 py-2.5 max-w-sm">
          <p className="text-sm text-(--color-text-primary) leading-relaxed m-0 whitespace-pre-wrap break-words">
            {message.text}
          </p>
          <div className="text-[11px] text-(--color-text-hint) mt-1">
            {formatTime(message.createdAt)}
          </div>
        </div>
      </div>
    </div>
  );
}
