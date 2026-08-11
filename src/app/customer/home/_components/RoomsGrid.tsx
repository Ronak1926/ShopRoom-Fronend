"use client";

import SearchOffOutlinedIcon from "@mui/icons-material/SearchOffOutlined";
import RoomCard from "./RoomCard";
import RoomListItem from "./RoomListItem";
import type { RoomCard as RoomCardData, ViewMode } from "../types";

type RoomsGridProps = {
  rooms: RoomCardData[];
  loading: boolean;
  loadingMore: boolean;
  viewMode: ViewMode;
  joiningRoomId: string | null;
  searchQuery: string;
  onJoin: (room: RoomCardData) => void;
};

function GridSkeletonCard() {
  return (
    <div className="bg-(--color-bg-surface) rounded-2xl border border-(--color-border-default) overflow-hidden animate-pulse">
      <div className="h-44 bg-(--color-bg-surface-hover)" />
      <div className="px-4 pt-6 pb-4 space-y-2">
        <div className="h-4 bg-(--color-bg-surface-hover) rounded w-3/4" />
        <div className="h-3 bg-(--color-bg-surface-hover) rounded w-1/2" />
        <div className="h-3 bg-(--color-bg-surface-hover) rounded w-2/3" />
      </div>
    </div>
  );
}

function ListSkeletonRow() {
  return (
    <div className="h-26 bg-(--color-bg-surface) rounded-2xl border border-(--color-border-default) animate-pulse" />
  );
}

export default function RoomsGrid({
  rooms,
  loading,
  loadingMore,
  viewMode,
  joiningRoomId,
  searchQuery,
  onJoin,
}: RoomsGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <GridSkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (rooms.length === 0 && searchQuery) {
    return (
      <div className="py-16 flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-full bg-(--color-bg-page) flex items-center justify-center mb-4">
          <SearchOffOutlinedIcon sx={{ fontSize: 26, color: "var(--color-text-hint)" }} />
        </div>
        <div className="text-[15px] font-semibold text-(--color-text-primary)">No rooms found</div>
        <div className="text-sm text-(--color-text-secondary) mt-1">
          Try a different search term or category
        </div>
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="flex flex-col gap-3">
        {rooms.map((room) => (
          <RoomListItem
            key={room.roomId}
            room={room}
            joining={joiningRoomId === room.roomId}
            onJoin={onJoin}
          />
        ))}
        {loadingMore &&
          Array.from({ length: 3 }).map((_, i) => <ListSkeletonRow key={i} />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {rooms.map((room) => (
        <RoomCard
          key={room.roomId}
          room={room}
          joining={joiningRoomId === room.roomId}
          onJoin={onJoin}
        />
      ))}
      {loadingMore &&
        Array.from({ length: 3 }).map((_, i) => <GridSkeletonCard key={i} />)}
    </div>
  );
}
