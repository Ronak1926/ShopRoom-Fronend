import Avatar from "@/components/ui/Avatar";
import type { ChatTab, RoomDetails } from "./types";

interface ChatHeaderProps {
  room: RoomDetails;
  activeTab: ChatTab;
  onTabChange: (tab: ChatTab) => void;
}

const TABS: { id: ChatTab; label: string }[] = [
  { id: "info", label: "Room Info" },
  { id: "members", label: "Members" },
];

/** The one chat top bar, identical for the customer and shopkeeper room
 * views. Shop identity doubles as the way back to the message feed; the
 * tabs on the right swap the page's main content pane in place — no modal,
 * no navigation. */
export default function ChatHeader({ room, activeTab, onTabChange }: ChatHeaderProps) {
  return (
    <div className="h-16 bg-(--color-bg-surface) border-b border-(--color-border-default) px-5 flex items-center gap-4 shrink-0">
      <button
        onClick={() => onTabChange("chat")}
        title="Back to chat"
        className="flex items-center gap-3 bg-transparent border-0 cursor-pointer text-left shrink-0 min-w-0"
      >
        <Avatar name={room.shopName} src={room.logoUrl} size="md" />
        <div className="min-w-0">
          <div className="text-[16px] font-bold text-(--color-text-primary) leading-tight truncate">
            {room.shopName}
          </div>
          <div className="text-xs text-(--color-text-secondary) mt-0.5">
            {room.membersCount} members
          </div>
        </div>
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-1 shrink-0">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-3 h-16 text-[13px] border-0 border-b-2 bg-transparent cursor-pointer transition-colors ${
              activeTab === tab.id
                ? "text-(--color-brand-primary) font-semibold border-(--color-brand-primary)"
                : "text-(--color-text-secondary) border-transparent hover:text-(--color-text-primary)"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
