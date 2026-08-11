"use client";

import { useState } from "react";
import NearMeOutlinedIcon from "@mui/icons-material/NearMeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined";
import Avatar from "@/components/ui/Avatar";
import StatusDot from "@/components/ui/StatusDot";
import { formatCount, type RoomCard as RoomCardData } from "../types";

type RoomCardProps = {
  room: RoomCardData;
  joining: boolean;
  onJoin: (room: RoomCardData) => void;
};

export default function RoomCard({ room, joining, onJoin }: RoomCardProps) {
  const [saved, setSaved] = useState(false);

  return (
    <div className="bg-(--color-bg-surface) rounded-2xl border border-(--color-border-default) overflow-hidden cursor-pointer hover:shadow-(--shadow-lg) hover:-translate-y-0.5 transition-all duration-200 group">
      {/* Image zone */}
      <div className="relative h-44">
        {room.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={room.coverUrl}
            alt={room.shopName}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-(--color-brand-primary-light) to-(--color-brand-primary-muted)" />
        )}

        {/* Shop logo overlay */}
        <div className="absolute bottom-0 left-4 translate-y-1/2">
          <Avatar
            name={room.shopName}
            src={room.logoUrl}
            size="lg"
            className="border-[3px] border-(--color-bg-surface) shadow-(--shadow-md)"
          />
        </div>

        {/* Distance badge */}
        {room.distanceKm !== null && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm text-[11px] font-semibold text-(--color-text-primary) px-2 py-1 rounded-full shadow-(--shadow-xs)">
            <NearMeOutlinedIcon sx={{ fontSize: 12, color: "var(--color-brand-primary)" }} />
            {room.distanceKm} km away
          </div>
        )}

        {/* Bookmark toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSaved((s) => !s);
          }}
          aria-label={saved ? "Remove bookmark" : "Bookmark room"}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-(--shadow-xs) border-0 cursor-pointer transition-colors"
        >
          {saved ? (
            <BookmarkOutlinedIcon sx={{ fontSize: 17, color: "var(--color-brand-primary)" }} />
          ) : (
            <BookmarkBorderOutlinedIcon sx={{ fontSize: 17, color: "var(--color-text-secondary)" }} />
          )}
        </button>
      </div>

      {/* Card body */}
      <div className="px-4 pt-7 pb-4">
        <div className="text-[15px] font-bold text-(--color-text-primary) mt-1 truncate">
          {room.shopName}
        </div>
        <div className="text-[11px] uppercase tracking-widest text-(--color-text-hint) font-semibold mt-0.5">
          {room.category}
        </div>
        <div className="flex items-center gap-3 mt-2.5">
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
        </div>
        <div className="flex items-center justify-between mt-3.5 pt-3.5 border-t border-(--color-border-default)">
          <div className="flex items-center gap-1">
            <FavoriteBorderIcon sx={{ fontSize: 15, color: "var(--color-danger)" }} />
            <span className="text-[13px] text-(--color-text-secondary)">
              {formatCount(room.likes)}
            </span>
          </div>
          {room.isJoined ? (
            <button
              onClick={() => onJoin(room)}
              className="h-9 px-4 flex items-center gap-1.5 bg-(--color-success-light) text-(--color-success-text) text-[13px] font-semibold rounded-xl border-0 cursor-pointer transition-colors hover:bg-(--color-badge-success-bg)"
            >
              <CheckCircleOutlinedIcon sx={{ fontSize: 15 }} />
              Already in Room
            </button>
          ) : (
            <button
              onClick={() => onJoin(room)}
              disabled={joining}
              className="h-9 px-5 bg-(--color-brand-primary) hover:bg-(--color-brand-primary-hover) disabled:opacity-60 disabled:cursor-not-allowed text-white text-[13px] font-semibold rounded-xl border-0 cursor-pointer transition-colors"
            >
              {joining ? "Joining..." : "Join Room"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
