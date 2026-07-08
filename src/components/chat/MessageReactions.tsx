"use client";

import type { MessageReactionData } from "@/hooks/useRoomChat";

interface MessageReactionsProps {
  reactions: MessageReactionData[];
  currentViewerId: string | null;
  onToggle: (emoji: string) => void;
}

interface ReactionGroup {
  emoji: string;
  count: number;
  mine: boolean;
}

/** Groups the flat per-reaction list (as broadcast by the server, which
 * can't customize a payload per recipient) into emoji pills, computing
 * "mine" the same way isOwnMessage is already computed client-side. */
function groupReactions(
  reactions: MessageReactionData[],
  currentViewerId: string | null,
): ReactionGroup[] {
  const groups = new Map<string, ReactionGroup>();
  for (const r of reactions) {
    const existing = groups.get(r.emoji);
    const mine = currentViewerId !== null && r.viewerId === currentViewerId;
    if (existing) {
      existing.count += 1;
      existing.mine = existing.mine || mine;
    } else {
      groups.set(r.emoji, { emoji: r.emoji, count: 1, mine });
    }
  }
  return Array.from(groups.values());
}

export default function MessageReactions({
  reactions,
  currentViewerId,
  onToggle,
}: MessageReactionsProps) {
  if (reactions.length === 0) return null;
  const groups = groupReactions(reactions, currentViewerId);

  return (
    <div className="flex flex-wrap gap-1 px-1">
      {groups.map((g) => (
        <button
          key={g.emoji}
          type="button"
          onClick={() => onToggle(g.emoji)}
          className={`flex items-center gap-1 h-6 px-2 rounded-full text-[12px] border cursor-pointer transition-colors ${
            g.mine
              ? "bg-(--color-brand-primary-light) border-(--color-brand-primary) text-(--color-brand-primary)"
              : "bg-(--color-bg-surface) border-(--color-border-default) text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover)"
          }`}
        >
          <span>{g.emoji}</span>
          {g.count > 1 && <span className="font-semibold">{g.count}</span>}
        </button>
      ))}
    </div>
  );
}
