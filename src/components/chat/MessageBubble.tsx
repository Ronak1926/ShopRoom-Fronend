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
  const isAdmin = message.senderType === "SHOPKEEPER";
  const avatarName = isAdmin ? (message.sender.shopName ?? message.sender.name) : message.sender.name;
  const avatarSize = isAdmin ? "md" : "sm";

  // Your own message is always the solid blue bubble, whichever role you are.
  // Every *received* message — an admin's or another customer's — gets the
  // same white bubble + blue left accent strip, so a shopkeeper looking at a
  // customer's message reads as consistently "intentional" as a customer
  // looking at the shop's message, not a different, unstyled default.
  const bubbleClass = isOwnMessage
    ? "bg-(--color-brand-primary) text-white"
    : "bg-(--color-bg-surface) text-(--color-text-primary) shadow-(--shadow-sm)";

  const accentBorder = !isOwnMessage
    ? { borderLeft: "3px solid var(--color-brand-primary)" }
    : undefined;

  return (
    <div className={`flex items-end gap-2 ${isOwnMessage ? "justify-end" : "justify-start"}`}>
      {!isOwnMessage && <Avatar name={avatarName} size={avatarSize} className="mb-1" />}

      <div className={`flex flex-col gap-1 max-w-sm ${isOwnMessage ? "items-end" : "items-start"}`}>
        {(isAdmin || !isOwnMessage) && (
          <div className="flex items-baseline gap-2 px-1 flex-wrap">
            {isAdmin ? (
              <>
                <span className="text-[13px] font-bold text-(--color-brand-primary)">
                  {message.sender.shopName}
                </span>
                <span className="text-[11px] text-(--color-text-secondary)">
                  {message.sender.name}
                </span>
              </>
            ) : (
              <span className="text-[11px] text-(--color-text-hint)">{message.sender.name}</span>
            )}
          </div>
        )}

        <div
          className={`${bubbleClass} rounded-xl px-4 py-2.5 ${isOwnMessage ? "rounded-tr-none" : "rounded-tl-none"}`}
          style={accentBorder}
        >
          <p className="text-sm leading-relaxed m-0 whitespace-pre-wrap wrap-break-word">
            {message.text}
          </p>
          <div
            className={`text-[11px] mt-1 ${
              isOwnMessage ? "text-right text-white/70" : "text-(--color-text-hint)"
            }`}
          >
            {formatTime(message.createdAt)}
          </div>
        </div>
      </div>

      {isOwnMessage && <Avatar name={avatarName} size={avatarSize} className="mb-1" />}
    </div>
  );
}
