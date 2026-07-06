"use client";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ShareButtons from "./ShareButtons";

interface ShareModalProps {
  inviteLink: string;
  onClose: () => void;
}

export default function ShareModal({ inviteLink, onClose }: ShareModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-105 bg-(--color-bg-surface) rounded-[18px] p-6 shadow-[0_24px_64px_rgba(25,25,47,0.22)] border border-(--color-border-default)"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-[18px] font-bold text-(--color-text-primary) tracking-[-0.4px]">
              Share Room Link
            </h2>
            <p className="text-[13px] text-(--color-text-secondary) mt-0.5">
              Invite customers to join your ShopRoom
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-(--color-bg-page) text-(--color-text-secondary) hover:text-(--color-text-primary) transition-colors shrink-0"
          >
            <CloseOutlinedIcon sx={{ fontSize: 18 }} />
          </button>
        </div>

        <ShareButtons inviteLink={inviteLink} />
      </div>
    </div>
  );
}
