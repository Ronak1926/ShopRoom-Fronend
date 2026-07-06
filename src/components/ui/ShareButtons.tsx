"use client";

import { useState } from "react";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";

interface ShareButtonsProps {
  inviteLink: string;
}

/**
 * The invite-link copy field + WhatsApp/Instagram/native-share row —
 * extracted from ShareModal so it can be embedded directly in a tab (Room
 * Info's Share tab) without nesting a second modal, while ShareModal (still
 * used from the dashboard's own Quick Actions) wraps this exact content in
 * its own overlay chrome.
 */
export default function ShareButtons({ inviteLink }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [igCopied, setIgCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: nothing to do, clipboard unavailable
    }
  }

  async function handleInstagram() {
    try {
      await navigator.clipboard.writeText(inviteLink);
    } catch {
      // clipboard unavailable
    }
    setIgCopied(true);
    setTimeout(() => setIgCopied(false), 4000);
    window.open(
      "https://www.instagram.com/direct/inbox/",
      "_blank",
      "noopener,noreferrer",
    );
  }

  async function handleNativeShare() {
    try {
      await navigator.share({
        title: "Join my ShopRoom",
        text: "Join my shop's room on ShopRoom to get stock alerts and new arrivals!",
        url: inviteLink,
      });
    } catch {
      // user cancelled or share not supported
    }
  }

  const canNativeShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  return (
    <div>
      {/* Link copy field */}
      <div className="flex items-center gap-2 bg-(--color-bg-page) rounded-[10px] p-3 mb-5 border border-(--color-border-default)">
        <span className="flex-1 text-[12px] text-(--color-text-secondary) truncate font-mono select-all">
          {inviteLink}
        </span>
        <button
          onClick={handleCopy}
          className={`shrink-0 flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12px] font-semibold transition-all cursor-pointer border-0 ${
            copied
              ? "bg-emerald-500 text-white"
              : "bg-(--color-brand-primary) text-white hover:bg-(--color-brand-primary-hover)"
          }`}
        >
          {copied ? (
            <CheckOutlinedIcon sx={{ fontSize: 13 }} />
          ) : (
            <ContentCopyOutlinedIcon sx={{ fontSize: 13 }} />
          )}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Share via label */}
      <p className="text-[10px] font-bold uppercase tracking-widest text-(--color-text-secondary) mb-3">
        Share via
      </p>

      {/* Platform buttons */}
      <div className="flex gap-3">
        {/* WhatsApp */}
        <a
          href={`https://wa.me/?text=${encodeURIComponent(`Hey! Join my shop on ShopRoom 🛍️\nTap the link to enter my room and get stock alerts, new arrivals & more:\n${inviteLink}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-col items-center gap-2.5 py-4 rounded-xl border border-(--color-border-default) hover:border-[#25D366] hover:bg-[#f0fdf4] transition-colors cursor-pointer no-underline"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="#25D366">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          <span className="text-[12px] font-semibold text-(--color-text-primary)">
            WhatsApp
          </span>
        </a>

        {/* Instagram */}
        <button
          onClick={handleInstagram}
          className="flex-1 flex flex-col items-center gap-2.5 py-4 rounded-xl border border-(--color-border-default) hover:border-[#E1306C] hover:bg-[#fff0f5] transition-colors cursor-pointer"
        >
          <svg width="26" height="26" viewBox="0 0 24 24">
            <defs>
              <linearGradient id="sr-ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F58529" />
                <stop offset="50%" stopColor="#E1306C" />
                <stop offset="100%" stopColor="#833AB4" />
              </linearGradient>
            </defs>
            <path
              fill="url(#sr-ig-grad)"
              d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
            />
          </svg>
          <span className="text-[12px] font-semibold text-(--color-text-primary)">
            Instagram
          </span>
        </button>

        {/* More — native share (mobile / supported browsers) */}
        {canNativeShare && (
          <button
            onClick={handleNativeShare}
            className="flex-1 flex flex-col items-center gap-2.5 py-4 rounded-xl border border-(--color-border-default) hover:border-(--color-brand-primary) hover:bg-(--color-brand-primary-light) transition-colors cursor-pointer"
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-brand-primary)"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            <span className="text-[12px] font-semibold text-(--color-text-primary)">
              More
            </span>
          </button>
        )}
      </div>

      {/* Instagram hint — shown after clicking Instagram */}
      {igCopied && (
        <div className="mt-4 flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-[10px] px-3 py-2.5">
          <CheckOutlinedIcon sx={{ fontSize: 14, color: "#10b981" }} />
          <span className="text-[12px] text-emerald-700 font-medium">
            Link copied! Paste it in your Instagram story or DM.
          </span>
        </div>
      )}
    </div>
  );
}
