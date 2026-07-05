import type { TypingUser } from "@/hooks/useRoomChat";

interface TypingIndicatorProps {
  typingUsers: TypingUser[];
}

function typingText(users: TypingUser[]): string {
  if (users.length === 1) return `${users[0].name} is typing...`;
  if (users.length === 2) return `${users[0].name} and ${users[1].name} are typing...`;
  return `${users.length} people are typing...`;
}

export default function TypingIndicator({ typingUsers }: TypingIndicatorProps) {
  if (typingUsers.length === 0) return null;

  return (
    <div className="flex items-center gap-2 px-1 h-5">
      <div className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-(--color-text-hint) animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-1.5 h-1.5 rounded-full bg-(--color-text-hint) animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="w-1.5 h-1.5 rounded-full bg-(--color-text-hint) animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
      <span className="text-xs italic text-(--color-text-hint)">{typingText(typingUsers)}</span>
    </div>
  );
}
