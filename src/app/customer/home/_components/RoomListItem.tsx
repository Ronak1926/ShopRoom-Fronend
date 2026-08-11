"use client";

import NearMeOutlinedIcon from "@mui/icons-material/NearMeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import Avatar from "@/components/ui/Avatar";
import StatusDot from "@/components/ui/StatusDot";
import { formatCount, type RoomCard as RoomCardData } from "../types";

type RoomListItemProps = {
  room: RoomCardData;
  joining: boolean;
  onJoin: (room: RoomCardData) => void;
};

export default function RoomListItem({ room, joining, onJoin }: RoomListItemProps) {
  return (
    <div className="flex items-center gap-4 bg-(--color-bg-surface) rounded-2xl border border-(--color-border-default) p-3 hover:shadow-(--shadow-lg) transition-shadow duration-200">
      <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden">
        {room.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={room.coverUrl} alt={room.shopName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-(--color-brand-primary-light) to-(--color-brand-primary-muted)" />
        )}
      </div>

      <Avatar name={room.shopName} src={room.logoUrl} size="md" className="shrink-0" />

      <div className="flex-1 min-w-0">
        <div className="text-[15px] font-bold text-(--color-text-primary) truncate">
          {room.shopName}
        </div>
        <div className="text-[11px] uppercase tracking-widest text-(--color-text-hint) font-semibold mt-0.5">
          {room.category}
        </div>
        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
          <div className="flex items-center gap-1.5">
            <StatusDot status={room.activeNow ? "online" : "offline"} size={7} />
            <span className="text-xs text-(--color-text-secondary)">
              {room.activeNow ? "Active now" : "Inactive"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <PeopleOutlinedIcon sx={{ fontSize: 13, color: "var(--color-text-secondary)" }} />
            <span className="text-xs text-(--color-text-secondary)">
              {formatCount(room.membersCount)} members
            </span>
          </div>
          <div className="flex items-center gap-1">
            <FavoriteBorderIcon sx={{ fontSize: 13, color: "var(--color-danger)" }} />
            <span className="text-xs text-(--color-text-secondary)">{formatCount(room.likes)}</span>
          </div>
          {room.distanceKm !== null && (
            <div className="flex items-center gap-1">
              <NearMeOutlinedIcon sx={{ fontSize: 13, color: "var(--color-brand-primary)" }} />
              <span className="text-xs text-(--color-text-secondary)">{room.distanceKm} km away</span>
            </div>
          )}
        </div>
      </div>

      {room.isJoined ? (
        <button
          onClick={() => onJoin(room)}
          className="h-9 px-4 flex items-center gap-1.5 bg-(--color-success-light) text-(--color-success-text) text-[13px] font-semibold rounded-xl border-0 cursor-pointer transition-colors hover:bg-(--color-badge-success-bg) shrink-0"
        >
          <CheckCircleOutlinedIcon sx={{ fontSize: 15 }} />
          Already in Room
        </button>
      ) : (
        <button
          onClick={() => onJoin(room)}
          disabled={joining}
          className="h-9 px-5 bg-(--color-brand-primary) hover:bg-(--color-brand-primary-hover) disabled:opacity-60 disabled:cursor-not-allowed text-white text-[13px] font-semibold rounded-xl border-0 cursor-pointer transition-colors shrink-0"
        >
          {joining ? "Joining..." : "Join Room"}
        </button>
      )}
    </div>
  );
}
