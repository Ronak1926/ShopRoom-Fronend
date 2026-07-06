"use client";

import { useMemo, useState } from "react";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import Avatar from "@/components/ui/Avatar";
import ShareModal from "@/components/ui/ShareModal";
import type { RoomDetails } from "./types";

interface RoomInfoPanelProps {
  room: RoomDetails;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Full-page Room Info — styled like the shopkeeper's own profile page
 * (ProfileShopCard + ProfileShopDetailsCard), just given the room page's
 * full width/height instead of a cramped modal. Sharing lives here as a
 * button rather than its own tab, opening the same ShareModal used
 * elsewhere in the app (e.g. the dashboard's Quick Actions).
 */
export default function RoomInfoPanel({ room }: RoomInfoPanelProps) {
  const [showShare, setShowShare] = useState(false);

  const inviteLink = useMemo(
    () =>
      typeof window !== "undefined" ? `${window.location.origin}/join/${room.inviteCode}` : "",
    [room.inviteCode],
  );

  return (
    <div className="flex-1 overflow-y-auto bg-(--color-bg-page)">
      <div className="max-w-2xl mx-auto px-6 py-10 flex flex-col gap-6">
        {/* Identity */}
        <div className="bg-(--color-bg-surface) border border-(--color-border-default) rounded-2xl p-8 flex flex-col items-center text-center gap-4">
          <Avatar name={room.shopName} src={room.logoUrl} size="xl" />
          <div>
            <h1 className="text-2xl font-bold text-(--color-text-primary) leading-snug">
              {room.shopName}
            </h1>
            <span className="inline-block mt-3 px-3.5 py-1.5 rounded-full text-[12px] font-semibold bg-(--color-brand-primary-light) text-(--color-brand-primary)">
              {room.category}
            </span>
          </div>
          <p className="text-sm text-(--color-text-secondary)">
            Room created{" "}
            <span className="font-medium text-(--color-text-primary)">
              {formatDate(room.createdAt)}
            </span>
          </p>
        </div>

        {/* Share — button, not its own tab; opens the site's common share modal */}
        <button
          onClick={() => setShowShare(true)}
          className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-(--color-brand-primary) hover:bg-(--color-brand-primary-hover) text-white text-sm font-semibold border-0 cursor-pointer transition-colors"
        >
          <ShareOutlinedIcon sx={{ fontSize: 18 }} />
          Share Room Link
        </button>

        {/* Description */}
        {room.description && (
          <div className="bg-(--color-bg-surface) border border-(--color-border-default) rounded-2xl p-6">
            <h2 className="text-[15px] font-bold text-(--color-text-primary) mb-2">About</h2>
            <p className="text-[14px] text-(--color-text-secondary) leading-relaxed">
              {room.description}
            </p>
          </div>
        )}

        {/* Details */}
        <div className="bg-(--color-bg-surface) border border-(--color-border-default) rounded-2xl p-6 flex flex-col gap-5">
          <h2 className="text-[15px] font-bold text-(--color-text-primary)">Shop Details</h2>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-(--color-text-hint) mb-1.5">
              Address
            </p>
            <div className="bg-(--color-bg-page) border border-(--color-border-default) rounded-xl px-4 py-3">
              <p className="text-[14px] text-(--color-text-primary) leading-relaxed">
                {room.address}
                <br />
                {room.city}, {room.state} – {room.pincode}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-(--color-brand-primary-light) flex items-center justify-center shrink-0">
              <LocalPhoneOutlinedIcon sx={{ fontSize: 17, color: "var(--color-brand-primary)" }} />
            </div>
            <div>
              <p className="text-[11px] text-(--color-text-hint) uppercase tracking-wide">Phone</p>
              <a
                href={`tel:${room.phoneNumber}`}
                className="text-[14px] font-medium text-(--color-text-primary) hover:text-(--color-brand-primary) transition-colors"
              >
                {room.phoneNumber}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-(--color-brand-primary-light) flex items-center justify-center shrink-0">
              <PeopleOutlinedIcon sx={{ fontSize: 17, color: "var(--color-brand-primary)" }} />
            </div>
            <div>
              <p className="text-[11px] text-(--color-text-hint) uppercase tracking-wide">Members</p>
              <p className="text-[14px] font-medium text-(--color-text-primary)">
                {room.membersCount} people in this room
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-(--color-brand-primary-light) flex items-center justify-center shrink-0">
              <CalendarTodayOutlinedIcon sx={{ fontSize: 16, color: "var(--color-brand-primary)" }} />
            </div>
            <div>
              <p className="text-[11px] text-(--color-text-hint) uppercase tracking-wide">Created</p>
              <p className="text-[14px] font-medium text-(--color-text-primary)">
                {formatDate(room.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {showShare && <ShareModal inviteLink={inviteLink} onClose={() => setShowShare(false)} />}
    </div>
  );
}
