"use client";

import { useState } from "react";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ReactionPicker from "./ReactionPicker";

interface MessageActionsProps {
  isOwnMessage: boolean;
  deletedForEveryone: boolean;
  /** Own message, still within the 1h window, and not yet seen by anyone
   * else — the live-hide gate for Edit / Delete-for-everyone. */
  canModify: boolean;
  /** Keeps the row visible on touch devices (no :hover) after a tap. */
  forceVisible: boolean;
  onReply: () => void;
  onReact: (emoji: string) => void;
  onCopy: () => void;
  onEdit: () => void;
  onDeleteForMe: () => void;
  onDeleteForEveryone: () => void;
}

/** Hover-reveal (desktop) / tap-reveal (touch) icon row next to a bubble. */
export default function MessageActions({
  isOwnMessage,
  deletedForEveryone,
  canModify,
  forceVisible,
  onReply,
  onReact,
  onCopy,
  onEdit,
  onDeleteForMe,
  onDeleteForEveryone,
}: MessageActionsProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const iconButtonClass =
    "w-7 h-7 flex items-center justify-center rounded-full border-0 bg-(--color-bg-surface) shadow-(--shadow-xs) cursor-pointer text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover) hover:text-(--color-text-primary) transition-colors";

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`absolute top-0 ${isOwnMessage ? "right-full mr-1" : "left-full ml-1"} flex items-center gap-1 transition-opacity ${
        forceVisible || showPicker || showMenu
          ? "opacity-100"
          : "opacity-0 group-hover:opacity-100 focus-within:opacity-100"
      }`}
    >
      {!deletedForEveryone && (
        <>
          <button type="button" title="Reply" onClick={onReply} className={iconButtonClass}>
            <ReplyOutlinedIcon sx={{ fontSize: 16 }} />
          </button>

          <div className="relative">
            <button
              type="button"
              title="React"
              onClick={() => setShowPicker((v) => !v)}
              className={iconButtonClass}
            >
              <EmojiEmotionsOutlinedIcon sx={{ fontSize: 16 }} />
            </button>
            {showPicker && (
              <ReactionPicker
                align={isOwnMessage ? "right" : "left"}
                onSelect={onReact}
                onClose={() => setShowPicker(false)}
              />
            )}
          </div>

          <button type="button" title="Copy" onClick={onCopy} className={iconButtonClass}>
            <ContentCopyOutlinedIcon sx={{ fontSize: 15 }} />
          </button>
        </>
      )}

      <div className="relative">
        <button
          type="button"
          title="More"
          onClick={() => setShowMenu((v) => !v)}
          className={iconButtonClass}
        >
          <MoreVertOutlinedIcon sx={{ fontSize: 16 }} />
        </button>
        {showMenu && (
          <div
            className={`absolute z-30 top-full mt-1 ${isOwnMessage ? "right-0" : "left-0"} w-44 bg-(--color-bg-surface) border border-(--color-border-default) rounded-xl shadow-(--shadow-md) py-1 flex flex-col`}
          >
            {isOwnMessage && canModify && !deletedForEveryone && (
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onEdit();
                }}
                className="flex items-center gap-2 px-3 py-2 text-[13px] text-(--color-text-primary) bg-transparent border-0 cursor-pointer hover:bg-(--color-bg-surface-hover) text-left"
              >
                <EditOutlinedIcon sx={{ fontSize: 16 }} /> Edit
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setShowMenu(false);
                onDeleteForMe();
              }}
              className="flex items-center gap-2 px-3 py-2 text-[13px] text-(--color-text-primary) bg-transparent border-0 cursor-pointer hover:bg-(--color-bg-surface-hover) text-left"
            >
              <DeleteOutlineOutlinedIcon sx={{ fontSize: 16 }} /> Delete for me
            </button>
            {isOwnMessage && canModify && !deletedForEveryone && (
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onDeleteForEveryone();
                }}
                className="flex items-center gap-2 px-3 py-2 text-[13px] text-(--color-danger) bg-transparent border-0 cursor-pointer hover:bg-(--color-danger-light) text-left"
              >
                <DeleteOutlineOutlinedIcon sx={{ fontSize: 16 }} /> Delete for everyone
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
