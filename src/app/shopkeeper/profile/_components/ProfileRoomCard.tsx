"use client";

import { useState } from "react";
import Image from "next/image";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";

interface Props {
  membersCount: number;
  inviteCode: string;
  createdAt: string;
  coverUrl: string | null;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ProfileRoomCard({
  membersCount,
  inviteCode,
  createdAt,
  coverUrl,
}: Props) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(inviteCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="bg-(--color-bg-surface) border border-(--color-border-default) rounded-2xl p-6 flex flex-col gap-4">
      <span className="text-[13px] font-semibold text-(--color-text-secondary) uppercase tracking-wide">
        Room
      </span>

      {/* Cover thumbnail */}
      {coverUrl && (
        <div className="w-full h-14 rounded-lg overflow-hidden">
          <Image
            src={coverUrl}
            alt="Room cover"
            width={320}
            height={56}
            className="object-cover w-full h-full"
          />
        </div>
      )}

      {/* Members */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-(--color-text-secondary)">
          <PeopleOutlinedIcon sx={{ fontSize: 16 }} />
          <span className="text-[13px]">Members</span>
        </div>
        <span className="text-[17px] font-bold text-(--color-text-primary)">
          {membersCount}
        </span>
      </div>

      {/* Invite code */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[13px] text-(--color-text-secondary)">
          Invite Code
        </span>
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[12px] bg-(--color-bg-page) border border-(--color-border-default) rounded-md px-2 py-0.5 text-(--color-text-primary)">
            {inviteCode}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="w-6 h-6 flex items-center justify-center rounded-md text-(--color-text-secondary) hover:text-(--color-brand-primary) hover:bg-(--color-brand-primary-light) transition-colors cursor-pointer bg-transparent border-0"
          >
            {copied ? (
              <CheckOutlinedIcon sx={{ fontSize: 14 }} />
            ) : (
              <ContentCopyOutlinedIcon sx={{ fontSize: 14 }} />
            )}
          </button>
        </div>
      </div>

      {/* Created date */}
      <div className="flex items-center justify-between pt-1 border-t border-(--color-border-default)">
        <span className="text-[12px] text-(--color-text-hint)">
          Room created
        </span>
        <span
          className="text-[12px] font-medium text-(--color-text-secondary)"
          suppressHydrationWarning
        >
          {formatDate(createdAt)}
        </span>
      </div>
    </div>
  );
}
